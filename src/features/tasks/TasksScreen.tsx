import { useEffect, useState } from "react";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import "react-reflex/styles.css";
import { PageHeader, PageContent } from "../../components/layout";
import { Button, EmptyState } from "../../components/ui";
import { TaskTable } from "./TaskTable";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useRunTaskMutation,
  useDeleteTaskMutation,
} from "./tasksApi";
import type { Task, TaskType as TaskTypeEnum } from "../../types";
import { TaskDetail } from "./TaskDetail";
import { CreateTaskForm } from "./CreateTaskForm";

export function TasksScreen() {
  const { data: tasks = [], isLoading } = useGetTasksQuery(undefined, {
    pollingInterval: 1000,
  });
  const [runTask] = useRunTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [tableFlex, setTableFlex] = useState(1);
  const [detailFlex, setDetailFlex] = useState(0);

  const handleSplitterBehavior = (isResizing: boolean) => {
    if (!isResizing) {
      setTableFlex(1);
      setDetailFlex(0);
    } else {
      setTableFlex(0.5);
      setDetailFlex(0.5);
    }
  };

  useEffect(() => {
    handleSplitterBehavior(!!selectedTask || isCreatingTask);
  }, [selectedTask, isCreatingTask]);

  // Sync selectedTask with updated task data from the query
  useEffect(() => {
    if (selectedTask) {
      const updatedTask = tasks.find((t) => t.id === selectedTask.id);
      if (updatedTask) {
        // Update selectedTask with the latest data
        setSelectedTask(updatedTask);
      } else {
        // Task was deleted, close the panel
        setSelectedTask(null);
      }
    }
  }, [tasks, selectedTask?.id]);

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
      setIsCreatingTask(false);
    }
  };

  const handleClosePanel = () => {
    setSelectedTask(null);
    setIsCreatingTask(false);
  };

  const handleCreateTask = () => {
    setIsCreatingTask(true);
    setSelectedTask(null);
  };

  const handleSubmitTask = async (taskData: { title: string; description: string; type: TaskTypeEnum }) => {
    try {
      await createTask(taskData).unwrap();
      // Close the form after successful submission
      setIsCreatingTask(false);
      // The task will automatically appear in the list due to cache invalidation
    } catch (error) {
      console.error("Failed to create task:", error);
    }
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

  const showRightPanel = selectedTask || isCreatingTask;
  const rightPanelContent = selectedTask ? (
    <TaskDetail task={selectedTask} handleClosePanel={handleClosePanel} />
  ) : isCreatingTask ? (
    <CreateTaskForm 
      onClose={handleClosePanel} 
      onSubmit={handleSubmitTask}
      isSubmitting={isCreating}
    />
  ) : null;

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
        {tasks.length > 0 || isCreatingTask ? (
          <ReflexContainer orientation="vertical">
            <ReflexElement className="left-pane" flex={tableFlex} minSize={100}>
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
              flex={showRightPanel ? detailFlex : 0}
              minSize={showRightPanel ? 200 : 0}
              maxSize={showRightPanel ? 1600 : 0}
            >
              {rightPanelContent}
            </ReflexElement>
          </ReflexContainer>
        ) : (
          emptyStateMessage
        )}
      </PageContent>
    </div>
  );
}