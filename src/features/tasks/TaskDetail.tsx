// TaskDetail.tsx
import type { Task } from '../../types';
import { TaskStatus } from '../../types';
import { Close } from "flowbite-react-icons/outline";
import { Table, TableHeader, TableBody, Row, Cell, Column } from '../../components/ui';
import { useRunTaskMutation } from './tasksApi';
import { calculateTotals, formatCurrency, isPostJournalEntryTask, isReverseJournalEntryTask, canExecuteAction } from './taskHelpers';
import { TaskDetailItem } from './TaskDetailItem';

type Props = {
  task: Task;
  handleClosePanel: () => void;
}

export function TaskDetail(props: Props) {
  const { task, handleClosePanel } = props;
  const [runTask, { isLoading: isRunning }] = useRunTaskMutation();

  const lastRunAt = task.lastRunAt ? new Date(task.lastRunAt).toLocaleString() : "Never";
  const createdAt = new Date(task.createdAt).toLocaleString();

  const handleExecuteAction = async () => {
    try {
      await runTask(task.id).unwrap();
      // The task will be updated via Redux and the proposed action will be set
    } catch (error) {
      console.error('Failed to execute task:', error);
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
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">Total Debits: </span>
                  <span>{formatCurrency(totalDebits)}</span>
                </div>
                <div>
                  <span className="font-medium">Total Credits: </span>
                  <span>{formatCurrency(totalCredits)}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
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
      return (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-lg mb-3">Reverse Journal Entry</h4>
          <TaskDetailItem 
            label="Journal Entry ID" 
            value={task.proposedAction.journalEntryId} 
          />
          <p className="text-sm text-gray-600 mt-2">
            This action will reverse the specified journal entry.
          </p>
        </div>
      );
    }

    return null;
  };

  const showExecuteButton = canExecuteAction(task) && task.status === TaskStatus.PENDING_RUN;

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
              <button
                onClick={handleExecuteAction}
                disabled={isRunning}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              >
                {isRunning ? 'Running Task...' : 'Run Task to Generate Action'}
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Run this task to generate the proposed action that you can then execute.
              </p>
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