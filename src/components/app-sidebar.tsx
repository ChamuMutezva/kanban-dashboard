"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import Image from "next/image";
import Link from "next/link";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import NavLogo from "./nav-logo";
import { Button } from "./ui/button";
import { CreateBoardDialog } from "./create-board-dialog";

// Define the Board type
interface Board {
    id: string;
    name: string;
    slug: string;
}

// Update the component to accept boards as a prop
export function AppSidebar({ boards }: Readonly<{ boards: Board[] }>) {
    const pathname = usePathname();
    const boardIcon = "/assets/icon-board.svg";
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const { setOpenMobile, isMobile } = useSidebar();

    function handleBoardClick() {
        setOpenMobile(false);
    }

    return (
        <>
            <Sidebar>
                <SidebarContent className="justify-between">
                    <SidebarGroup>
                        <Link
                            href="/"
                            passHref
                            onClick={handleBoardClick}
                            className={`flex items-center justify-start px-2 gap-2 py-4 rounded-md `}
                        >
                            <NavLogo />
                            <span className="sr-only">Home page</span>
                        </Link>

                        <SidebarGroupLabel>{`All boards(${boards.length})`}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {boards.map((item) => {
                                    const isActive =
                                        pathname === `/boards/${item.slug}`;

                                    return (
                                        <SidebarMenuItem key={item.id}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive}
                                                size={isMobile ? "sm" : "lg"}
                                            >
                                                <Link
                                                    href={`/boards/${item.slug}`}
                                                    passHref
                                                    onClick={handleBoardClick}
                                                >
                                                    <Image
                                                        src={
                                                            boardIcon ||
                                                            "/placeholder.svg"
                                                        }
                                                        alt=""
                                                        width={16}
                                                        height={16}
                                                        priority
                                                    />
                                                    <span>{item.name}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                                <Button
                                    variant={"ghost"}
                                    className="justify-start px-2"
                                    size={isMobile ? "sm" : "lg"}
                                    onClick={() => setCreateDialogOpen(true)}
                                >
                                    <Image
                                        className="dark:invert"
                                        src={boardIcon || "/placeholder.svg"}
                                        alt=""
                                        width={16}
                                        height={16}
                                        priority
                                    />

                                    <span> + Create New Board</span>
                                </Button>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    {/* dark and light mode toggle */}
                    <ModeToggle />
                </SidebarContent>
            </Sidebar>
            <CreateBoardDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />
        </>
    );
}
