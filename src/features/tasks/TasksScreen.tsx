import { useState } from "react";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import "react-reflex/styles.css";
import { PageHeader, PageContent } from "../../components/layout";
import { Button } from "../../components/ui";
import { TaskTable } from "./TaskTable";
import {
  useGetTasksQuery,
  useRunTaskMutation,
  useDeleteTaskMutation,
} from "./tasksApi";
import type { Task } from "../../types";
import { TaskDetail } from "./TaskDetail";
export function TasksScreen() {
  const { data: tasks = [], isLoading } = useGetTasksQuery(undefined, {
    pollingInterval: 1000,
  });
  const [runTask] = useRunTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleRunTask = async (taskId: string) => {
    try {
      await runTask(taskId).unwrap();
    } catch (error) {
      console.error("Failed to run task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId).unwrap();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleViewTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
    }
  };

  const handleClosePanel = () => {
    setSelectedTask(null);
  };

  const handleCreateTask = () => {
    console.log("Create task clicked");
    // TODO: Implement create task logic
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white">
      <PageHeader
        title="Tasks"
        description="Manage journal entry automation tasks"
        actions={
          <>
            <Button variant="secondary" size="sm">
              Filters
            </Button>
            <Button size="sm" onPress={handleCreateTask}>
              Create Task
            </Button>
          </>
        }
      />
      <PageContent>
         {tasks.length > 0 ? (
          <ReflexContainer orientation="vertical" >
            <ReflexElement className="left-pane" minSize={10}>
              <TaskTable
                tasks={tasks}
                onRunTask={handleRunTask}
                onDeleteTask={handleDeleteTask}
                onViewTask={handleViewTask}
              />
            </ReflexElement>

            <ReflexSplitter  className="bg-gray-200 cursor-col-resize" />
            <ReflexElement className="right-pane" maxSize={selectedTask ? 800 : 0} minSize={selectedTask ? 10 : 0}>
              {selectedTask && (
                  <TaskDetail task={selectedTask} handleClosePanel={handleClosePanel} />
              )}
            </ReflexElement>
          </ReflexContainer>
        ) : (
          <></>
        )}
      </PageContent>
    </div>
  );
}
