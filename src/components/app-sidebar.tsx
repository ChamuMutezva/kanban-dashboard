"use client";

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
} from "@/components/ui/sidebar";
import NavLogo from "./nav-logo";
import { Button } from "./ui/button";

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
    // const addIcon = "/assets/icon-add-task-mobile.svg";

    return (
        <Sidebar>
            <SidebarContent className="justify-between">
                <SidebarGroup>
                    <Link
                        href="/"
                        passHref
                        className={`flex items-center justify-start px-2 gap-2 py-4 rounded-md `}
                    >
                        <NavLogo />
                        <span className="sr-only">Home</span>
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
                                        >
                                            <Link
                                                href={`/boards/${item.slug}`}
                                                passHref
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
                <ModeToggle />
            </SidebarContent>
        </Sidebar>
    );
}
