import type { Task } from '../../types'
import { Close } from "flowbite-react-icons/outline";

type Props = {
    task: Task
    handleClosePanel: () => void;
}

export function TaskDetail(props: Props) {
    const {task, handleClosePanel} = props;
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
        <div>
            <span className="font-medium">Status: </span>
            <span>{task.status}</span>
        </div>
        <div>
            <span className="font-medium">Type: </span>
            <span>{task.type}</span>
        </div>
        <div>
            <span className="font-medium">Created: </span>
            <span>
            {new Date(task.createdAt).toLocaleString()}
            </span>
        </div>
        {task.lastRunAt && (
            <div>
            <span className="font-medium">Last Run: </span>
            <span>
                {new Date(
                task.lastRunAt
                ).toLocaleString()}
            </span>
            </div>
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
