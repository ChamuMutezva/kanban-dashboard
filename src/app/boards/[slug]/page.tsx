import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getBoardBySlug } from "../../../../lib/boards";
import { PlusCircle } from "lucide-react";

// Define types for our data structure
interface Subtask {
    id: string;
    title: string;
    isCompleted: boolean;
    taskId: string;
}
interface Task {
    id: string;
    title: string;
    description?: string | null;
    subtasks: Subtask[];
}

export default async function Page({
    params,
}: Readonly<{
    params: { slug: string };
}>) {
    const { slug } = params;

    console.log("Slug parameter:", slug);

    const board = await getBoardBySlug(slug);

    console.log("Board data:", board);

    if (!board) {
        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold">Board not found</h2>
                <p>No board found with slug: {slug}</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            {board.columns.length < 1 ? (
                <NoColumnsFound />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {board.columns?.map((column) => (
                        <div key={column.id} className="flex flex-col">
                            <h3 className="text-md font-semibold text-mid-grey uppercase tracking-wider mb-6">
                                {column.name} ({column.tasks.length})
                            </h3>
                            <div className="space-y-5">
                                {column.tasks?.map((task) => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function TaskCard({ task }: Readonly<{ task: Task }>) {
    // Count completed subtasks
    const completedSubtasks = task.subtasks.filter(
        (subtask) => subtask.isCompleted
    ).length;
    const totalSubtasks = task.subtasks.length;

    return (
        <div className="p-6 bg-white dark:bg-very-dark-gray rounded-lg shadow-sm border border-light-grey dark:border-dark-grey">
            <h4 className="font-bold text-black dark:text-white mb-2">
                {task.title}
            </h4>
            {task.description && (
                <p className="text-sm text-mid-grey mb-3">{task.description}</p>
            )}
            <div className="text-xs text-mid-grey font-bold">
                {completedSubtasks} of {totalSubtasks} subtasks
            </div>

            {/* Optionally show subtasks in a collapsed view */}
            {task.subtasks.length > 0 && (
                <div className="mt-4 pt-4 border-t border-light-grey dark:border-dark-grey">
                    <details className="group">
                        <summary className="text-xs font-medium cursor-pointer list-none flex items-center">
                            <span className="text-mid-grey">View Subtasks</span>
                            <svg
                                className="ml-2 h-4 w-4 text-mid-grey transition-transform group-open:rotate-180"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </summary>
                        <ul className="mt-3 space-y-2">
                            {task.subtasks.map((subtask) => (
                                <li
                                    key={subtask.id}
                                    className="flex items-start gap-2"
                                >
                                    <Checkbox
                                        id={subtask.id}
                                        checked={subtask.isCompleted}
                                        disabled
                                        className="mt-0.5"
                                    />
                                    <label
                                        htmlFor={subtask.id}
                                        className={`text-sm ${
                                            subtask.isCompleted
                                                ? "line-through text-mid-grey"
                                                : "text-black dark:text-white"
                                        }`}
                                    >
                                        {subtask.title}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </details>
                </div>
            )}
        </div>
    );
}

function NoColumnsFound() {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/20">
            <h2 className="sr-only">No columns found</h2>
            <p className="text-muted-foreground mb-6">
                This board is empty. Create a new column to get started
            </p>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Column
            </Button>
        </div>
    );
}
