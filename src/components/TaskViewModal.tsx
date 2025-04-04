"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogFooter,
} from "@/components/ui/custom-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EllipsisVertical, Pencil, Trash2, AlertCircle, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogClose } from "./ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  error?: string | null
  isDeleting?: boolean
}

export function TaskViewModal({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  error = null,
  isDeleting = false,
}: Readonly<TaskViewModalProps>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!task) return null

  const handleEdit = () => {
    onEdit(task.id)
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    onDelete(task.id)
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  const completedSubtasks = task.subtasks?.filter((subtask) => subtask.isCompleted).length || 0
  const totalSubtasks = task.subtasks?.length || 0

  return (
    <CustomDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setShowDeleteConfirm(false)
          onClose()
        }
      }}
    >
      <CustomDialogContent className="sm:max-w-md">
        <CustomDialogHeader className="flex flex-row items-start justify-between">
          <div>
            <CustomDialogTitle className="text-xl">{task.title}</CustomDialogTitle>
            {task.description && <CustomDialogDescription className="mt-2">{task.description}</CustomDialogDescription>}
          </div>
          {!showDeleteConfirm && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isDeleting}>
                  <EllipsisVertical className="h-5 w-5 text-muted-foreground" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit} disabled={isDeleting}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive" disabled={isDeleting}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CustomDialogHeader>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {task.subtasks && task.subtasks.length > 0 && !showDeleteConfirm && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">
              Subtasks ({completedSubtasks} of {totalSubtasks})
            </p>
            <div className="space-y-2">
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-start gap-2 p-3 rounded-md border border-border bg-muted/80 dark:bg-muted">
                  <Checkbox id={`modal-${subtask.id}`} checked={subtask.isCompleted} disabled className="mt-1"/>
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

        {showDeleteConfirm && (
          <div className="my-4 p-4 border border-destructive/50 rounded-md bg-destructive/10">
            <h3 className="text-sm font-medium text-destructive mb-2">Delete Task</h3>
            <p className="text-sm mb-4">
              Are you sure you want to delete `{task.title}`? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelDelete} disabled={isDeleting}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={handleConfirmDelete} disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        )}

        <CustomDialogFooter className="mt-4">
          {!showDeleteConfirm && (
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeleting}>
                Close
              </Button>
            </DialogClose>
          )}
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>
  )
}

