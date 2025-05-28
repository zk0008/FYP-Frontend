import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

import { Providers } from "./providers"

export default function Layout({ children } : { children: React.ReactNode }) {

  return (
    <SidebarProvider>
      <Providers>
        <AppSidebar />
        <main className="flex-1 w-full">
          {children}
        </main>
      </Providers>
    </SidebarProvider>
  )
}
