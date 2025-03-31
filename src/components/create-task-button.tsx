"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTaskDialog } from "@/components/create-task-dialog";

interface Column {
    id: string;
    name: string;
}

interface CreateTaskButtonProps {
    boardId: string;
    columns: Column[];
    defaultColumnId?: string;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "purple";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
}

export function CreateTaskButton({
    boardId,
    columns,
    defaultColumnId,
    variant = "default",
    size = "default",
    className,
}: Readonly<CreateTaskButtonProps>) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setDialogOpen(true)}
                variant={variant === "purple" ? "default" : variant}
                size={size}
                className={className}
                disabled={columns.length === 0}
                title={
                    columns.length === 0
                        ? "Add columns to the board first"
                        : "Add new task"
                }
            >
                <Plus className="mr-2 h-4 w-4" />
                Add New Task
            </Button>

            <CreateTaskDialog
                boardId={boardId}
                columns={columns}
                defaultColumnId={defaultColumnId}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </>
    );
}
