"use client";

import type React from "react";

import { useState } from "react";
import { type Task, TaskViewModal } from "./TaskViewModal";
import { TaskViewButton } from "./TaskViewButton";

interface TaskCardWrapperProps {
    task: Task;
    children: React.ReactNode;
}

export function TaskCardWrapper({
    task,
    children,
}: Readonly<TaskCardWrapperProps>) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    console.log("TaskCardWrapper task:", children);
    const handleEdit = (taskId: string) => {
        console.log("Edit task:", taskId);
        // Implement your edit logic or redirect to edit page
    };

    const handleDelete = (taskId: string) => {
        console.log("Delete task:", taskId);
        // Implement your delete logic
    };

    return (
        <div className="relative">
            {children}

            <div className="absolute top-3 right-3">
                <TaskViewButton onClick={() => setIsModalOpen(true)} />
            </div>

            <TaskViewModal
                task={task}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
