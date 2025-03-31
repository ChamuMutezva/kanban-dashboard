"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import Image from "next/image"
import { EllipsisVertical } from "lucide-react"
import { CreateTaskButton } from "./create-task-button"

interface Board {
  id: string
  name: string
  slug: string
  columns?: Column[]
}

interface Column {
  id: string
  name: string
}

export function CurrentBoardHeader({ boards }: Readonly<{ boards: Board[] }>) {
  const pathname = usePathname()
  const iconAddTask = "/assets/icon-add-task-mobile.svg"
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null)
  const [columns, setColumns] = useState<Column[]>([])
  const [hasColumns, setHasColumns] = useState(false)

  // Find the current board based on the URL
  useEffect(() => {
    if (pathname.startsWith("/boards/")) {
      const slug = pathname.split("/").pop() // Get the slug from the URL
      const board = boards.find((board) => board.slug === slug) || null
      setCurrentBoard(board)

      // Fetch columns for this board
      if (board?.id) {
        fetchColumnsForBoard(board.id)
      }
    } else {
      setCurrentBoard(null)
      setColumns([])
    }
  }, [pathname, boards])

  // Fetch columns for the current board
  const fetchColumnsForBoard = async (boardId: string) => {
    try {
      const response = await fetch(`/api/boards/${boardId}/columns`)
      if (response.ok) {
        const data = await response.json()
        setColumns(data)
        setHasColumns(data.length > 0)
      }
    } catch (error) {
      console.error("Error fetching columns:", error)
    }
  }

  // Check if the current board has columns by looking at the DOM
  useEffect(() => {
    // Function to check for column elements
    const checkForColumns = () => {
      const columnElements = document.querySelectorAll("[data-column-id]")
      setHasColumns(columnElements.length > 0)
    }

    // Check after a short delay to ensure the DOM has updated
    const timer = setTimeout(checkForColumns, 100)

    // Also add a mutation observer to detect when columns are added/removed
    const observer = new MutationObserver(checkForColumns)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Initial check
    checkForColumns()

    // Cleanup
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [pathname]) // Re-run when the path changes

  return (
    <div className="flex items-center justify-between w-full pr-4">
      <h1 className="text-2xl font-bold">{currentBoard ? currentBoard.name : "Dashboard"}</h1>
      <div className="flex items-center gap-2">
        {currentBoard && (
          <CreateTaskButton
            boardId={currentBoard.id}
            columns={columns}
            variant="default"
            disabled={!hasColumns}
            className="flex items-center gap-2"
          >
            <Image
              className="dark:invert"
              src={iconAddTask || "/placeholder.svg"}
              alt=""
              width={12}
              height={12}
              priority
            />
            <span className="sr-only sm:not-sr-only">Add New Task</span>
          </CreateTaskButton>
        )}
        <Button variant="ghost">
          <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">More options</span>
        </Button>
      </div>
    </div>
  )
}


