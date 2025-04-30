"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogDescription,
    CustomDialogFooter,
    CustomDialogHeader,
    CustomDialogTitle,
} from "@/components/ui/custom-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface Board {
    id: string;
    name: string;
    slug: string;
}

interface DeleteBoardDialogProps {
    board: Board | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteBoardDialog({
    board,
    open,
    onOpenChange,
}: Readonly<DeleteBoardDialogProps>) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!board) return;

        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch(`/api/boards/${board.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete board");
            }

            // Close the dialog
            onOpenChange(false);

            // Navigate to the home page
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Error deleting board:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete board"
            );
        } finally {
            setIsDeleting(false);
        }
    };

    if (!board) return null;

    return (
        <CustomDialog open={open} onOpenChange={onOpenChange}>
            <CustomDialogContent className="sm:max-w-[425px] bg-background border-border">
                <CustomDialogHeader>
                    <CustomDialogTitle className="text-destructive">
                        Delete this Board?
                    </CustomDialogTitle>
                    <CustomDialogDescription className="text-muted-foreground">
                        Are you sure you want to delete the `{board.name}`
                        board? This action cannot be undone and will delete all
                        columns and tasks associated with this board.
                    </CustomDialogDescription>
                </CustomDialogHeader>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <CustomDialogFooter className="gap-2 sm:gap-0 flex">
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                </CustomDialogFooter>
            </CustomDialogContent>
        </CustomDialog>
    );
}
