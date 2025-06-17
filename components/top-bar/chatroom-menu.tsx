"use client";

import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useUnifiedChatroomContext, useUserContext } from "@/hooks";
import {
  DeleteChatroomDialog,
  EditChatroomDialog,
  InviteUserDialog,
  LeaveChatroomDialog,
  ManageDocumentsDialog
} from "@/components/dialogs";

export function ChatroomMenu() {
  const { user } = useUserContext();
  const { currentChatroom } = useUnifiedChatroomContext();
  
  const [isEditChatroomDialogOpen, setIsEditChatroomDialogOpen] = useState<boolean>(false);
  const [isInviteUserDialogOpen, setIsInviteUserDialogOpen] = useState<boolean>(false);
  const [isManageFilesDialogOpen, setIsManageFilesDialogOpen] = useState<boolean>(false);
  const [isLeaveChatroomDialogOpen, setIsLeaveChatroomDialogOpen] = useState<boolean>(false);
  const [isDeleteChatroomDialogOpen, setIsDeleteChatroomDialogOpen] = useState<boolean>(false);

  const isCreator = user?.userId === currentChatroom?.creatorId;

  return (
    <DropdownMenu>
      <TooltipWrapper
        content="Show Chatroom Menu"
        side="left"
      >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
      </TooltipWrapper>

      <DropdownMenuContent
        side="bottom"
        sideOffset={ 16 }
        className="w-64 bg-sidebar-primary-foreground text-sidebar-primary shadow-lg"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Button
              variant="ghost"
              className="w-full justify-start p-2"
              onClick={() => setIsEditChatroomDialogOpen(true)}
            >
              <span>Edit Chatroom</span>
            </Button>
            <EditChatroomDialog
              open={ isEditChatroomDialogOpen }
              onOpenChange={ setIsEditChatroomDialogOpen }
            />
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Button
              variant="ghost"
              className="w-full justify-start p-2"
              onClick={() => setIsInviteUserDialogOpen(true)}
            >
              <span>Invite a User</span>
            </Button>
            <InviteUserDialog
              open={ isInviteUserDialogOpen }
              onOpenChange={ setIsInviteUserDialogOpen }
            />
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Button
              variant="ghost"
              className="w-full justify-start p-2"
              onClick={() => setIsManageFilesDialogOpen(true)}
            >
              <span>Manage Uploaded Documents</span>
            </Button>
            <ManageDocumentsDialog
              open={ isManageFilesDialogOpen }
              onOpenChange={ setIsManageFilesDialogOpen }
            />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            {/* Use of ellipsis to indicate an additional step required before leaving */}
            {isCreator ? (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2"
                  onClick={() => setIsDeleteChatroomDialogOpen(true)}
                >
                  <span>Delete Chatroom...</span>
                </Button>
                <DeleteChatroomDialog
                  open={ isDeleteChatroomDialogOpen }
                  onOpenChange={ setIsDeleteChatroomDialogOpen }
                />
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2"
                  onClick={() => setIsLeaveChatroomDialogOpen(true)}
                >
                  <span>Leave Chatroom...</span>
                </Button>
                <LeaveChatroomDialog
                  open={ isLeaveChatroomDialogOpen }
                  onOpenChange={ setIsLeaveChatroomDialogOpen }
                />
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}