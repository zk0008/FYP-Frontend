"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator
} from "@/components/ui/sidebar";

import { ChatroomsList, ExitChatroomButton, UserMenu } from "@/components/sidebar";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <ExitChatroomButton />
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <ChatroomsList />
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  )
}
