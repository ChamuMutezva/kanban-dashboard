"use server";

import { revalidatePath } from "next/cache";
import type { Task } from "@/types/board";
import prisma from "@/lib/prisma";

/**
 * Updates a task in the database
 */
export async function updateTask(task: Task): Promise<void> {
    try {
        // Use a transaction to ensure all operations succeed or fail together
        await prisma.$transaction(async (tx) => {
            // 1. Update the task itself
            await tx.task.update({
                where: { id: task.id },
                data: {
                    title: task.title,
                    description: task.description,
                    columnId: task.columnId, // Add this line to update the column
                },
            });

            // 2. Get existing subtasks
            const existingSubtasks = await tx.subtask.findMany({
                where: { taskId: task.id },
            });

            // 3. Process each subtask from the form
            for (const subtask of task.subtasks) {
                if (subtask.id.startsWith("new-")) {
                    // Create new subtask
                    await tx.subtask.create({
                        data: {
                            title: subtask.title,
                            isCompleted: subtask.isCompleted,
                            taskId: task.id,
                        },
                    });
                } else {
                    // Update existing subtask
                    await tx.subtask.update({
                        where: { id: subtask.id },
                        data: {
                            title: subtask.title,
                            isCompleted: subtask.isCompleted,
                        },
                    });
                }
            }

            // 4. Delete subtasks that were removed
            const subtaskIdsToKeep = task.subtasks
                .filter((s) => !s.id.startsWith("new-"))
                .map((s) => s.id);

            const subtasksToDelete = existingSubtasks.filter(
                (s) => !subtaskIdsToKeep.includes(s.id)
            );

            if (subtasksToDelete.length > 0) {
                await tx.subtask.deleteMany({
                    where: {
                        id: {
                            in: subtasksToDelete.map((s) => s.id),
                        },
                    },
                });
            }
        });

        // Get the board slug from the database
        const taskWithBoard = await prisma.task.findUnique({
            where: { id: task.id },
            include: { column: { include: { board: true } } },
        });

        if (taskWithBoard?.column?.board?.slug) {
            revalidatePath(`/boards/${taskWithBoard.column.board.slug}`);
        } else {
            // Fallback to a generic path if we can't determine the board slug
            revalidatePath("/boards");
        }
    } catch (error) {
        console.error("Detailed error in updateTask:", error);

        // Log more specific error information
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }

        throw new Error(
            `Failed to update task: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

/**
 * Deletes a task from the database
 */
export async function deleteTask(taskId: string): Promise<void> {
    try {
        // Get the board slug before deleting the task
        const taskWithBoard = await prisma.task.findUnique({
            where: { id: taskId },
            include: { column: { include: { board: true } } },
        });

        const boardSlug = taskWithBoard?.column?.board?.slug;

        await prisma.$transaction(async (tx) => {
            // Delete all subtasks first
            await tx.subtask.deleteMany({
                where: { taskId: taskId },
            });

            // Then delete the task
            await tx.task.delete({
                where: { id: taskId },
            });
        });

        // Revalidate the board page
        if (boardSlug) {
            revalidatePath(`/boards/${boardSlug}`);
        } else {
            // Fallback to a generic path if we can't determine the board slug
            revalidatePath("/boards");
        }
    } catch (error) {
        console.error("Detailed error in deleteTask:", error);

        // Log more specific error information
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }

        throw new Error(
            `Failed to delete task: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}
