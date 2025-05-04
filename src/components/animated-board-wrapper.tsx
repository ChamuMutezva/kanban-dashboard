"use client";

import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";

interface AnimatedBoardWrapperProps {
    children: ReactNode;
}

export function AnimatedBoardWrapper({
    children,
}: Readonly<AnimatedBoardWrapperProps>) {
    const boardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!boardRef.current) return;

        const ctx = gsap.context(() => {
            // Animate the entire board container
            gsap.fromTo(
                boardRef.current,
                {
                    opacity: 0,
                },
                {
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.out",
                }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <div ref={boardRef} className="overflow-x-auto pb-4 -mx-8 px-8">
            {children}
        </div>
    );
}
