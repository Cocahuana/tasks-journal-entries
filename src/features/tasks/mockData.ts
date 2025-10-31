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
      "Reverse the payroll entry posted on Oct 15th due to calculation error",
    type: TaskType.REVERSE_JOURNAL_ENTRY,
    status: TaskStatus.PENDING_RUN,
    createdAt: "2024-10-20T11:30:00Z",
  },
  {
    id: "task-4",
    title: "Reverse Duplicate Revenue Entry",
    description: "Reverse duplicate revenue recognition entry from last month",
    type: TaskType.REVERSE_JOURNAL_ENTRY,
    status: TaskStatus.PENDING_RUN,
    createdAt: "2024-10-18T16:45:00Z",
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
