import type { Task,LineItem  } from '../../types'
import { TaskType } from '../../types';
import { Close } from "flowbite-react-icons/outline";
import {Table, TableHeader, TableBody, Row, Cell, Column } from '../../components/ui';
import { TaskDetailItem } from './TaskDetailItem';
type Props = {
    task: Task
    handleClosePanel: () => void;
}

export function TaskDetail(props: Props) {
    const {task, handleClosePanel} = props;
    // "Never" could be a good business practice
    const lastRunAt = task.lastRunAt ? new Date(task.lastRunAt).toLocaleString() : "Never";
    // if you can see the details, then you will have always the createdAt value...
    const createdAt = task.createdAt ?? new Date(task.createdAt).toLocaleString();
    const isTaskPostJournalEntry = task.type === TaskType.POST_JOURNAL_ENTRY;
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

        <TaskDetailItem label="Status"  value={task.status} />
        <TaskDetailItem label="Type"  value={task.type} />
        <TaskDetailItem label="Created"  value={createdAt} />

        {task.lastRunAt && (
            <TaskDetailItem label="Last Run"  value={lastRunAt} />
        )}
        {
        task.proposedAction && isTaskPostJournalEntry && (
            <>
                <TaskDetailItem label="Date"  value={task.proposedAction.date} />
                <TaskDetailItem label="Description"  value={task.proposedAction.description} />
        {
        <Table >
            <TableHeader>
                <Column width="25%">Account</Column>
                <Column width="25%">Memo</Column>
                <Column width="25%">Credit</Column>
                <Column width="25%">Debit</Column>
            </TableHeader>
            <TableBody>
                {task.proposedAction.lineItems.map((item: LineItem, index: number) => (
                    <Row key={index} id={index.toString()}>
                        <Cell>{item.account}</Cell>
                        <Cell>{item.memo}</Cell>
                        <Cell>{item.credit.toFixed(2)}</Cell>
                        <Cell>{item.debit.toFixed(2)}</Cell>
                    </Row>
                ))}
            </TableBody>
        </Table>
        }
            </>

        )}
        {task.lastRunError && (
            <div className="text-red-600">
            <span className="font-medium">Error: </span>
            <span>{task.lastRunError}</span>
            </div>
        )}
        </div>
    </div>
    </div>
  )
}
