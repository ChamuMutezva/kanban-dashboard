"use client";

import {
    AnimatedSpinner,
    AnimatedDotsLoader,
    AnimatedBarLoader,
} from "@/components/animated-loading";

export default function Loading({
    variant = "spinner",
}: Readonly<{
    variant?: "spinner" | "dots" | "bar";
}>) {
    function getLoaderComponent() {
        switch (variant) {
            case "spinner":
                return <AnimatedSpinner />;
            case "dots":
                return <AnimatedDotsLoader />;
            case "bar":
                return <AnimatedBarLoader />;
            default:
                return <AnimatedSpinner />;
        }
    }

    return getLoaderComponent();
}
