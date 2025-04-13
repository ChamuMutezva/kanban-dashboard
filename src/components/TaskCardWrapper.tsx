"use client";

import type React from "react";
import { useState } from "react";
import { type Task, TaskViewModal } from "./TaskViewModal";
import { EditTaskForm } from "./EditTaskForm";
import { updateTask, deleteTask } from "../lib/actions";
import { useRouter } from "next/navigation";
import { ClickableCard } from "./ClickableCard";

interface TaskCardWrapperProps {
    task: Task;
    children: React.ReactNode;
}

export function TaskCardWrapper({
    task,
    children,
}: Readonly<TaskCardWrapperProps>) {
    const router = useRouter();
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task>(task);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEdit = (taskId: string) => {
        // Close the view modal and open the edit modal
        console.log(taskId);
        setIsViewModalOpen(false);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (taskId: string) => {
        try {
            setIsDeleting(true);
            setError(null);

            console.log("Deleting task:", taskId);

            // Call the server action to delete the task
            await deleteTask(taskId);

            // Close the view modal
            setIsViewModalOpen(false);

            // Refresh the page to show the updated board
            router.refresh();
        } catch (error) {
            console.error("Failed to delete task:", error);
            setError(
                error instanceof Error ? error.message : "Failed to delete task"
            );

            // Keep the modal open to show the error
            // The error will be displayed in the TaskViewModal
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveTask = async (updatedTask: Task) => {
        try {
            setIsSubmitting(true);
            setError(null);

            console.log("Saving task:", updatedTask);

            // Call the server action to update the task
            await updateTask(updatedTask);

            // Update the local state
            setCurrentTask(updatedTask);

            // Close the edit modal
            setIsEditModalOpen(false);

            // Refresh the page to show the updated task
            router.refresh();
        } catch (error) {
            console.error("Failed to save task:", error);
            setError(
                error instanceof Error ? error.message : "Failed to save task"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <ClickableCard
                onClick={() => setIsViewModalOpen(true)}
                ariaLabel={`View details for task: ${task.title}`}
            >
                {children}
            </ClickableCard>

            <TaskViewModal
                task={currentTask}
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                error={error}
                isDeleting={isDeleting}
            />

            <EditTaskForm
                task={currentTask}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveTask}
                error={error}
                isSubmitting={isSubmitting}
            />
        </>
    );
}
