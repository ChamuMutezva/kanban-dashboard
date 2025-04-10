import prisma from "../../../../../../lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

type Params = Promise<{
    boardId: string;
}>;

export async function POST(req: NextRequest, segmentData: { params: Params }) {
    const params = await segmentData.params;
    const boardId = params.boardId;

    try {
        const body = await req.json();
        const { title, description, columnId, subtasks } = body;

        if (!title || !columnId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if the column exists and belongs to the board
        const column = await prisma.column.findFirst({
            where: {
                id: columnId,
                boardId: boardId,
            },
        });

        if (!column) {
            return NextResponse.json(
                { error: "Column not found or does not belong to this board" },
                { status: 404 }
            );
        }

        // Get the highest order value for tasks in this column
        const highestOrderTask = await prisma.task.findFirst({
            where: { columnId },
            orderBy: { order: "desc" },
        });

        const newOrder = highestOrderTask ? highestOrderTask.order + 1 : 0;

        // Create the task with its subtasks
        const task = await prisma.task.create({
            data: {
                title,
                description,
                columnId,
                order: newOrder,
                subtasks: {
                    create:
                        subtasks?.map(
                            (subtask: { title: string }, index: number) => ({
                                title: subtask.title,
                                isCompleted: false,
                                order: index,
                            })
                        ) || [],
                },
            },
            include: {
                subtasks: true,
            },
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json(
            { error: "Failed to create task" },
            { status: 500 }
        );
    }
}
