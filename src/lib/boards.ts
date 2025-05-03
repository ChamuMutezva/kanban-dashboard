import prisma from "@/lib/prisma"

export async function getBoards() {
  return await prisma.board.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  })
}

export async function getBoardBySlug(slug: string) {  
  // First, try to find by slug
  let board = await prisma.board.findFirst({
    where: { slug },
    include: {
      columns: {
        orderBy: {
          order: "asc",
        },
        include: {
          tasks: {
            orderBy: {
              order: "asc",
            },
            include: {
              subtasks: {
                orderBy: {
                  order: "asc",
                },
              },
            },
          },
        },
      },
    },
  })

  // If not found by slug, try by ID (for backward compatibility)
  if (!board) {
    console.log("Board not found by slug, trying ID")
    board = await prisma.board.findUnique({
      where: { id: slug },
      include: {
        columns: {
          orderBy: {
            order: "asc",
          },
          include: {
            tasks: {
              orderBy: {
                order: "asc",
              },
              include: {
                subtasks: {
                  orderBy: {
                    order: "asc",
                  },
                },
              },
            },
          },
        },
      },
    })
  }

  return board
}

export async function getColumnsByBoardId(boardId: string) {
  return await prisma.column.findMany({
    where: { boardId },
    orderBy: {
      order: "asc",
    },
    include: {
      tasks: {
        orderBy: {
          order: "asc",
        },
        include: {
          subtasks: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
  })
}

