import prisma from "./prisma";

export async function getBoards() {
    return await prisma.board.findMany();
}
/*
export async function createExpense(data: { amount: number; title: string }) {
  return await prisma.expense.create({
    data
  })
}
  */
