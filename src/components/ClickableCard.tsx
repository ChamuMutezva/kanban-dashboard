"use client";
import React from "react";

interface ClickableCardProps {
    onClick: () => void;
    children: React.ReactNode;
    ariaLabel: string;
}

export function ClickableCard({
    onClick,
    children,
    ariaLabel,
}: Readonly<ClickableCardProps>) {
    return (
        <button
            type="button"
            className="relative w-full text-left bg-transparent p-0 border-0 cursor-pointer"
            onClick={onClick}
            aria-label={ariaLabel}
        >
            {children}
        </button>
    );
}
