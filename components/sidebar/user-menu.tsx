"use client";

import { CircleUser, ChevronsUpDown, Dot } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AccountSettingsDialog, ManageInvitesDialog } from "@/components/dialogs/index";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getInitials } from "@/utils";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useInvitesContext, useUserContext } from "@/hooks";

import { SignOutButton } from "./sign-out-button";

export function UserMenu() {
  const [isAccountSettingsDialogOpen, setIsAccountSettingsDialogOpen] = useState<boolean>(false);
  const [isManageInvitesDialogOpen, setIsManageInvitesDialogOpen] = useState<boolean>(false);
  const { user } = useUserContext();
  const { invites } = useInvitesContext();
  const router = useRouter();

  const userIcon = user?.username ? (
    <Avatar className="h-6 w-6">
      <AvatarFallback>
        { getInitials(user!.username) }
      </AvatarFallback>
    </Avatar>
  ) : <CircleUser />;   // Fallback to the fallback

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <TooltipWrapper
            content="Show User Menu"
            side="right"
          >
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                { userIcon }
                { user?.username }
                <div className="flex items-center ml-auto">
                  { invites.length > 0 && <Dot className="h-8 w-8 text-red-500" /> }
                  <ChevronsUpDown />
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          </TooltipWrapper>

          <DropdownMenuContent
            side="top"
            sideOffset={ 12 }
            className="w-60 bg-sidebar-primary-foreground text-sidebar-primary shadow-lg"
          >
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Button
                variant="ghost"
                className="w-full justify-start p-2"
                onClick={() => router.push("/chat")}
              >
                <span>Switch to Legacy App</span>
              </Button>
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Button
                variant="ghost" 
                className="w-full justify-start p-2"
                onClick={() => setIsAccountSettingsDialogOpen(true)}
              >
                <span>Account Settings</span>
              </Button>
              <AccountSettingsDialog
                open={ isAccountSettingsDialogOpen }
                onOpenChange={ setIsAccountSettingsDialogOpen }
              />
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Button
                variant="ghost"
                className="w-full justify-start p-2"
                onClick={() => setIsManageInvitesDialogOpen(true)}
              >
                <span>Manage Pending Invites</span>
                { invites.length > 0 && <Dot className="h-8 w-8 text-red-500" /> }
              </Button>
              <ManageInvitesDialog
                open={ isManageInvitesDialogOpen }
                onOpenChange={ setIsManageInvitesDialogOpen }
              />
            </DropdownMenuItem>

            <SidebarSeparator className="my-1" />

            <DropdownMenuItem>
              <SignOutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
