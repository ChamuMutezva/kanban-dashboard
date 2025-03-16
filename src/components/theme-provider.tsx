"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: Readonly<ThemeProviderProps>) {
    const [mounted, setMounted] = React.useState(false);

    // Only render the theme provider after the component has mounted
    // This prevents hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>;
    }

    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
