// import {Calendar,Home, Inbox, Search, Settings, TableProperties,} from "lucide-react";
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

import { getBoards } from "../../lib/boards";

/*
const items = [
    {
        title: "Platform Launch",
        url: "#",
        icon: TableProperties,
    },
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "Inbox",
        url: "#",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
];
*/

export async function AppSidebar() {
    const boardIcon = "/assets/icon-board.svg";
    const boards = await getBoards();  
    return (
        <Sidebar>
            <SidebarContent className="justify-between">
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <Link
                                href="/"
                                passHref
                                className="flex items-center justify-start px-2 gap-2"
                            >
                                {" "}
                                <Image
                                    className="dark:invert"
                                    src={boardIcon}
                                    alt=""
                                    width={16}
                                    height={16}
                                    priority
                                />
                                <span>Home</span>
                            </Link>
                            {boards.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={`/boards/${item.id}`}
                                            passHref
                                        >
                                            <Image
                                                className="dark:invert"
                                                src={boardIcon}
                                                alt=""
                                                width={16}
                                                height={16}
                                                priority
                                            />
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <ModeToggle />
            </SidebarContent>
        </Sidebar>
    );
}
