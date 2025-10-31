import {
  TaskType,
  TaskStatus,
  type Task,
  type ProposedJournalEntry,
} from "../../types";

export const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Monthly Payroll Processing",
    description: "Post monthly payroll journal entry for all employees",
    type: TaskType.POST_JOURNAL_ENTRY,
    status: TaskStatus.PENDING_RUN,
    createdAt: "2024-10-01T10:00:00Z",
  },
  {
    id: "task-2",
    title: "Office Rent Payment",
    description: "Record monthly office rent expense",
    type: TaskType.POST_JOURNAL_ENTRY,
    status: TaskStatus.PENDING_RUN,
    createdAt: "2024-10-15T14:00:00Z",
  },
  {
    id: "task-3",
    title: "Reverse Incorrect Payroll Entry",
    description:
      "Reverse the payroll entry JE-001 posted on Oct 15th due to calculation error",
    type: TaskType.REVERSE_JOURNAL_ENTRY,
    status: TaskStatus.PENDING_ACTION,
    proposedAction: {
      journalEntryId: "je-001",
    },
    lastRunAt: "2024-10-20T11:30:00Z",
    createdAt: "2024-10-20T11:30:00Z",
  },
  {
    id: "task-4",
    title: "Reverse Non-Existent Entry (Error Case)",
    description: "This task will fail because journal entry JE-999 does not exist in the system",
    type: TaskType.REVERSE_JOURNAL_ENTRY,
    status: TaskStatus.PENDING_ACTION,
    proposedAction: {
      journalEntryId: "je-999",
    },
    lastRunAt: "2024-10-18T16:45:00Z",
    createdAt: "2024-10-18T16:45:00Z",
  },
  {
    id: "task-5",
    title: "Reverse Equipment Purchase Entry",
    description: "Reverse the equipment purchase entry JE-003 due to vendor cancellation",
    type: TaskType.REVERSE_JOURNAL_ENTRY,
    status: TaskStatus.PENDING_RUN,
    createdAt: "2024-10-22T09:00:00Z",
  },
];

export const SAMPLE_PROPOSED_ENTRY: ProposedJournalEntry = {
  date: "2024-10-26",
  description: "Sample journal entry",
  lineItems: [
    {
      id: "li-1",
      account: "Salaries Expense",
      debit: 10000,
      credit: 0,
      memo: "Sample debit",
    },
    {
      id: "li-2",
      account: "Cash",
      debit: 0,
      credit: 10000,
      memo: "Sample credit",
    }
  ],
};
