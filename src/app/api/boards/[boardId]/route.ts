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
// Update a board
export async function PATCH(req: NextRequest, segmentData: { params: Params }) {
    const params = await segmentData.params
    const boardId = params.boardId
  
    try {
      const body = await req.json()
      const { name, columns } = body
  
      console.log("Updating board:", boardId)
      console.log("New name:", name)
      console.log("Columns:", columns)
  
      if (!name || !columns || !Array.isArray(columns)) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      }
  
      // Get the existing board to check if it exists
      const existingBoard = await prisma.board.findUnique({
        where: { id: boardId },
        include: { columns: true },
      })
  
      if (!existingBoard) {
        return NextResponse.json({ error: "Board not found" }, { status: 404 })
      }
  
      // Create a new slug from the updated name
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
  
      // Check if the new slug would conflict with another board (excluding this one)
      if (slug !== existingBoard.slug) {
        const slugConflict = await prisma.board.findFirst({
          where: {
            slug,
            id: { not: boardId },
          },
        })
  
        if (slugConflict) {
          return NextResponse.json({ error: "A board with this name already exists" }, { status: 409 })
        }
      }
  
      // Start a transaction to update the board and manage columns
      const updatedBoard = await prisma.$transaction(async (tx) => {
        // 1. Update the board name and slug
  
        // 2. Process columns
        const existingColumnIds = existingBoard.columns.map((col) => col.id)
        const updatedColumnIds = columns.filter((col) => col.id).map((col) => col.id as string)
  
        // Columns to delete (exist in DB but not in the update)
        const columnsToDelete = existingColumnIds.filter((id) => !updatedColumnIds.includes(id))
  
        // Delete columns that were removed (this will cascade delete tasks)
        if (columnsToDelete.length > 0) {
          console.log("Deleting columns:", columnsToDelete)
          await tx.column.deleteMany({
            where: {
              id: { in: columnsToDelete },
            },
          })
        }
  
        // Update existing columns and create new ones
        for (let i = 0; i < columns.length; i++) {
          const column = columns[i]
  
          if (column.id) {
            // Update existing column
            console.log("Updating column:", column.id, column.name)
            await tx.column.update({
              where: { id: column.id },
              data: {
                name: column.name,
                order: i,
              },
            })
          } else {
            // Create new column
            console.log("Creating new column:", column.name)
            await tx.column.create({
              data: {
                name: column.name,
                order: i,
                boardId,
              },
            })
          }
        }
  
        // Return the updated board with columns
        return await tx.board.findUnique({
          where: { id: boardId },
          include: {
            columns: {
              orderBy: { order: "asc" },
            },
          },
        })
      })
  
      console.log("Board updated successfully:", updatedBoard)
      return NextResponse.json(updatedBoard)
    } catch (error) {
      console.error("Error updating board:", error)
      return NextResponse.json({ error: "Failed to update board" }, { status: 500 })
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
