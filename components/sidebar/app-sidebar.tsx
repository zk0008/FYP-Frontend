"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator
} from "@/components/ui/sidebar";

import { ChatroomsList } from "./chatrooms-list";
import { ExitChatroomButton } from "./exit-chatroom-button";
import { UserMenu } from "./user-menu";

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
