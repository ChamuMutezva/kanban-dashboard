import { type NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

type Params = Promise<{
    boardId: string;
}>;

// Get a specific board
export async function GET(req: NextRequest, segmentData: { params: Params }) {
    const params = await segmentData.params;
    const boardId = params.boardId;

    try {
        const board = await prisma.board.findUnique({
            where: { id: boardId },
            include: {
                columns: {
                    orderBy: { order: "asc" },
                    include: {
                        tasks: {
                            include: {
                                subtasks: true,
                            },
                        },
                    },
                },
            },
        });

        if (!board) {
            return NextResponse.json(
                { error: "Board not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(board);
    } catch (error) {
        console.error("Error fetching board:", error);
        return NextResponse.json(
            { error: "Failed to fetch board" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request, segmentData: { params: Params }) {
    try {
        const params = await segmentData.params;
        const boardId = params.boardId;
        const body = await request.json();
        const { name, columns } = body;

        if (!name || !columns || !Array.isArray(columns)) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate a slug from the board name
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        // Check if a board with this slug already exists (excluding the current board)
        const existingBoard = await prisma.board.findFirst({
            where: {
                slug,
                id: { not: boardId },
            },
        });

        if (existingBoard) {
            return NextResponse.json(
                { error: "A board with this name already exists" },
                { status: 409 }
            );
        }

        // Get existing columns to determine which ones to update, create, or delete
        const existingColumns = await prisma.column.findMany({
            where: { boardId },
        });

        // Update the board and manage its columns
        const updatedBoard = await prisma.$transaction(async (tx) => {
            // 1. Update the board itself
            const board = await tx.board.update({
                where: { id: boardId },
                data: {
                    name,
                    slug,
                },
            });

            // 2. Process each column from the form
            for (let i = 0; i < columns.length; i++) {
                const column = columns[i];

                if (column.id) {
                    // Update existing column
                    await tx.column.update({
                        where: { id: column.id },
                        data: {
                            name: column.name,
                            order: i,
                        },
                    });
                } else {
                    // Create new column
                    await tx.column.create({
                        data: {
                            name: column.name,
                            order: i,
                            boardId,
                        },
                    });
                }
            }

            // 3. Delete columns that were removed
            const columnIdsToKeep = columns
                .filter((col) => col.id)
                .map((col) => col.id as string);

            const columnsToDelete = existingColumns.filter(
                (col) => !columnIdsToKeep.includes(col.id)
            );

            if (columnsToDelete.length > 0) {
                // First, handle tasks in these columns
                for (const column of columnsToDelete) {
                    // Get all tasks in this column
                    const tasks = await tx.task.findMany({
                        where: { columnId: column.id },
                        include: { subtasks: true },
                    });

                    // Delete all subtasks for these tasks
                    for (const task of tasks) {
                        await tx.subtask.deleteMany({
                            where: { taskId: task.id },
                        });
                    }

                    // Delete all tasks in this column
                    await tx.task.deleteMany({
                        where: { columnId: column.id },
                    });
                }

                // Now delete the columns
                await tx.column.deleteMany({
                    where: {
                        id: {
                            in: columnsToDelete.map((col) => col.id),
                        },
                    },
                });
            }

            return board;
        });

        return NextResponse.json(updatedBoard);
    } catch (error) {
        console.error("Error updating board:", error);
        return NextResponse.json(
            { error: "Failed to update board" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    segmentData: { params: Params }
) {
    try {
        const params = await segmentData.params;
        const boardId = params.boardId;

        // Delete the board and all related data in a transaction
        await prisma.$transaction(async (tx) => {
            // 1. Get all columns for this board
            const columns = await tx.column.findMany({
                where: { boardId },
            });

            // 2. For each column, get and delete all tasks and subtasks
            for (const column of columns) {
                // Get all tasks in this column
                const tasks = await tx.task.findMany({
                    where: { columnId: column.id },
                });

                // Delete all subtasks for these tasks
                for (const task of tasks) {
                    await tx.subtask.deleteMany({
                        where: { taskId: task.id },
                    });
                }

                // Delete all tasks in this column
                await tx.task.deleteMany({
                    where: { columnId: column.id },
                });
            }

            // 3. Delete all columns for this board
            await tx.column.deleteMany({
                where: { boardId },
            });

            // 4. Finally, delete the board itself
            await tx.board.delete({
                where: { id: boardId },
            });
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting board:", error);
        return NextResponse.json(
            { error: "Failed to delete board" },
            { status: 500 }
        );
    }
}
