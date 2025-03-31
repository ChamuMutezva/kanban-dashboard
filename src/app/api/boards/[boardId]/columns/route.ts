import prisma from "../../../../../../lib/prisma";
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
