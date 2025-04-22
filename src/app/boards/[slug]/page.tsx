import { getBoardBySlug } from "../../../lib/boards";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { NoColumnsFound } from "@/components/no-columns-found";
import { AddColumnButton } from "@/components/add-column-button";
import { TaskCardWrapper } from "@/components/TaskCardWrapper";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { Task, Column } from "@/types/board";

// Loading skeleton for columns
function ColumnSkeleton() {
    return (
        <div className="flex gap-6 min-w-max animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col w-[280px] flex-shrink-0">
                    <div className="h-6 w-32 bg-muted rounded mb-6"></div>
                    <div className="space-y-5 min-h-[200px]">
                        {[1, 2, 3].map((j) => (
                            <div
                                key={j}
                                className="h-24 bg-muted rounded"
                            ></div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default async function Page({
    params,
}: Readonly<{
    params: Promise<{ slug: string }>;
}>) {
    const { slug } = await params;
    const board = await getBoardBySlug(slug);

    // Color mapping for column headers
    const COLORS_BY_COLUMN = {
        done: "before:bg-[var(--color-done)]",
        doing: "before:bg-[var(--color-doing)]",
        todo: "before:bg-[var(--color-todo)]",
    } as const;

    const getBulletColor = (columnName: string) =>
        COLORS_BY_COLUMN[
            columnName.toLowerCase() as keyof typeof COLORS_BY_COLUMN
        ] ?? "before:bg-blue-500";

    if (!board) {
        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold">Board not found</h2>
                <p>No board found with slug: {slug}</p>
            </div>
        );
    }

    return (
        <main className="p-4">
            {board.columns.length < 1 ? (
                <NoColumnsFound boardId={board.id} boardSlug={board.slug} />
            ) : (
                <div className="overflow-x-auto pb-4 -mx-8 px-8">
                    <Suspense fallback={<ColumnSkeleton />}>
                        <div className="flex gap-4 min-w-max">
                            {board.columns?.map((column) => (
                                <div
                                    key={column.id}
                                    className="flex flex-col min-w-[280px] flex-shrink-0"
                                    data-column-id={column.id}
                                >
                                    <h2
                                        className="text-sm font-semibold text-[var(--mid-grey)] uppercase tracking-wider mb-6
                                        flex items-center justify-start gap-2"
                                    >
                                        <span
                                            className={`before:block before:w-3 before:h-3 before:rounded-full before:mr-2
                                                ${getBulletColor(
                                                    column.name
                                                )} `}
                                        ></span>
                                        {column.name} ({column.tasks.length})
                                    </h2>
                                    {column.tasks.length === 0 ? (
                                        <TaskSkeleton column={column} />
                                    ) : (
                                        <div className="space-y-5 min-h-[200px]">
                                            {column.tasks?.map((task) => (
                                                <TaskCardWrapper
                                                    key={task.id}
                                                    task={task}
                                                >
                                                    <TaskCardContent
                                                        task={task}
                                                    />
                                                </TaskCardWrapper>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="flex items-start mt-6">
                                <AddColumnButton
                                    boardId={board.id}
                                    boardSlug={board.slug}
                                />
                            </div>
                        </div>
                    </Suspense>
                </div>
            )}
        </main>
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
                <CardTitle className="font-bold mb-2 leading-5">
                    {task.title}
                </CardTitle>
                <CardDescription className="text-xs text-mid-grey font-bold">
                    {completedSubtasks} of {totalSubtasks} subtasks
                </CardDescription>
            </CardHeader>
        </Card>
    );
}

function TaskSkeleton({ column }: Readonly<{ column: Column }>) {
    return (
        <div className="h-24 bg-muted rounded-lg shadow-sm border hover:shadow-md transition-shadow ">
            <div className="flex flex-col items-center justify-center h-full">
                <Plus className="w-6 h-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                    Create a new{" "}
                    <span className="font-bold">{`${column.name}`}</span> task
                </p>
            </div>
        </div>
    );
}
