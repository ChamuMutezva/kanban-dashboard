import { getBoards } from "../lib/boards";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { Board } from "@/types/board";
import { AnimatedBoardCard } from "@/components/animated-board-card";
import AnimatedElement from "@/components/ui/animated-element";

export default async function Home() {
    const boards = (await getBoards()) as unknown as Board[];

    return (
        <div className="container mx-auto p-4">
            <AnimatedElement
                animation={{
                    opacity: 0,
                    y: -10,
                    duration: 0.6,
                    ease: "power2.out",
                }}
                className="mb-8"
            >
                <h2 className="text-3xl font-bold mb-2">My Kanban Boards</h2>
                <p className="text-muted-foreground">
                    Manage your projects with these boards
                </p>
            </AnimatedElement>

            {boards.length < 1 ? (
                <AnimatedElement
                    animation={{
                        opacity: 0,
                        scale: 0.95,
                        duration: 0.7,
                        ease: "back.out(1.7)",
                    }}
                    delay={0.3}
                >
                    <NoBoardsFound />
                </AnimatedElement>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {boards.map((board, index) => (
                        <AnimatedBoardCard
                            key={board.id}
                            board={board}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function NoBoardsFound() {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/20">
            <h3 className="text-xl font-semibold mb-4 animate-fade-in">
                No boards found
            </h3>
            <p className="text-muted-foreground mb-6 animate-fade-in stagger-delay-1">
                Create your first board to get started
            </p>
            <Button className="animate-scale-in stagger-delay-2">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Board
            </Button>
        </div>
    );
}
