"use client";

import { useRef, type ReactNode } from "react";
import { useGSAPAnimation } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface AnimatedElementProps {
    children: ReactNode;
    animation?: {
        opacity?: number;
        y?: number;
        x?: number;
        scale?: number;
        rotation?: number;
        duration?: number;
        ease?: string;
    };
    className?: string;
    delay?: number;
    triggerOnScroll?: boolean;
}

export default function AnimatedElement({
    children,
    animation = { opacity: 0, y: 20, duration: 0.5, ease: "power2.out" },
    className,
    delay = 0,
    triggerOnScroll = false,
}: Readonly<AnimatedElementProps>) {
    const elementRef = useRef<HTMLDivElement>(null!);

    useGSAPAnimation(elementRef, animation, triggerOnScroll, delay);

    return (
        <div ref={elementRef} className={cn(className)}>
            {children}
        </div>
    );
}
