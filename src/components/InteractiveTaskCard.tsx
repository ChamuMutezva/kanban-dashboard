"use client"

import type React from "react"

import { useState } from "react"
import { type Task, TaskViewModal } from "./TaskViewModal"

interface InteractiveTaskCardProps {
  task: Task
  children: React.ReactNode
}

export function InteractiveTaskCard({ task, children }: Readonly<InteractiveTaskCardProps>) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleEdit = (taskId: string) => {
    console.log("Edit task:", taskId)
    // Implement your edit logic or redirect to edit page
    // You could use router.push(`/tasks/${taskId}/edit`) here
  }

  const handleDelete = (taskId: string) => {
    console.log("Delete task:", taskId)
    // Implement your delete logic
    // You might want to call a server action here
  }

  return (
    <>
      <div onClick={() => setIsModalOpen(true)} className="cursor-pointer">
        {children}
      </div>

      <TaskViewModal
        task={task}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  )
}

