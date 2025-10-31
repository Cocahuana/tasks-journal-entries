import { useState } from "react";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import "react-reflex/styles.css";
import { Close } from "flowbite-react-icons/outline";
import { PageHeader, PageContent } from "../../components/layout";
import { Button, EmptyState } from "../../components/ui";
import { TaskTable } from "./TaskTable";
import {
  useGetTasksQuery,
  useRunTaskMutation,
  useDeleteTaskMutation,
} from "./tasksApi";
import type { Task } from "../../types";

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
          <ReflexContainer orientation="vertical" className="h-full w-full min-w-0">
            <ReflexElement className="left-pane" minSize={400}>
              <TaskTable
                tasks={tasks}
                onRunTask={handleRunTask}
                onDeleteTask={handleDeleteTask}
                onViewTask={handleViewTask}
              />
            </ReflexElement>

            {selectedTask && (
              <>
                <ReflexSplitter />
                <ReflexElement className="right-pane" minSize={300} flex={0.4}>
                  <div className="h-full border-l border-gray-300 bg-white overflow-auto">
                    <div className="p-4 border-b border-gray-300 flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Task Details</h2>
                      <button
                        onClick={handleClosePanel}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Close className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-semibold mb-2">
                        {selectedTask.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {selectedTask.description}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Status: </span>
                          <span>{selectedTask.status}</span>
                        </div>
                        <div>
                          <span className="font-medium">Type: </span>
                          <span>{selectedTask.type}</span>
                        </div>
                        <div>
                          <span className="font-medium">Created: </span>
                          <span>
                            {new Date(selectedTask.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {selectedTask.lastRunAt && (
                          <div>
                            <span className="font-medium">Last Run: </span>
                            <span>
                              {new Date(
                                selectedTask.lastRunAt
                              ).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {selectedTask.lastRunError && (
                          <div className="text-red-600">
                            <span className="font-medium">Error: </span>
                            <span>{selectedTask.lastRunError}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ReflexElement>
              </>
            )}
          </ReflexContainer>
        ) : (
          <EmptyState
            title="No tasks found"
            description="Create your first task to automate journal entry posting and reversals"
            action={<Button onPress={handleCreateTask}>Create Task</Button>}
          />
        )}
      </PageContent>
    </div>
  );
}
