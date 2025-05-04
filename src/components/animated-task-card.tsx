"use client";

import { useRef } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import type { Task } from "@/types/board";
import { useCardHoverAnimation } from "@/lib/gsap";

interface AnimatedTaskCardProps {
    task: Task;
    index: number;
}

export function AnimatedTaskCard({ task }: Readonly<AnimatedTaskCardProps>) {
    const cardRef = useRef<HTMLDivElement>(null!);

    // Apply hover animation
    useCardHoverAnimation(cardRef);

    // Count completed subtasks
    const completedSubtasks = task.subtasks.filter(
        (subtask) => subtask.isCompleted
    ).length;
    const totalSubtasks = task.subtasks.length;

    return (
        <Card
            ref={cardRef}
            className="task-card rounded-lg shadow-sm border hover:shadow-md transition-shadow"
        >
            <CardHeader>
                <CardTitle className="font-bold mb-2 leading-5">
                    {task.title}
                </CardTitle>
                <CardDescription className="text-xs text-mid-grey font-bold">
                    {completedSubtasks} of {totalSubtasks} subtasks
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
