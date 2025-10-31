import { TaskType } from '../../types';

export interface TaskTypeOption {
  id: TaskType;
  label: string;
  description: string;
  icon?: string; // Optional
}

export const TASK_TYPE_OPTIONS: TaskTypeOption[] = [
  {
    id: TaskType.POST_JOURNAL_ENTRY,
    label: 'Post Journal Entry',
    description: 'Create a new journal entry with debits and credits',
  },
  {
    id: TaskType.REVERSE_JOURNAL_ENTRY,
    label: 'Reverse Journal Entry',
    description: 'Reverse an existing journal entry',
  },
  {
    id: TaskType.OTHER,
    label: 'Other',
    description: 'Custom task with no predefined action',
  },
];