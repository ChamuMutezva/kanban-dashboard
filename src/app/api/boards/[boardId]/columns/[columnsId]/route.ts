import prisma from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server";

type Params = Promise<{
    boardId: string;
    columnId: string;
}>;

// Update a column
export async function PATCH(req: NextRequest, segmentData: { params: Params }) {
    const params = await segmentData.params;
    const { boardId, columnId } = params;

    try {
        const { name, order } = await req.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: any = {};

        // Only include fields that were provided
        if (name !== undefined) updateData.name = name;
        if (order !== undefined) updateData.order = order;

        // Validate input
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: "No valid fields to update" },
                { status: 400 }
            );
        }

        // Update the column
        const updatedColumn = await prisma.column.update({
            where: {
                id: columnId,
                boardId: boardId,
            },
            data: updateData,
        });

        return NextResponse.json(updatedColumn);
    } catch (error) {
        console.error("Error updating column:", error);
        return NextResponse.json(
            { error: "Failed to update column" },
            { status: 500 }
        );
    }
}

// Delete a column
export async function DELETE(
    req: NextRequest,
    segmentData: { params: Params }
) {
    const params = await segmentData.params;
    const { boardId, columnId } = params;

    try {
        // First, delete all tasks in the column
        await prisma.task.deleteMany({
            where: {
                columnId: columnId,
            },
        });

        // Then delete the column
        await prisma.column.delete({
            where: {
                id: columnId,
                boardId: boardId,
            },
        });

        return NextResponse.json(
            { message: "Column deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting column:", error);
        return NextResponse.json(
            { error: "Failed to delete column" },
            { status: 500 }
        );
    }
}
