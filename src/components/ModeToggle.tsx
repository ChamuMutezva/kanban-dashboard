"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center justify-center gap-2 p-2">
            <RadioGroup
                value={theme}
                onValueChange={(value) => setTheme(value)}
                className="flex items-center justify-center gap-1 bg-muted/50 dark:bg-muted/80 w-full rounded-lg p-1"
            >
                {/* Light Theme */}
                <div className="flex items-center">
                    <RadioGroupItem
                        value="light"
                        id="light"
                        className="sr-only peer"
                    />
                    <Label
                        htmlFor="light"
                        className="cursor-pointer p-2 rounded-md transition-colors
                        hover:bg-accent hover:text-accent-foreground
                        dark:hover:bg-accent/80 dark:hover:text-accent-foreground
                        peer-focus-visible:ring-2 peer-focus-visible:ring-foreground
                        peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background
                        peer-data-[state=checked]:bg-accent peer-data-[state=checked]:text-accent-foreground
                        dark:peer-data-[state=checked]:bg-accent/90 dark:peer-data-[state=checked]:text-accent-foreground"
                    >
                        <Sun className="h-4 w-4 text-foreground/80 dark:text-foreground" />
                        <span className="sr-only">Light theme</span>
                    </Label>
                </div>

                {/* Dark Theme */}
                <div className="flex items-center">
                    <RadioGroupItem
                        value="dark"
                        id="dark"
                        className="sr-only peer"
                    />
                    <Label
                        htmlFor="dark"
                        className="cursor-pointer p-2 rounded-md transition-colors
                        hover:bg-accent hover:text-accent-foreground
                        dark:hover:bg-accent/80 dark:hover:text-accent-foreground
                        peer-focus-visible:ring-2 peer-focus-visible:ring-foreground
                        peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background
                        peer-data-[state=checked]:bg-accent peer-data-[state=checked]:text-accent-foreground
                        dark:peer-data-[state=checked]:bg-accent/90 dark:peer-data-[state=checked]:text-accent-foreground"
                    >
                        <Moon className="h-4 w-4 text-foreground/80 dark:text-foreground" />
                        <span className="sr-only">Dark theme</span>
                    </Label>
                </div>

                {/* System Theme */}
                <div className="flex items-center">
                    <RadioGroupItem
                        value="system"
                        id="system"
                        className="sr-only peer"
                    />
                    <Label
                        htmlFor="system"
                        className="cursor-pointer p-2 rounded-md transition-colors
                        hover:bg-accent hover:text-accent-foreground
                        dark:hover:bg-accent/80 dark:hover:text-accent-foreground
                        peer-focus-visible:ring-2 peer-focus-visible:ring-foreground
                        peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background
                        peer-data-[state=checked]:bg-accent peer-data-[state=checked]:text-accent-foreground
                        dark:peer-data-[state=checked]:bg-accent/90 dark:peer-data-[state=checked]:text-accent-foreground"
                    >
                        <Monitor className="h-4 w-4 text-foreground/80 dark:text-foreground" />
                        <span className="sr-only">System theme</span>
                    </Label>
                </div>
            </RadioGroup>
        </div>
    );
}
