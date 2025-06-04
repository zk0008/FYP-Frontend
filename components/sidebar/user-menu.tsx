"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useState } from "react";

import { CircleUser, ChevronsUpDown } from "lucide-react";

import { AccountSettingsDialog, ManageInvitesDialog } from "@/components/dialogs/index";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useRouter } from "next/navigation";
import { useToast, useUserContext } from "@/hooks";

const supabase = createClient();

export function UserMenu() {
  const [isAccountSettingsDialogOpen, setIsAccountSettingsDialogOpen] = useState(false);
  const [isManageInvitesDialogOpen, setIsManageInvitesDialogOpen] = useState(false);
  const { toast } = useToast();
  const user = useUserContext();
  const router = useRouter();

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
                <CircleUser />
                { user?.username }
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          </TooltipWrapper>

          <DropdownMenuContent
            side="right"
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
                onClick={async () => {
                  const { error } = await supabase.auth.signOut();

                  if (error) {
                    console.error("Error logging out:", error.message);
                    toast({
                      title: "Error",
                      description: "There was an error logging you out. Please try again.",
                      variant: "destructive",
                    })
                    return;
                  } else {
                    toast({
                      title: "Logged Out",
                      description: "You have successfully logged out. See you soon!",
                    });
                    router.push("/");
                  }
                }}
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
