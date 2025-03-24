import { ModeToggle } from "./ModeToggle"
import Image from "next/image"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import NavLogo from "./nav-logo"

// Define the Board type
interface Board {
  id: string
  name: string
  slug: string
}

// Update the component to accept boards as a prop
export function AppSidebar({ boards }: Readonly<{ boards: Board[] }>) {
  const boardIcon = "/assets/icon-board.svg"

  return (
    <Sidebar>
      <SidebarContent className="justify-between">
        <SidebarGroup>
          <SidebarGroupLabel className="sr-only">Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavLogo />
          <SidebarGroupContent/>
            <SidebarMenu>
              <Link href="/" passHref className="flex items-center justify-start px-2 gap-2">
                {" "}
                <Image
                  className="dark:invert"
                  src={boardIcon || "/placeholder.svg"}
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
                    <Link href={`/boards/${item.slug}`} passHref>
                      <Image
                        className="dark:invert"
                        src={boardIcon || "/placeholder.svg"}
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
  )
}

