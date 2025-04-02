"use client"

import type React from "react"

import { useState } from "react"
import { type Task, TaskViewModal } from "./TaskViewModal"
import { TaskViewButton } from "./TaskViewButton"
import { EditTaskForm } from "./EditTaskForm"
import { updateTask } from "../../lib/actions"
import { useRouter } from "next/navigation"

interface TaskCardWrapperProps {
  task: Task
  children: React.ReactNode
}

export function TaskCardWrapper({ task, children }: Readonly<TaskCardWrapperProps>) {
  const router = useRouter()
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task>(task)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEdit = (taskId: string) => {
    // Close the view modal and open the edit modal
    console.log(taskId)
    setIsViewModalOpen(false)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (taskId: string) => {
    console.log("Delete task:", taskId)
    // Implement your delete logic
    // For example:
    // await deleteTask(taskId)
    // router.refresh()
  }

  const handleSaveTask = async (updatedTask: Task) => {
    try {
      setIsSubmitting(true)
      setError(null)

      console.log("Saving task:", updatedTask)

      // Call the server action to update the task
      await updateTask(updatedTask)

      // Update the local state
      setCurrentTask(updatedTask)

      // Close the edit modal
      setIsEditModalOpen(false)

      // Refresh the page to show the updated task
      router.refresh()
    } catch (error) {
      console.error("Failed to save task:", error)
      setError(error instanceof Error ? error.message : "Failed to save task")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative">
      {children}

      <div className="absolute top-3 right-3">
        <TaskViewButton onClick={() => setIsViewModalOpen(true)} />
      </div>

      <TaskViewModal
        task={currentTask}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditTaskForm
        task={currentTask}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTask}
        error={error}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

