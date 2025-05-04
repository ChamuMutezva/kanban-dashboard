import { getBoardBySlug } from "../../../lib/boards"
import { NoColumnsFound } from "@/components/no-columns-found"
import { AddColumnButton } from "@/components/add-column-button"
import { TaskCardWrapper } from "@/components/TaskCardWrapper"
import { Suspense } from "react"
import { AnimatedColumnSkeleton } from "@/components/animated-column-skeleton"
import { AnimatedKanbanColumn } from "@/components/animated-kanban-column"
import { AnimatedTaskCard } from "@/components/animated-task-card"
import { AnimatedTaskSkeleton } from "@/components/animated-task-skeleton"
import { AnimatedBoardWrapper } from "@/components/animated-board-wrapper"

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>
}>) {
  const { slug } = await params
  const board = await getBoardBySlug(slug)

  // Color mapping for column headers
  const COLORS_BY_COLUMN = {
    done: "before:bg-[var(--color-done)]",
    doing: "before:bg-[var(--color-doing)]",
    todo: "before:bg-[var(--color-todo)]",
  } as const

  // Server-side function to get bullet color
  const getBulletColor = (columnName: string) =>
    COLORS_BY_COLUMN[columnName.toLowerCase() as keyof typeof COLORS_BY_COLUMN] ?? "before:bg-blue-500"

  if (!board) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold">Board not found</h2>
        <p>No board found with slug: {slug}</p>
      </div>
    )
  }

  return (
    <main className="p-4">
      {board.columns.length < 1 ? (
        <NoColumnsFound boardId={board.id} boardSlug={board.slug} />
      ) : (
        <Suspense fallback={<AnimatedColumnSkeleton />}>
          <AnimatedBoardWrapper>
            <div className="flex gap-4 min-w-max">
              {board.columns?.map((column, index) => {
                // Pre-compute the bullet color on the server
                const bulletColor = getBulletColor(column.name)

                return (
                  <AnimatedKanbanColumn key={column.id} column={column} index={index} bulletColor={bulletColor}>
                    {column.tasks.length === 0 ? (
                      <AnimatedTaskSkeleton column={column} index={index} />
                    ) : (
                      <div className="space-y-5 min-h-[200px]">
                        {column.tasks?.map((task, taskIndex) => (
                          <TaskCardWrapper key={task.id} task={task}>
                            <AnimatedTaskCard task={task} index={taskIndex} />
                          </TaskCardWrapper>
                        ))}
                      </div>
                    )}
                  </AnimatedKanbanColumn>
                )
              })}
              <div className="flex items-start mt-6">
                <AddColumnButton boardId={board.id} boardSlug={board.slug} />
              </div>
            </div>
          </AnimatedBoardWrapper>
        </Suspense>
      )}
    </main>
  )
}
