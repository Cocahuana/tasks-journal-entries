// TaskDetail.tsx
import type { Task } from '../../types';
import { TaskStatus } from '../../types';
import { Close } from "flowbite-react-icons/outline";
import { Table, TableHeader, TableBody, Row, Cell, Column, Button } from '../../components/ui';
import { useCompleteTaskMutation } from './tasksApi';
import { useCreateJournalEntryMutation, useDeleteJournalEntryMutation, useGetJournalEntriesQuery } from '../../store/api/journalEntriesApi';
import { calculateTotals, formatCurrency, isPostJournalEntryTask, isReverseJournalEntryTask, canExecuteAction } from './taskHelpers';
import { TaskDetailItem } from './TaskDetailItem';

type Props = {
  task: Task;
  handleClosePanel: () => void;
}

export function TaskDetail(props: Props) {
  const { task, handleClosePanel } = props;
  const [completeTask, { isLoading: isCompleting }] = useCompleteTaskMutation();
  const [createJournalEntry, { isLoading: isCreatingEntry }] = useCreateJournalEntryMutation();
  const [deleteJournalEntry, { isLoading: isDeletingEntry }] = useDeleteJournalEntryMutation();
  const { data: journalEntries = [] } = useGetJournalEntriesQuery();

  const lastRunAt = task.lastRunAt ? new Date(task.lastRunAt).toLocaleString() : "Never";
  const createdAt = new Date(task.createdAt).toLocaleString();

  const handleExecuteAction = async () => {
    try {
      if (isPostJournalEntryTask(task) && task.proposedAction) {
        // Create the journal entry
        await createJournalEntry(task.proposedAction).unwrap();
      } else if (isReverseJournalEntryTask(task) && task.proposedAction) {
        // Delete the journal entry
        await deleteJournalEntry(task.proposedAction.journalEntryId).unwrap();
      }
      
      // Mark the task as completed
      await completeTask(task.id).unwrap();
    } catch (error) {
      console.error('Failed to execute action:', error);
    }
  };

  const renderProposedAction = () => {
    if (isPostJournalEntryTask(task) && task.proposedAction && task.proposedAction.lineItems) {
      const { totalDebits, totalCredits, isBalanced } = calculateTotals(task.proposedAction.lineItems);
      
      return (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-lg mb-3">Proposed Journal Entry</h4>
          <div className="space-y-2">
            <TaskDetailItem label="Date" value={new Date(task.proposedAction.date).toLocaleDateString()} />
            <TaskDetailItem label="Description" value={task.proposedAction.description} />
            
            <div className="mt-3">
              <h5 className="font-medium mb-2">Line Items</h5>
              <Table aria-label="Journal entry line items">
                <TableHeader>
                  <Column width="25%">Account</Column>
                  <Column width="25%">Memo</Column>
                  <Column width="25%">Debit</Column>
                  <Column width="25%">Credit</Column>
                </TableHeader>
                <TableBody>
                  { task.proposedAction.lineItems.map((item, index) => (
                    <Row key={item.id || index}>
                      <Cell>{item.account}</Cell>
                      <Cell>{item.memo || '-'}</Cell>
                      <Cell>{item.debit > 0 ? formatCurrency(item.debit) : '-'}</Cell>
                      <Cell>{item.credit > 0 ? formatCurrency(item.credit) : '-'}</Cell>
                    </Row>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center sm:flex flex-col sm:center sm:items-center sm:gap-2 sm:py-2">
                <div className='sm:flex sm:items-center sm:justify-center'>
                  <span className="font-medium">Total Debits: </span>
                  <span>{formatCurrency(totalDebits)}</span>
                </div>
                <div className='sm:flex sm:items-center sm:justify-center'>
                  <span className="font-medium">Total Credits: </span>
                  <span>{formatCurrency(totalCredits)}</span>
                </div>
                <div className={`sm:flex px-3 py-1 rounded-full text-sm font-medium ${
                  isBalanced 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isBalanced ? 'Balanced' : 'Not Balanced'}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Use type guard and explicitly check proposedAction exists
    if (isReverseJournalEntryTask(task) && task.proposedAction) {
      const entryToReverse = journalEntries.find(
        (entry) => entry.id === task.proposedAction.journalEntryId
      );

      return (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-lg mb-3">Reverse Journal Entry</h4>
          {entryToReverse ? (
            <>
              <TaskDetailItem label="Entry Number" value={entryToReverse.entryNumber} />
              <TaskDetailItem label="Date" value={new Date(entryToReverse.date).toLocaleDateString()} />
              <TaskDetailItem label="Description" value={entryToReverse.description || '-'} />
              
              <div className="mt-3">
                <h5 className="font-medium mb-2">Line Items to be Reversed</h5>
                <Table aria-label="Journal entry line items to be reversed">
                  <TableHeader>
                    <Column width="30%">Account</Column>
                    <Column width="25%">Debit</Column>
                    <Column width="25%">Credit</Column>
                  </TableHeader>
                  <TableBody>
                    {entryToReverse.lineItems.map((item, index) => (
                      <Row key={item.id || index}>
                        <Cell>{item.account}</Cell>
                        <Cell>{item.debit > 0 ? formatCurrency(item.debit) : '-'}</Cell>
                        <Cell>{item.credit > 0 ? formatCurrency(item.credit) : '-'}</Cell>
                      </Row>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                This action will delete the specified journal entry.
              </p>
            </>
          ) : (
            <>
              <TaskDetailItem 
                label="Journal Entry ID" 
                value={task.proposedAction.journalEntryId} 
              />
              <p className="text-sm text-red-600 mt-2">
                Warning: Journal entry not found in the system.
              </p>
            </>
          )}
        </div>
      );
    }

    return null;
  };

  const showExecuteButton = canExecuteAction(task) && task.status === TaskStatus.PENDING_ACTION;
  const isExecuting = isCreatingEntry || isDeletingEntry || isCompleting;

  // Check if journal entry exists for REVERSE tasks
  const canExecuteReversalAction = () => {
    if (isReverseJournalEntryTask(task) && task.proposedAction) {
      const entryExists = journalEntries.some(
        (entry) => entry.id === task.proposedAction.journalEntryId
      );
      return entryExists;
    }
    return true; // For POST tasks, always allow execution
  };

  const shouldDisableExecuteButton = isExecuting || !canExecuteReversalAction();

  return (
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
          {task.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {task.description}
        </p>
        
        <div className="space-y-2 text-sm">
          <TaskDetailItem label="Status" value={task.status} />
          <TaskDetailItem label="Type" value={task.type} />
          <TaskDetailItem label="Created" value={createdAt} />

          {task.lastRunAt && (
            <TaskDetailItem label="Last Run" value={lastRunAt} />
          )}
          
          {task.proposedAction && renderProposedAction()}

          {showExecuteButton && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                onPress={handleExecuteAction}
                isDisabled={shouldDisableExecuteButton}
                variant="primary"
                size="md"
              >
                {isExecuting ? 'Executing Action...' : 'Execute Action'}
              </Button>
              {!canExecuteReversalAction() ? (
                <p className="text-sm text-red-600 mt-2">
                  ⚠️ Cannot execute: The journal entry does not exist in the system. It may have been deleted already.
                </p>
              ) : (
                <p className="text-sm text-gray-600 mt-2">
                  {isPostJournalEntryTask(task) 
                    ? 'This will post the journal entry and mark the task as completed.' 
                    : 'This will delete the journal entry and mark the task as completed.'}
                </p>
              )}
            </div>
          )}

          {task.lastRunError && (
            <div className="text-red-600 mt-4">
              <span className="font-medium">Error: </span>
              <span>{task.lastRunError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}