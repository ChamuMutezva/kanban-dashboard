"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { X, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    CustomDialog,
    CustomDialogContent,    
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Task } from "./TaskViewModal";
import { DialogClose } from "./ui/dialog";

// Define the form schema with Zod
const taskFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    subtasks: z.array(
        z.object({
            id: z.string(),
            title: z.string().min(1, "Subtask title is required"),
            isCompleted: z.boolean(),
            taskId: z.string(),
        })
    ),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface EditTaskFormProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedTask: Task) => Promise<void>;
    error?: string | null;
    isSubmitting?: boolean;
}

export function EditTaskForm({
    task,
    isOpen,
    onClose,
    onSave,
    error = null,
    isSubmitting = false,
}: Readonly<EditTaskFormProps>) {
    // Initialize the form with the current task values
    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: task.title,
            description: task.description ?? "",
            subtasks: task.subtasks,
        },
    });

    // Handle form submission
    const onSubmit = async (values: TaskFormValues) => {
        // Create the updated task object
        const updatedTask: Task = {
            id: task.id,
            title: values.title,
            description: values.description || null,
            subtasks: values.subtasks,
        };

        // Call the onSave function passed from the parent
        await onSave(updatedTask);
    };

    // Add a new empty subtask
    const addSubtask = () => {
        const currentSubtasks = form.getValues("subtasks") || [];
        form.setValue("subtasks", [
            ...currentSubtasks,
            {
                id: `new-${Date.now()}`, // Temporary ID that will be replaced on the server
                title: "",
                isCompleted: false,
                taskId: task.id,
            },
        ]);
    };

    // Remove a subtask by index
    const removeSubtask = (index: number) => {
        const currentSubtasks = form.getValues("subtasks") || [];
        form.setValue(
            "subtasks",
            currentSubtasks.filter((_, i) => i !== index)
        );
    };

    return (
        <CustomDialog open={isOpen} onOpenChange={onClose}>
            <CustomDialogContent className="sm:max-w-md">
                <CustomDialogHeader>
                    <CustomDialogTitle>Edit Task</CustomDialogTitle>
                </CustomDialogHeader>

                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Task title"
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
                                            placeholder="Task description"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <FormLabel>Subtasks</FormLabel>
                            <div className="space-y-2 mt-2">
                                {form
                                    .watch("subtasks")
                                    ?.map((subtask, index) => (
                                        <div
                                            key={subtask.id || index}
                                            className="flex items-center gap-2"
                                        >
                                            <FormField
                                                control={form.control}
                                                name={`subtasks.${index}.isCompleted`}
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={
                                                                    field.value
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`subtasks.${index}.title`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Subtask title"
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
                                                onClick={() =>
                                                    removeSubtask(index)
                                                }
                                            >
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Remove subtask
                                                </span>
                                            </Button>
                                        </div>
                                    ))}
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={addSubtask}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Subtask
                            </Button>
                        </div>

                        <CustomDialogFooter className="gap-2 sm:gap-0">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </CustomDialogFooter>
                    </form>
                </Form>
            </CustomDialogContent>
        </CustomDialog>
    );
}
