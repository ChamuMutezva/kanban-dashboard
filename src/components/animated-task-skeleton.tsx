"use client"

import { useRef, useEffect } from "react"
import { Plus } from "lucide-react"
import type { Column } from "@/types/board"
import gsap from "gsap"

interface AnimatedTaskSkeletonProps {
  column: Column
  index: number
}

export function AnimatedTaskSkeleton({ column, index }: Readonly<AnimatedTaskSkeletonProps>) {
  const skeletonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!skeletonRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        skeletonRef.current,
        {
          opacity: 0,
          scale: 0.95,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: 0.1 * index + 0.2,
          ease: "back.out(1.7)",
        },
      )
    })

    return () => ctx.revert()
  }, [index])

  return (
    <div ref={skeletonRef} className="h-24 bg-muted rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex flex-col items-center justify-center h-full">
        <Plus className="w-6 h-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Create a new <span className="font-bold">{`${column.name}`}</span> task
        </p>
      </div>
    </div>
  )
}
