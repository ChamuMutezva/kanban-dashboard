"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertCircle, Plus, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

// Define the form schema
const formSchema = z.object({
    columns: z
        .array(
            z.object({
                name: z.string().min(1, "Column name is required"),
            })
        )
        .min(1, "At least one column is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddColumnDialogProps {
    boardId: string;
    boardSlug: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddColumnDialog({
    boardId,
    open,
    onOpenChange,
}: Readonly<AddColumnDialogProps>) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Initialize the form with default values
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            columns: [{ name: "" }],
        },
    });

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name?.startsWith("columns") && error) {
                setError(null);
            }
        });
        return () => subscription.unsubscribe();
    }, [form, error]);

    // Add a new column field
    const addColumnField = () => {
        const currentColumns = form.getValues("columns");
        form.setValue("columns", [...currentColumns, { name: "" }]);
    };

    // Remove a column field
    const removeColumnField = (index: number) => {
        const currentColumns = form.getValues("columns");
        form.setValue(
            "columns",
            currentColumns.filter((_, i) => i !== index)
        );
    };

    // Handle form submission
    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        setError(null);
        try {
            // Send the data to your API
            const response = await fetch(`/api/boards/${boardId}/columns`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
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
                throw new Error(errorData.error ?? "Failed to add columns");
            }

            // Close the dialog
            onOpenChange(false);
            // Refresh the page to show the new columns
            router.refresh();
        } catch (error) {
            console.error("Error adding columns:", error);
            setError(
                error instanceof Error ? error.message : "Failed to add columns"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <CustomDialog open={open} onOpenChange={onOpenChange}>
            <CustomDialogContent className="w-11/12 sm:max-w-[425px]">
                <CustomDialogHeader>
                    <CustomDialogTitle>Add New Columns</CustomDialogTitle>
                    <CustomDialogDescription>
                        Add one or more columns to your board.
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
                                        Please use different names for these
                                        columns.
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
                        <div className="space-y-3">
                            <FormLabel>Columns</FormLabel>
                            {form.watch("columns").map((column, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <FormField
                                        control={form.control}
                                        name={`columns.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. In Progress"
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
                                        onClick={() => removeColumnField(index)}
                                        disabled={
                                            form.watch("columns").length <= 1
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
                                onClick={addColumnField}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Another Column
                            </Button>
                        </div>

                        <CustomDialogFooter>
                            <Button
                                type="submit"
                                className="w-full bg-[oklch(0.55_0.1553_281.45)] hover:bg-[oklch(0.55_0.1553_281.45)]/90 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Adding..." : "Add Columns"}
                            </Button>
                        </CustomDialogFooter>
                    </form>
                </Form>
            </CustomDialogContent>
        </CustomDialog>
    );
}
