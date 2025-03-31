"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddColumnDialog } from "@/components/add-column-dialog"

interface NoColumnsFoundProps {
  boardId: string
  boardSlug: string
}

export function NoColumnsFound({ boardId, boardSlug }: Readonly<NoColumnsFoundProps>) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/20">
        <h2 className="sr-only">No columns found</h2>
        <p className="text-muted-foreground mb-6">This board is empty. Create a new column to get started</p>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-[oklch(0.55_0.1553_281.45)] hover:bg-[oklch(0.55_0.1553_281.45)]/90 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Column
        </Button>
      </div>

      <AddColumnDialog boardId={boardId} boardSlug={boardSlug} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}

