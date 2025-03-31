import { type NextRequest, NextResponse } from "next/server"
import prisma from "../../../../../../lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { boardId: string } }) {
    try {
      const { boardId } = params
      const body = await request.json()
      const { columns } = body
  
      if (!columns || !Array.isArray(columns)) {
        return NextResponse.json({ error: "Missing or invalid columns data" }, { status: 400 })
      }
  
      // Check if the board exists
      const board = await prisma.board.findUnique({
        where: { id: boardId },
        include: { columns: { orderBy: { order: "desc" } } },
      })
  
      if (!board) {
        return NextResponse.json({ error: "Board not found" }, { status: 404 })
      }
  
      // Get the current highest order value
      let highestOrder = 0
      if (board.columns.length > 0) {
        highestOrder = board.columns[0].order
      }
  
      // Create the new columns
      const createdColumns = await Promise.all(
        columns.map(async (column: { name: string }, index: number) => {
          return await prisma.column.create({
            data: {
              name: column.name,
              boardId: boardId,
              order: highestOrder + index + 1, // Increment order for each new column
            },
          })
        }),
      )
  
      return NextResponse.json({ message: "Columns added successfully", columns: createdColumns }, { status: 201 })
    } catch (error) {
      console.error("Error adding columns:", error)
      return NextResponse.json({ error: "Failed to add columns" }, { status: 500 })
    }
  }  
  