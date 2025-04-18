"use client";

import type React from "react";

import { useState, useRef } from "react";
import { TaskViewModal } from "./TaskViewModal";
import { type Task } from "@/types/board";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskCardProps {
    task: Task;
    onEdit: (taskId: string) => void;
    onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: Readonly<TaskCardProps>) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const completedSubtasks =
        task.subtasks?.filter((subtask) => subtask.isCompleted).length ?? 0;
    const totalSubtasks = task.subtasks?.length ?? 0;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <button
                type="button"
                ref={buttonRef}
                className="w-full text-left bg-transparent border-0 p-0 m-0"
                onClick={() => setIsModalOpen(true)}
                onKeyDown={handleKeyDown}
                aria-haspopup="dialog"
                aria-expanded={isModalOpen}
            >
                <Card className="rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="p-4">
                        <CardTitle className="text-base font-medium">
                            {task.title}
                        </CardTitle>
                        {task.subtasks && task.subtasks.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {completedSubtasks} of {totalSubtasks} subtasks
                            </p>
                        )}
                    </CardHeader>
                </Card>
            </button>

            <TaskViewModal
                task={task}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </>
    );
}
