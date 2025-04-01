"use client"

import { useState } from "react"
import { type Task, TaskViewModal } from "./TaskViewModal"

interface TaskCardProps {
  task: Task
  onEdit: (taskId: string) => void
  onDelete: (taskId: string) => void
}

export function TaskCard({ task, onEdit, onDelete }: Readonly<TaskCardProps>) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const completedSubtasks = task.subtasks?.filter((subtask) => subtask.isCompleted).length || 0
  const totalSubtasks = task.subtasks?.length ?? 0

  return (
    <>
      <div
        className="bg-card p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsModalOpen(true)}
      >
        <h3 className="font-medium text-card-foreground">{task.title}</h3>

        {task.subtasks && task.subtasks.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {completedSubtasks} of {totalSubtasks} subtasks
          </p>
        )}
      </div>

      <TaskViewModal
        task={task}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  )
}

