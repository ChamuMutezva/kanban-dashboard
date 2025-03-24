import { getBoards } from "../../lib/boards";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Columns } from "lucide-react";

// Define the types for our data
interface Subtask {
    id: string;
    title: string;
    isCompleted: boolean;
}

interface Task {
    id: string;
    title: string;
    description?: string;
    status?: string;
    subtasks: Subtask[];
}

interface Column {
    id: string;
    name: string;
    tasks: Task[];
}

interface Board {
    id: string;
    name: string;
    slug: string;
    columns: Column[];
}

export default async function Home() {
    const boards = (await getBoards()) as unknown as Board[];

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Kanban Boards</h1>
                <p className="text-muted-foreground">
                    Manage your projects with these boards
                </p>
            </header>

            {boards.length < 1 ? (
                <NoBoardsFound />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {boards.map((board) => (
                        <Link
                            href={`/boards/${board.slug}`}
                            key={board.id}
                            className="group"
                        >
                            <Card className="h-full transition-all hover:shadow-md">
                                <CardHeader>
                                    <CardTitle className="group-hover:text-primary transition-colors">
                                        {board.name}
                                    </CardTitle>
                                    <CardDescription></CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Columns className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            tasks
                                        </span>
                                    </div>

                                    {/* Show column badges */}
                                    <div className="flex flex-wrap gap-2"></div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                    >
                                        View Board
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}

                    {/* Add new board card */}
                    <Card className="h-full border-dashed flex flex-col items-center justify-center p-6 hover:border-primary/50 transition-colors">
                        <div className="text-center">
                            <PlusCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="font-medium mb-2">
                                Create New Board
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                This board is empty. Create a new column to get
                                started
                            </p>
                            <Button>Create Board</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

function NoBoardsFound() {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/20">
            <h2 className="text-xl font-semibold mb-4">No boards found</h2>
            <p className="text-muted-foreground mb-6">
                Create your first board to get started
            </p>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Board
            </Button>
        </div>
    );
}
