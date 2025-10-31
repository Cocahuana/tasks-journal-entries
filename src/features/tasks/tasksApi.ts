import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  TaskType,
  TaskStatus,
  type Task,
  type PostJournalEntryTask,
  type ReverseJournalEntryTask,
} from "../../types";
import { SAMPLE_PROPOSED_ENTRY } from "./mockData";

let tasks: Task[] = [];

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return { data: tasks };
      },
      providesTags: ["Task"],
    }),
    createTask: builder.mutation<Task, { title: string; description: string; type: TaskType }>({
      queryFn: async (taskData) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const createdAt = new Date().toISOString()
        const newTask: Task = {
          id: `task-${Date.now()}`,
          title: taskData.title,
          description: taskData.description,
          type: taskData.type,
          status: TaskStatus.PENDING_RUN,
          createdAt: createdAt,
        };

        tasks = [...tasks, newTask];
        return { data: newTask };
      },
      invalidatesTags: ["Task"],
    }),

    runTask: builder.mutation<Task, string>({
      queryFn: async (taskId) => {
        const taskIndex = tasks.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) {
          return { error: { status: 404, data: "Task not found" } };
        }

        const task = tasks[taskIndex];
        const updatedTask = { ...task, status: TaskStatus.RUNNING };
        tasks = [
          ...tasks.slice(0, taskIndex),
          updatedTask,
          ...tasks.slice(taskIndex + 1),
        ];

        setTimeout(async () => {
          const currentTaskIndex = tasks.findIndex((t) => t.id === taskId);
          if (currentTaskIndex === -1) return;

          const currentTask = tasks[currentTaskIndex];

          if (currentTask.type === TaskType.POST_JOURNAL_ENTRY) {
            const taskWithAction: PostJournalEntryTask = {
              ...currentTask,
              proposedAction: SAMPLE_PROPOSED_ENTRY,
              status: TaskStatus.COMPLETED,
              lastRunAt: new Date().toISOString(),
            } as PostJournalEntryTask;

            tasks = [
              ...tasks.slice(0, currentTaskIndex),
              taskWithAction,
              ...tasks.slice(currentTaskIndex + 1),
            ];

            // TODO: Post to journal entries
          } else if (currentTask.type === TaskType.REVERSE_JOURNAL_ENTRY) {
            const taskWithAction: ReverseJournalEntryTask = {
              ...currentTask,
              proposedAction: {
                // TODO: Get a random journal entry id from the journal entries
                journalEntryId: "je-001",
              },
              status: TaskStatus.COMPLETED,
              lastRunAt: new Date().toISOString(),
            } as ReverseJournalEntryTask;

            tasks = [
              ...tasks.slice(0, currentTaskIndex),
              taskWithAction,
              ...tasks.slice(currentTaskIndex + 1),
            ];

            // TODO: Remove from journal entries
          }
        }, 5000);

        return { data: updatedTask };
      },
      invalidatesTags: ["Task"],
    }),

    deleteTask: builder.mutation<void, string>({
      queryFn: async (taskId) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        tasks = tasks.filter((t) => t.id !== taskId);
        return { data: undefined };
      },
      invalidatesTags: ["Task"],
    }),
  }),
});

export const initializeTasks = (initialTasks: Task[]) => {
  tasks = [...initialTasks];
};

export const { useGetTasksQuery, useRunTaskMutation, useDeleteTaskMutation, useCreateTaskMutation } =
  tasksApi;
