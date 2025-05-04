"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export function AnimatedColumnSkeleton() {
    const skeletonRef = useRef<HTMLDivElement>(null!);

    useEffect(() => {
        if (!skeletonRef.current) return;

        const ctx = gsap.context(() => {
            // Animate the column headers
            gsap.fromTo(
                skeletonRef.current?.querySelectorAll(".column-header") || [],
                {
                    opacity: 0,
                    width: 0,
                },
                {
                    opacity: 1,
                    width: "8rem",
                    duration: 0.6,
                    stagger: 0.2,
                    ease: "power2.out",
                }
            );

            // Animate the task skeletons
            gsap.fromTo(
                skeletonRef.current.querySelectorAll(".task-skeleton"),
                {
                    opacity: 0,
                    y: 20,
                    height: 0,
                },
                {
                    opacity: 1,
                    y: 0,
                    height: "6rem",
                    duration: 0.4,
                    stagger: {
                        each: 0.1,
                        grid: "auto",
                        from: "start",
                    },
                    delay: 0.3,
                    ease: "power2.out",
                }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <div ref={skeletonRef} className="flex gap-6 min-w-max">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col w-[280px] flex-shrink-0">
                    <div className="column-header h-6 bg-muted rounded mb-6"></div>
                    <div className="space-y-5 min-h-[200px]">
                        {[1, 2, 3].map((j) => (
                            <div
                                key={j}
                                className="task-skeleton bg-muted rounded"
                            ></div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
