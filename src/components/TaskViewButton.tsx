"use client";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye } from "lucide-react";

interface TaskViewButtonProps {
    onClick: () => void;
    className?: string;
}

export function TaskViewButton({
    onClick,
    className,
}: Readonly<TaskViewButtonProps>) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${className ?? ""}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                    }}
                    aria-label="View task details"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
                <p>View task details</p>
            </TooltipContent>
        </Tooltip>
    );
}
