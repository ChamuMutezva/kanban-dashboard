export interface Subtask {
    id: string;
    title: string;
    isCompleted: boolean;
    taskId: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string | null;
    subtasks: Subtask[];
    columnId?: string; // Add columnId to the Task interface
}

export interface Column {
    id: string;
    name: string;
    tasks: Task[];
}

export interface Board {
    id: string;
    name: string;
    slug: string;
    columns: Column[];
}
