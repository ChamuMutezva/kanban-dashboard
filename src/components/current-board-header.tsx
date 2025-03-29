"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import Image from "next/image"

interface Board {
  id: string
  name: string
  slug: string
}

export function CurrentBoardHeader({ boards }: Readonly<{ boards: Board[] }>) {
  const pathname = usePathname()
  const iconAddTask = "/assets/icon-add-task-mobile.svg"
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null)
  const [hasColumns, setHasColumns] = useState(false)

  // Find the current board based on the URL
  useEffect(() => {
    if (pathname.startsWith("/boards/")) {
      const slug = pathname.split("/").pop() // Get the slug from the URL
      const board = boards.find((board) => board.slug === slug) || null
      setCurrentBoard(board)
    } else {
      setCurrentBoard(null)
    }
  }, [pathname, boards])

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
      <div>
        <Button disabled={!hasColumns} title={!hasColumns ? "Add columns to the board first" : "Add new task"}>
          <Image
            className="dark:invert"
            src={iconAddTask || "/placeholder.svg"}
            alt=""
            width={12}
            height={12}
            priority
          />
          <span>Add New Task</span>
        </Button>
      </div>
    </div>
  )
}

