import { useEffect, useState } from "react";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import "react-reflex/styles.css";
import { PageHeader, PageContent } from "../../components/layout";
import { Button, EmptyState } from "../../components/ui";
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
  const [tableFlex, setTableFlex] = useState(1);
  const [detailFlex, setDetailFlex] = useState(0);

useEffect(() => {
  handleSplitterBehavior(!!selectedTask);
}, [selectedTask]);

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

const emptyStateMessage = (
<EmptyState
    title="No tasks found"
    description="Create your first task to automate journal entry posting and reversals"
    action={<Button onPress={handleCreateTask}>Create Task</Button>}
  />
);

const handleSplitterBehavior = (isResizing: boolean) => {
  // if no task is selected, left-pane should be full size in width
  if (!isResizing) {
    setTableFlex(1);
    setDetailFlex(0);
  } else {
    // if a task is selected, right-pane should be full width 
    // // but if the user drags the splitter, they can adjust the width of both panes
    setTableFlex(0);
    setDetailFlex(1);
  }
};

  return (
    <div className="h-full w-full flex flex-col">
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
         <ReflexContainer orientation="vertical">
          <ReflexElement className="left-pane" flex={tableFlex} minSize={10}>
            <TaskTable
              tasks={tasks}
              onRunTask={handleRunTask}
              onDeleteTask={handleDeleteTask}
              onViewTask={handleViewTask}
            />
          </ReflexElement>

          <ReflexSplitter className="cursor-col-resize" />

          <ReflexElement
            className="right-pane"
            flex={detailFlex}
            minSize={selectedTask ? 260 : 0}
            maxSize={selectedTask ? 800 : 0}
            
          >
            {selectedTask && (
              <TaskDetail task={selectedTask} handleClosePanel={handleClosePanel} />
            )}
          </ReflexElement>
        </ReflexContainer>
        ) : (
          emptyStateMessage
        )}
      </PageContent>
    </div>
  );
}