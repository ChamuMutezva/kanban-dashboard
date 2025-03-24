import prisma from "./prisma";

export async function getBoards() {
    return await prisma.board.findMany();
}

export async function getColumnsByBoardId(boardId: string) {
    return await prisma.column.findMany({
        where: { boardId },
        orderBy: {
            order: 'asc'
        },
        include: {
            tasks: {
                orderBy: {
                    order: 'asc'
                },
                include: {
                    subtasks: {
                        orderBy: {
                            order: 'asc'
                        }
                    }
                }
            }
        }
    });
}

export async function getBoardBySlug(id: string) {
  return await prisma.board.findUnique({
      where: { id },
      include: {
          columns: {
              orderBy: {
                  order: 'asc'
              },
              include: {
                  tasks: {
                      orderBy: {
                          order: 'asc'
                      },
                      include: {
                          subtasks: {
                              orderBy: {
                                  order: 'asc'
                              }
                          }
                      }
                  }
              }
          }
      }
  });
}
/*
export async function createExpense(data: { amount: number; title: string }) {
  return await prisma.expense.create({
    data
  })
}
  */

