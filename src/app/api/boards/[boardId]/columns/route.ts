import prisma from "../../../../../../lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(
    request: NextRequest,
    params: { boardId: string }  // <-- Remove the nested `{ params }`
) {
    const boardId = params.boardId;  // Now directly accessed

    try {
        const body = await request.json();
        const { columns } = body;

        if (!columns || !Array.isArray(columns)) {
            return NextResponse.json(
                { error: "Missing or invalid columns data" },
                { status: 400 }
            );
        }

        // Rest of your logic remains the same...
        const board = await prisma.board.findUnique({
            where: { id: boardId },
            include: { columns: { orderBy: { order: "desc" } } },
        });

        if (!board) {
            return NextResponse.json(
                { error: "Board not found" },
                { status: 404 }
            );
        }

        let highestOrder = 0;
        if (board.columns.length > 0) {
            highestOrder = board.columns[0].order;
        }

        const createdColumns = await Promise.all(
            columns.map(async (column: { name: string }, index: number) => {
                return await prisma.column.create({
                    data: {
                        name: column.name,
                        boardId: boardId,
                        order: highestOrder + index + 1,
                    },
                });
            })
        );

        return NextResponse.json(
            { message: "Columns added successfully", columns: createdColumns },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding columns:", error);
        return NextResponse.json(
            { error: "Failed to add columns" },
            { status: 500 }
        );
    }
}