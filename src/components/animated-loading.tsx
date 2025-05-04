"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export function AnimatedSpinner() {
    const spinnerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (!spinnerRef.current || !textRef.current) return;

        const ctx = gsap.context(() => {
            // Animate the spinner
            gsap.fromTo(
                spinnerRef.current,
                {
                    opacity: 0,
                    scale: 0.5,
                    rotation: 0,
                },
                {
                    opacity: 1,
                    scale: 1,
                    rotation: 360,
                    duration: 0.8,
                    ease: "back.out(1.7)",
                }
            );

            // Animate the text
            gsap.fromTo(
                textRef.current,
                {
                    opacity: 0,
                    y: 10,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: 0.3,
                    ease: "power2.out",
                }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
            <div ref={spinnerRef} className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
                <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            </div>
            <p ref={textRef} className="text-gray-600 font-medium">
                Loading...
            </p>
        </div>
    );
}

export function AnimatedDotsLoader() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (!containerRef.current || !textRef.current) return;

        const ctx = gsap.context(() => {
            // Animate the dots container
            gsap.fromTo(
                containerRef.current,
                {
                    opacity: 0,
                    scale: 0.8,
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out",
                }
            );

            // Animate the text
            gsap.fromTo(
                textRef.current,
                {
                    opacity: 0,
                    y: 10,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: 0.2,
                    ease: "power2.out",
                }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
            <div ref={containerRef} className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="w-3 h-3 rounded-full bg-blue-500 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
            <p ref={textRef} className="text-gray-600 font-medium">
                Loading...
            </p>
        </div>
    );
}

export function AnimatedBarLoader() {
    const barRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (!barRef.current || !textRef.current) return;

        const ctx = gsap.context(() => {
            // Animate the bar
            gsap.fromTo(
                barRef.current,
                {
                    opacity: 0,
                    width: 0,
                },
                {
                    opacity: 1,
                    width: "8rem",
                    duration: 0.7,
                    ease: "power2.out",
                }
            );

            // Animate the text
            gsap.fromTo(
                textRef.current,
                {
                    opacity: 0,
                    y: 10,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: 0.3,
                    ease: "power2.out",
                }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
            <div
                ref={barRef}
                className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden"
            >
                <div className="h-full bg-blue-500 rounded-full animate-progress"></div>
            </div>
            <p ref={textRef} className="text-gray-600 font-medium">
                Loading...
            </p>
        </div>
    );
}
