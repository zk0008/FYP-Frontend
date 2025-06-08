import { AppSidebar } from "@/components/sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { Providers } from "./providers"

export default function Layout({ children } : { children: React.ReactNode }) {

  return (
    <SidebarProvider>
      <Providers>
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1 w-full">
            {children}
          </main>
        </SidebarInset>
      </Providers>
    </SidebarProvider>
  )
}
