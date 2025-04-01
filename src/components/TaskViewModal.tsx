"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogDescription,    
    CustomDialogHeader,
    CustomDialogTitle,
} from "@/components/ui/custom-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogClose } from "./ui/dialog";

export interface Subtask {
  id: string
  title: string
  isCompleted: boolean
  taskId: string
}

export interface Task {
  id: string
  title: string
  description?: string | null
  subtasks: Subtask[]
}

interface TaskViewModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onEdit: (taskId: string) => void
  onDelete: (taskId: string) => void
}

export function TaskViewModal({ task, isOpen, onClose, onEdit, onDelete }: Readonly<TaskViewModalProps>) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!task) return null

  const handleEdit = () => {
    onEdit(task.id)
    onClose()
  }

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(task.id)
      setConfirmDelete(false)
      onClose()
    } else {
      setConfirmDelete(true)
    }
  }

  const completedSubtasks = task.subtasks?.filter((subtask) => subtask.isCompleted).length || 0
  const totalSubtasks = task.subtasks?.length || 0

  return (
    <CustomDialog open={isOpen} onOpenChange={onClose}>
      <CustomDialogContent className="sm:max-w-md">
        <CustomDialogHeader className="flex flex-row items-start justify-between">
          <div>
            <CustomDialogTitle className="text-xl">{task.title}</CustomDialogTitle>
            {task.description && <CustomDialogDescription className="mt-2">{task.description}</CustomDialogDescription>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <EllipsisVertical className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className={confirmDelete ? "text-destructive" : ""}>
                <Trash2 className="mr-2 h-4 w-4" />
                {confirmDelete ? "Confirm Delete?" : "Delete Task"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CustomDialogHeader>

        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">
              Subtasks ({completedSubtasks} of {totalSubtasks})
            </p>
            <div className="space-y-2">
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2 p-3 rounded-md bg-muted">
                  <Checkbox id={`modal-${subtask.id}`} checked={subtask.isCompleted} disabled />
                  <label
                    htmlFor={`modal-${subtask.id}`}
                    className={`text-sm ${subtask.isCompleted ? "line-through text-muted-foreground" : ""}`}
                  >
                    {subtask.title}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  )
}

