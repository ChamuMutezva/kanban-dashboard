"use client"

import { TaskCard } from "./TaskCard"
import type { Task } from "./TaskViewModal"

interface TaskColumnProps {
  title: string
  tasks: Task[]
  columnId: string
  onEditTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

export function TaskColumn({ title, tasks, columnId, onEditTask, onDeleteTask }: Readonly<TaskColumnProps>) {
  return (
    <div className="min-w-[280px] flex flex-col" data-column-id={columnId}>
      <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-4">
        {title} ({tasks.length})
      </h2>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
        ))}
      </div>
    </div>
  )
}

