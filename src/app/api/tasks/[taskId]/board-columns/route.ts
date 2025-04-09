import { NextResponse } from "next/server"
import prisma from "../../../../../../lib/prisma"

export async function GET(request: Request, { params }: { params: { taskId: string } }) {
  try {
    const taskId = params.taskId

    // First, get the task to find its column and board
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: {
          include: {
            board: true,
          },
        },
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Get the board ID
    const boardId = task.column.boardId

    // Get all columns for this board
    const columns = await prisma.column.findMany({
      where: {
        boardId: boardId,
      },
      orderBy: {
        order: "asc",
      },
    })

    return NextResponse.json(columns)
  } catch (error) {
    console.error("Error fetching board columns:", error)
    return NextResponse.json({ error: "Failed to fetch columns" }, { status: 500 })
  }
}
