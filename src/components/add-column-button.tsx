"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddColumnDialog } from "@/components/add-column-dialog";
import Image from "next/image";
interface AddColumnButtonProps {
    boardId: string;
    boardSlug: string;
}

export function AddColumnButton({
    boardId,
    boardSlug,
}: Readonly<AddColumnButtonProps>) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const iconAddTask = "/assets/icon-add-task-mobile.svg";
    return (
        <>
            <Button
                onClick={() => setDialogOpen(true)}
                variant={"link"}
                className="text-[oklch(0.55_0.1553_281.45)] dark:text-white"
            >
                <Image
                    src={iconAddTask || "/placeholder.svg"}
                    alt=""
                    width={12}
                    height={12}
                    priority
                    className="invert dark:invert-0"
                />
                Add New Column
            </Button>

            <AddColumnDialog
                boardId={boardId}
                boardSlug={boardSlug}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </>
    );
}
