import { Checkbox } from "@/components/ui/checkbox";
import { getBoardBySlug } from "../../../../lib/boards";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { NoColumnsFound } from "@/components/no-columns-found";
import { AddColumnButton } from "@/components/add-column-button";
import { TaskCardWrapper } from "@/components/TaskCardWrapper";

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
    params: Promise<{ slug: string }>;
}>) {
    const { slug } = await params;

    console.log("Slug parameter:", slug);

    const board = await getBoardBySlug(slug);

    console.log("Board data:", board);

    const COLORS_BY_COLUMN = {
        done: "before:bg-green-500",
        doing: "before:bg-orange-500",
        todo: "before:bg-yellow-500",
    } as const;

    const getBulletColor = (columnName: string) =>
        COLORS_BY_COLUMN[
            columnName.toLowerCase() as keyof typeof COLORS_BY_COLUMN
        ] ?? "before:bg-blue-500";

    // Usage same as above

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
                <NoColumnsFound boardId={board.id} boardSlug={board.slug} />
            ) : (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold sr-only">
                            {board.name}
                        </h2>
                        <div className="flex gap-2 ml-auto">
                            <AddColumnButton
                                boardId={board.id}
                                boardSlug={board.slug}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {board.columns?.map((column) => (
                            <div
                                key={column.id}
                                className="flex flex-col"
                                data-column-id={column.id} // Add data attribute for column detection
                            >
                                <h3
                                    className="text-md font-semibold text-mid-grey uppercase tracking-wider mb-6
                                flex items-center justify-start gap-2"
                                >
                                    <span
                                        className={`before:block before:w-3 before:h-3 before:rounded-full before:mr-2
                                           ${getBulletColor(column.name)} `}
                                    ></span>
                                    {column.name} ({column.tasks.length})
                                </h3>
                                <div className="space-y-5">
                                    {column.tasks?.map((task) => (
                                        <TaskCardWrapper
                                            key={task.id}
                                            task={task}
                                        >
                                            <TaskCardContent task={task} />
                                        </TaskCardWrapper>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function TaskCardContent({ task }: Readonly<{ task: Task }>) {
    // Count completed subtasks
    const completedSubtasks = task.subtasks.filter(
        (subtask) => subtask.isCompleted
    ).length;
    const totalSubtasks = task.subtasks.length;

    return (
        <Card className="rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="font-bold mb-2">{task.title}</CardTitle>
                <CardDescription>
                    {task.description && (
                        <p className="text-sm text-mid-grey mb-3">
                            {task.description}
                        </p>
                    )}
                    <div className="text-xs text-mid-grey font-bold">
                        {completedSubtasks} of {totalSubtasks} subtasks
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Optionally show subtasks in a collapsed view */}
                {task.subtasks.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-light-grey dark:border-dark-grey">
                        <details className="group">
                            <summary className="text-xs font-medium cursor-pointer list-none flex items-center">
                                <span className="text-mid-grey">
                                    View Subtasks
                                </span>
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
            </CardContent>
        </Card>
    );
}
