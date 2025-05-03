"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, X } from "lucide-react";

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
    name: z
        .string()
        .min(1, "Board name is required")
        .max(50, "Board name must be less than 50 characters"),
    columns: z
        .array(
            z.object({
                name: z.string().min(1, "Column name is required"),
            })
        )
        .min(1, "At least one column is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateBoardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateBoardDialog({
    open,
    onOpenChange,
}: Readonly<CreateBoardDialogProps>) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize the form with default values
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            columns: [{ name: "Todo" }, { name: "Doing" }, { name: "Done" }],
        },
    });

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

    // Handle form submission
    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            // Create a slug from the board name
            // This converts "Mobile Device" to "mobile-device"
            const slug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

            // Send the data to your API
            const response = await fetch("/api/boards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    slug,
                    columns: data.columns,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create board");
            }

            await response.json();

            // Close the dialog
            onOpenChange(false);

            // Navigate to the new board
            router.push(`/boards/${slug}`);
            router.refresh();
        } catch (error) {
            console.error("Error creating board:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <CustomDialog open={open} onOpenChange={onOpenChange}>
            <CustomDialogContent className="sm:max-w-[425px]">
                <CustomDialogHeader>
                    <CustomDialogTitle>Add New Board</CustomDialogTitle>
                    <CustomDialogDescription>
                        Create a new board to organize your tasks.
                    </CustomDialogDescription>
                </CustomDialogHeader>

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
                                onClick={addColumn}
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
                                {isSubmitting
                                    ? "Creating..."
                                    : "Create New Board"}
                            </Button>
                        </CustomDialogFooter>
                    </form>
                </Form>
            </CustomDialogContent>
        </CustomDialog>
    );
}
