"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { pageTransition } from "@/lib/gsap";

export default function AnimatedPageTransition({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const pageRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        if (pageRef.current) {
            pageTransition(pageRef.current);
        }
    }, [pathname]);

    return <div ref={pageRef}>{children}</div>;
}
