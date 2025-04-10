import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, columns } = body

    if (!name || !slug || !columns || !Array.isArray(columns)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if a board with this slug already exists
    const existingBoard = await prisma.board.findFirst({
      where: { slug },
    })

    if (existingBoard) {
      return NextResponse.json({ error: "A board with this name already exists" }, { status: 409 })
    }

    // Create the board with its columns
    const board = await prisma.board.create({
      data: {
        name,
        slug,
        columns: {
          create: columns.map((column: { name: string }, index: number) => ({
            name: column.name,
            order: index,
          })),
        },
      },
      include: {
        columns: true,
      },
    })

    return NextResponse.json(board, { status: 201 })
  } catch (error) {
    console.error("Error creating board:", error)
    return NextResponse.json({ error: "Failed to create board" }, { status: 500 })
  }
}

