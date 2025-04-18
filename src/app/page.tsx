import { getBoards } from "../lib/boards";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Columns } from "lucide-react";
import { Board } from "@/types/board";

export default async function Home() {
    const boards = (await getBoards()) as unknown as Board[];

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">My Kanban Boards</h2>
                <p className="text-muted-foreground">
                    Manage your projects with these boards
                </p>
            </div>

            {boards.length < 1 ? (
                <NoBoardsFound />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {boards.map((board) => (
                        <div key={board.id} className="group">
                            <Card className="h-full transition-all relative isolate hover:shadow-md">
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
                                </CardContent>
                                <CardFooter>
                                    <Link
                                        href={`/boards/${board.slug}`}
                                        className="w-full justify-start"
                                    >
                                        <span className="inset-0 absolute z-50"></span>
                                        View Board
                                        <span className="sr-only">{`${board.name}`}</span>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

function NoBoardsFound() {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/20">
            <h3 className="text-xl font-semibold mb-4">No boards found</h3>
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
