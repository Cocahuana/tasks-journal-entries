import type { JournalEntry } from "../../types";

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "je-001",
    entryNumber: "JE-001",
    date: "2024-10-15",
    description: "Monthly Payroll - September 2024",
    lineItems: [
      {
        id: "li-je001-1",
        account: "Salaries Expense",
        debit: 12500,
        credit: 0,
        memo: "Employee salaries for September",
      },
      {
        id: "li-je001-2",
        account: "Cash",
        debit: 0,
        credit: 12500,
        memo: "Payment to employees",
      },
    ],
    createdAt: "2024-10-15T10:00:00Z",
  },
  {
    id: "je-002",
    entryNumber: "JE-002",
    date: "2024-10-01",
    description: "October Rent Payment",
    lineItems: [
      {
        id: "li-je002-1",
        account: "Rent Expense",
        debit: 3500,
        credit: 0,
        memo: "Office rent for October",
      },
      {
        id: "li-je002-2",
        account: "Cash",
        debit: 0,
        credit: 3500,
        memo: "Payment to landlord",
      },
    ],
    createdAt: "2024-10-01T14:00:00Z",
  },
  {
    id: "je-003",
    entryNumber: "JE-003",
    date: "2024-10-10",
    description: "Equipment Purchase",
    lineItems: [
      {
        id: "li-je003-1",
        account: "Equipment",
        debit: 8000,
        credit: 0,
        memo: "New computer equipment",
      },
      {
        id: "li-je003-2",
        account: "Cash",
        debit: 0,
        credit: 5000,
        memo: "Downpayment",
      },
      {
        id: "li-je003-3",
        account: "Accounts Payable",
        debit: 0,
        credit: 3000,
        memo: "Balance to be paid",
      },
    ],
    createdAt: "2024-10-10T11:30:00Z",
  },
  {
    id: "je-004",
    entryNumber: "JE-004",
    date: "2024-10-20",
    description: "Revenue Recognition - Client A",
    lineItems: [
      {
        id: "li-je004-1",
        account: "Cash",
        debit: 15000,
        credit: 0,
        memo: "Payment received from Client A",
      },
      {
        id: "li-je004-2",
        account: "Revenue",
        debit: 0,
        credit: 15000,
        memo: "Service revenue",
      },
    ],
    createdAt: "2024-10-20T16:45:00Z",
  },
];

