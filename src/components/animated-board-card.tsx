"use client"

import { useRef } from "react"
import Link from "next/link"
import { Columns } from "lucide-react"
import { useCardHoverAnimation } from "@/lib/gsap"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Board } from "@/types/board"

interface AnimatedBoardCardProps {
  board: Board
  index: number
}

export function AnimatedBoardCard({ board, index }: Readonly<AnimatedBoardCardProps>) {
  const cardRef = useRef<HTMLDivElement>(null!)

  // Apply hover animation
  useCardHoverAnimation(cardRef)

  return (
    <div className="group">
      <Card
        ref={cardRef}
        className="h-full transition-all relative isolate"
        style={{
          opacity: 0,
          transform: "translateY(20px)",
          animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`,
        }}
      >
        <CardHeader>
          <CardTitle className="group-hover:text-primary transition-colors">{board.name}</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Columns className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">tasks</span>
          </div>
        </CardContent>
        <CardFooter>
          <Link href={`/boards/${board.slug}`} className="w-full justify-start">
            <span className="inset-0 absolute z-50"></span>
            View Board
            <span className="sr-only">{`${board.name}`}</span>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
