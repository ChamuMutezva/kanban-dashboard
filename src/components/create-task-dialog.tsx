"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, X } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Define the form schema
const formSchema = z.object({
    title: z
        .string()
        .min(1, "Task title is required")
        .max(100, "Task title must be less than 100 characters"),
    description: z.string().optional(),
    columnId: z.string().min(1, "Column is required"),
    subtasks: z
        .array(
            z.object({
                title: z.string().min(1, "Subtask title is required"),
            })
        )
        .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Column {
    id: string;
    name: string;
}

interface CreateTaskDialogProps {
    boardId: string;
    columns: Column[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultColumnId?: string;
}

export function CreateTaskDialog({
    boardId,
    columns,
    open,
    onOpenChange,
    defaultColumnId,
}: Readonly<CreateTaskDialogProps>) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize the form with default values
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            columnId: defaultColumnId || "",
            subtasks: [{ title: "" }],
        },
    });

    // Add a new subtask field
    const addSubtask = () => {
        const currentSubtasks = form.getValues("subtasks") || [];
        form.setValue("subtasks", [...currentSubtasks, { title: "" }]);
    };

    // Remove a subtask field
    const removeSubtask = (index: number) => {
        const currentSubtasks = form.getValues("subtasks") || [];
        form.setValue(
            "subtasks",
            currentSubtasks.filter((_, i) => i !== index)
        );
    };

    // Handle form submission
    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            // Send the data to your API
            const response = await fetch(`/api/boards/${boardId}/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to create task");
            }

            // Close the dialog
            onOpenChange(false);

            // Refresh the page to show the new task
            router.refresh();
        } catch (error) {
            console.error("Error creating task:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>
                        Create a new task with subtasks.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Take coffee break"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-3">
                            <FormLabel>Subtasks</FormLabel>
                            {(form.watch("subtasks") || []).map(
                                (subtask, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <FormField
                                            control={form.control}
                                            name={`subtasks.${index}.title`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="e.g. Make coffee"
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
                                            onClick={() => removeSubtask(index)}
                                        >
                                            <X className="h-4 w-4" />
                                            <span className="sr-only">
                                                Remove subtask
                                            </span>
                                        </Button>
                                    </div>
                                )
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={addSubtask}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Subtask
                            </Button>
                        </div>

                        <FormField
                            control={form.control}
                            name="columnId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {columns.map((column) => (
                                                <SelectItem
                                                    key={column.id}
                                                    value={column.id}
                                                >
                                                    {column.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="submit"
                                className="w-full bg-[oklch(0.55_0.1553_281.45)] hover:bg-[oklch(0.55_0.1553_281.45)]/90 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Creating..." : "Create Task"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
