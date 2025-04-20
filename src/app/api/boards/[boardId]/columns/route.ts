import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

type Params = Promise<{
    boardId: string;
}>;

export async function GET(req: NextRequest, segmentData: { params: Params }) {
    const params = await segmentData.params;
    const boardId = params.boardId;

    try {
        const columns = await prisma.column.findMany({
            where: {
                boardId: boardId,
            },
            orderBy: {
                order: "asc",
            },
        });

        return NextResponse.json(columns);
    } catch (error) {
        console.error("Error fetching columns:", error);
        return NextResponse.json(
            { error: "Failed to fetch columns" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest, segmentData: { params: Params }) {
    const params = await segmentData.params;
    const boardId = params.boardId;

    try {
        const { columns } = await req.json();
        console.log("Adding columns to board:", boardId, columns);

        /* Validate input
            What it checks:
            /!columns - Checks if columns is falsy (undefined, null, etc.)
            /!Array.isArray(columns) - Verifies columns is not an array
            columns.length === 0 - Ensures the array isn't empty
        */

        if (!columns || !Array.isArray(columns) || columns.length === 0) {
            return NextResponse.json(
                { error: "Invalid columns data" },
                { status: 400 }
            );
        }

        // Get the board to ensure it exists
        const board = await prisma.board.findUnique({
            where: { id: boardId },
        });

        if (!board) {
            return NextResponse.json(
                { error: "Board not found" },
                { status: 404 }
            );
        }

        // Get existing column names for this board
        const existingColumns = await prisma.column.findMany({
            where: { boardId },
            select: { name: true },
        });

        const existingColumnNames = new Set(
            existingColumns.map((col) => col.name.toLowerCase())
        );

        // Check if any of the new columns already exist
        const duplicateColumns = columns.filter((column: { name: string }) =>
            existingColumnNames.has(column.name.toLowerCase())
        );

        if (duplicateColumns.length > 0) {
            return NextResponse.json(
                {
                    error: "Column creation aborted",
                    message: "Some columns already exist",
                    duplicateColumns: duplicateColumns,
                    details: {
                        existingColumns: Array.from(existingColumnNames),
                        attemptedDuplicates: duplicateColumns.map(
                            (c) => c.name
                        ),
                    },
                },
                { status: 409 } // Conflict status code
            );
        }

        // Get the highest existing order value
        const highestOrderColumn = await prisma.column.findFirst({
            where: { boardId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const startOrder = (highestOrderColumn?.order ?? 0) + 1;

        // Create the columns with sequential order values
        const createdColumns = await prisma.$transaction(
            columns.map((column: { name: string }, index: number) =>
                prisma.column.create({
                    data: {
                        name: column.name,
                        boardId: boardId,
                        order: startOrder + index, // Assign sequential order values
                    },
                })
            )
        );

        return NextResponse.json(
            {
                message: "Columns added successfully",
                columns: createdColumns,
            },
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
