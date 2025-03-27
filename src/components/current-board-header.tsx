"use client"

import { usePathname } from "next/navigation"
import { useMemo } from "react"

interface Board {
  id: string
  name: string
  slug: string
}

export function CurrentBoardHeader({ boards }: Readonly<{ boards: Board[] }>) {
  const pathname = usePathname()

  const currentBoard = useMemo(() => {
    // Check if we're on a board page
    if (pathname.startsWith("/boards/")) {
      const slug = pathname.split("/").pop() // Get the slug from the URL
      return boards.find((board) => board.slug === slug)
    }
    return null
  }, [pathname, boards])

  return (
    <div className="flex items-center">
      <h1 className="text-2xl font-bold">{currentBoard ? currentBoard.name : "Dashboard"}</h1>
    </div>
  )
}

