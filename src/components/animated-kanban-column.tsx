"use client"

import { useRef, useEffect, type ReactNode } from "react"
import gsap from "gsap"
import type { Column } from "@/types/board"

interface AnimatedKanbanColumnProps {
  children: ReactNode
  column: Column
  index: number
  bulletColor: string // Changed from getBulletColor function to bulletColor string
}

export function AnimatedKanbanColumn({ children, column, index, bulletColor }: Readonly<AnimatedKanbanColumnProps>) {
  const columnRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!columnRef.current || !titleRef.current) return

    const ctx = gsap.context(() => {
      // Animate the column
      gsap.fromTo(
        columnRef.current,
        {
          opacity: 0,
          x: -20,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          delay: 0.1 * index,
          ease: "power2.out",
        },
      )

      // Animate the title
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: -10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: 0.1 * index + 0.2,
          ease: "power2.out",
        },
      )

      // Animate the tasks
      gsap.fromTo(
        columnRef.current?.querySelectorAll(".task-card") || [],
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          delay: 0.1 * index + 0.3,
          ease: "power2.out",
        },
      )
    })

    return () => ctx.revert()
  }, [index])

  return (
    <div ref={columnRef} className="flex flex-col min-w-[280px] flex-shrink-0" data-column-id={column.id}>
      <h2
        ref={titleRef}
        className="text-sm font-semibold text-[var(--mid-grey)] uppercase tracking-wider mb-6
                flex items-center justify-start gap-2"
      >
        <span
          className={`before:block before:w-3 before:h-3 before:rounded-full before:mr-2
                ${bulletColor} `}
        ></span>
        {column.name} ({column.tasks.length})
      </h2>
      {children}
    </div>
  )
}
