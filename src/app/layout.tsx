import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "./globals.css"
import { Separator } from "@/components/ui/separator"
import { getBoards } from "../lib/boards"
import { CurrentBoardHeader } from "@/components/current-board-header"
import AnimatedPageTransition from "@/components/animated-page-transition"

const geistJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-geist-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Kanban dashboard App",
  description: "Kanban dashboard App, help you to manage your tasks",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Fetch boards data at the layout level
  const boards = await getBoards()

  return (
    <html lang="en" className={`${geistJakartaSans.variable}`}>
      <body className={`font-sans antialiased`} suppressHydrationWarning={true}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            {/* Pass the boards data to AppSidebar. AppSidebar is client component 
                        Hence I need to fetch the data in the server using async */}
            <AppSidebar boards={boards} />
            <div className="w-full">
              <header className="flex gap-2 py-4 items-center bg-white dark:bg-[var(--almost-black)] animate-slide-in-left">
                <SidebarTrigger />
                <CurrentBoardHeader boards={boards} />
              </header>
              <Separator className="w-full" />
              <AnimatedPageTransition>{children}</AnimatedPageTransition>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
