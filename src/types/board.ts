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
