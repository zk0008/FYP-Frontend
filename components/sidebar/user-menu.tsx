"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useState } from "react";

import { CircleUser, ChevronsUpDown } from "lucide-react";

import { AccountSettingsDialog, ManageInvitesDialog } from "@/components/dialogs/index";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useUserContext } from "@/hooks/use-user-context";

export function UserMenu() {
  const [isAccountSettingsDialogOpen, setIsAccountSettingsDialogOpen] = useState(false);
  const [isManageInvitesDialogOpen, setIsManageInvitesDialogOpen] = useState(false);
  const { open, openMobile } = useSidebar();

  const user = useUserContext();
  // const { user } = { user: { username: "JohnDoe" } };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <TooltipWrapper
            content="Show User Menu"
            side={ open || openMobile ? "top" : "right" }
          >
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <CircleUser />
                { user?.username }
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          </TooltipWrapper>

          <DropdownMenuContent
            side={ open || openMobile ? "top" : "right" }
            sideOffset={ 12 }
            className="w-60 bg-sidebar-primary-foreground text-sidebar-primary shadow-lg"
          >
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Button
                variant="ghost" 
                className="w-full justify-start p-2"
                onClick={() => setIsAccountSettingsDialogOpen(true)}
              >
                <span>Account Settings</span>
              </Button>
              <AccountSettingsDialog
                open={isAccountSettingsDialogOpen}
                onOpenChange={setIsAccountSettingsDialogOpen}
              />
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Button
                variant="ghost"
                className="w-full justify-start p-2"
                onClick={() => setIsManageInvitesDialogOpen(true)}
              >
                <span>Manage Pending Invites</span>
              </Button>
              <ManageInvitesDialog
                open={isManageInvitesDialogOpen}
                onOpenChange={setIsManageInvitesDialogOpen}
              />
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start p-2"
              >
                <span>Log Out</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
