import type { Task, LineItem, ProposedJournalEntry } from '../../types';
import { TaskType } from '../../types';

export const calculateTotals = (lineItems: LineItem[]) => {
  const totalDebits = lineItems.reduce((sum, item) => sum + item.debit, 0);
  const totalCredits = lineItems.reduce((sum, item) => sum + item.credit, 0);
  return { totalDebits, totalCredits, isBalanced: totalDebits === totalCredits };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const isPostJournalEntryTask = (task: Task): task is Task & { proposedAction: ProposedJournalEntry } => {
  return task.type === TaskType.POST_JOURNAL_ENTRY && !!task.proposedAction;
};

export const isReverseJournalEntryTask = (task: Task): task is Task & { proposedAction: { journalEntryId: string } } => {
  return task.type === TaskType.REVERSE_JOURNAL_ENTRY && !!task.proposedAction;
};

export const canExecuteAction = (task: Task): boolean => {
  return !!task.proposedAction && 
    (task.type === TaskType.POST_JOURNAL_ENTRY || task.type === TaskType.REVERSE_JOURNAL_ENTRY);
};