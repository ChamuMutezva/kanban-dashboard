"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, X, Loader2, AlertCircle } from "lucide-react";

import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogDescription,
    CustomDialogFooter,
    CustomDialogHeader,
    CustomDialogTitle,
} from "@/components/ui/custom-dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define the form schema
const formSchema = z.object({
    name: z
        .string()
        .min(1, "Board name is required")
        .max(50, "Board name must be less than 50 characters"),
    columns: z
        .array(
            z.object({
                id: z.string().optional(), // Optional for new columns
                name: z.string().min(1, "Column name is required"),
            })
        )
        .min(1, "At least one column is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface Column {
    id: string;
    name: string;
}

interface Board {
    id: string;
    name: string;
    slug: string;
    columns: Column[];
}

interface EditBoardDialogProps {
    board: Board | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditBoardDialog({
    board,
    open,
    onOpenChange,
}: Readonly<EditBoardDialogProps>) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize the form with default values
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            columns: [{ name: "" }],
        },
    });

    // Update form values when the board changes or dialog opens
    useEffect(() => {
        if (board && open) {         
            // Reset the form with the current board data
            form.reset({
                name: board.name,
                columns: board.columns?.length
                    ? board.columns.map((col) => ({
                          id: col.id,
                          name: col.name,
                      }))
                    : [{ name: "" }],
            });
            setError(null);
        }
    }, [board, form, open]);

    // Add a new column
    const addColumn = () => {
        const currentColumns = form.getValues("columns");
        form.setValue("columns", [...currentColumns, { name: "" }]);
    };

    // Remove a column
    const removeColumn = (index: number) => {
        const currentColumns = form.getValues("columns");
        form.setValue(
            "columns",
            currentColumns.filter((_, i) => i !== index)
        );
    };

    const hasDuplicateColumns = (columns: { name: string }[]) => {
        const names = columns.map((c) => c.name.toLowerCase());
        return new Set(names).size !== names.length;
    };

    // Handle form submission
    const onSubmit = async (data: FormValues) => {
        if (!board) return;

        // Check for duplicates in the form data itself
        if (hasDuplicateColumns(data.columns)) {
            setError("Cannot have duplicate column names in your input");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {          

            // Send the data to your API
            const response = await fetch(`/api/boards/${board.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    columns: data.columns,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Handle duplicate columns error specifically
                if (errorData.error === "Column creation aborted") {
                    const duplicateNames = errorData.duplicateColumns
                        .map((c: { name: string }) => c.name)
                        .join(", ");
                    throw new Error(`Columns already exist: ${duplicateNames}`);
                }
                throw new Error(errorData.error ?? "Failed to update board");
            }

            const updatedBoard = await response.json();         

            // Close the dialog
            onOpenChange(false);

            // Navigate to the updated board (in case the slug changed)
            if (updatedBoard.slug !== board.slug) {
                router.push(`/boards/${updatedBoard.slug}`);
            }

            // Refresh the page to show the updated board
            router.refresh();
        } catch (error) {
            console.error("Error updating board:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update board"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <CustomDialog open={open} onOpenChange={onOpenChange}>
            <CustomDialogContent className="sm:max-w-[425px]">
                <CustomDialogHeader>
                    <CustomDialogTitle>Edit Board</CustomDialogTitle>
                    <CustomDialogDescription>
                        Update your board name and columns.
                    </CustomDialogDescription>
                </CustomDialogHeader>

                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <AlertDescription>
                            {error.includes("Columns already exist") ? (
                                <div>
                                    <p className="font-medium">{error}</p>
                                    <p className="text-sm mt-1">
                                        Please remove or rename these columns to
                                        continue.
                                    </p>
                                </div>
                            ) : (
                                error
                            )}
                        </AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Board Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Web Design Project"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-3">
                            <FormLabel>Board Columns</FormLabel>
                            {form.watch("columns").map((column, index) => (
                                <div
                                    key={column.id ?? index}
                                    className="flex items-center gap-2"
                                >
                                    <FormField
                                        control={form.control}
                                        name={`columns.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Todo"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeColumn(index)}
                                        disabled={
                                            form.watch("columns").length <= 1 ||
                                            isSubmitting
                                        }
                                    >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">
                                            Remove column
                                        </span>
                                    </Button>
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={addColumn}
                                disabled={isSubmitting}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Column
                            </Button>
                        </div>

                        <CustomDialogFooter>
                            <Button
                                type="submit"
                                className="w-full bg-[oklch(0.55_0.1553_281.45)] hover:bg-[oklch(0.55_0.1553_281.45)]/90 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </CustomDialogFooter>
                    </form>
                </Form>
            </CustomDialogContent>
        </CustomDialog>
    );
}
