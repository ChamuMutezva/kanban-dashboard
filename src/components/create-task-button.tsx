"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateTaskDialog } from "@/components/create-task-dialog"

interface Column {
  id: string
  name: string
}

interface CreateTaskButtonProps {
  boardId: string
  columns: Column[]
  defaultColumnId?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  disabled?: boolean
  children?: React.ReactNode
}

export function CreateTaskButton({
  boardId,
  columns,
  defaultColumnId,
  variant = "default",
  size = "default",
  className,
  disabled,
  children,
}: Readonly<CreateTaskButtonProps>) {
  const [dialogOpen, setDialogOpen] = useState(false)

  // If disabled prop is provided, use it; otherwise, disable if no columns
  const isDisabled = disabled ?? columns.length === 0
  const disabledTitle = columns.length === 0 ? "Add columns to the board first" : "Cannot add tasks at this time"

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        variant={variant}
        size={size}
        className={className}
        disabled={isDisabled}
        title={isDisabled ? disabledTitle : "Add new task"}
      >
        {children || (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Add New Task
          </>
        )}
      </Button>

      <CreateTaskDialog
        boardId={boardId}
        columns={columns}
        defaultColumnId={defaultColumnId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}


