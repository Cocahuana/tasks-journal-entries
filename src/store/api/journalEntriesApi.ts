import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type { JournalEntry, ProposedJournalEntry } from "../../types";

let journalEntries: JournalEntry[] = [];

export const journalEntriesApi = createApi({
  reducerPath: "journalEntriesApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["JournalEntry"],
  endpoints: (builder) => ({
    getJournalEntries: builder.query<JournalEntry[], void>({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { data: journalEntries };
      },
      providesTags: ["JournalEntry"],
    }),
    
    createJournalEntry: builder.mutation<JournalEntry, ProposedJournalEntry>({
      queryFn: async (proposedEntry) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const entryNumber = `JE-${String(journalEntries.length + 1).padStart(3, '0')}`;
        const newEntry: JournalEntry = {
          id: `je-${Date.now()}`,
          entryNumber,
          date: proposedEntry.date,
          description: proposedEntry.description,
          lineItems: proposedEntry.lineItems,
          createdAt: new Date().toISOString(),
        };

        journalEntries = [...journalEntries, newEntry];
        return { data: newEntry };
      },
      invalidatesTags: ["JournalEntry"],
    }),

    deleteJournalEntry: builder.mutation<void, string>({
      queryFn: async (journalEntryId) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const entryExists = journalEntries.some((entry) => entry.id === journalEntryId);
        if (!entryExists) {
          return { error: { status: 404, data: "Journal entry not found" } };
        }

        journalEntries = journalEntries.filter((entry) => entry.id !== journalEntryId);
        return { data: undefined };
      },
      invalidatesTags: ["JournalEntry"],
    }),
  }),
});

export const initializeJournalEntries = (initialEntries: JournalEntry[]) => {
  journalEntries = [...initialEntries];
};

export const getJournalEntries = () => journalEntries;

export const { 
  useGetJournalEntriesQuery, 
  useCreateJournalEntryMutation,
  useDeleteJournalEntryMutation,
} = journalEntriesApi;
