"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddColumnDialog } from "@/components/add-column-dialog";

interface AddColumnButtonProps {
    boardId: string;
    boardSlug: string;
}

export function AddColumnButton({
    boardId,
    boardSlug,
}: Readonly<AddColumnButtonProps>) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setDialogOpen(true)}
                variant={"link"}
                className="text-[oklch(0.55_0.1553_281.45)] dark:text-white"
            >
                <PlusCircle className="h-4 w-4" />
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
