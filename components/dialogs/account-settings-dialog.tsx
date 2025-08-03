"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ChangeUsernameForm } from "@/components/forms";

import { BaseDialog } from "./base-dialog";

type SettingsStage = "MENU" | "CHANGE_USERNAME" | "DELETE_ACCOUNT";

interface AccountSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountSettingsDialog({
  open,
  onOpenChange,
}: AccountSettingsDialogProps) {
  const [currentStage, setCurrentStage] = useState<SettingsStage>("MENU");

  // Reset state when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCurrentStage("MENU");
    }
    onOpenChange(open);
  };

  // Get dialog content based on current stage
  const getDialogContent = () => {
    switch (currentStage) {
      case "MENU":
        return {
          title: "Account Settings",
          description: "Here you can manage your account settings.",
          content: (
            <div className="flex flex-col space-y-3">
              <Button
                variant="outline"
                className="justify-start h-12"
                onClick={() => setCurrentStage("CHANGE_USERNAME")}
              >
                Change Username
              </Button>
              <Button
                variant="destructive"
                className="justify-start h-12"
                onClick={() => setCurrentStage("DELETE_ACCOUNT")}
              >
                Delete Account
              </Button>
            </div>
          ),
        };

      case "CHANGE_USERNAME":
        return {
          title: "Change Username",
          description: "Here you can change your username.",
          content: <ChangeUsernameForm handleBack={() => setCurrentStage("MENU")} />
        };

      // TODO: Account deletion needs to go through backend (e.g., DELETE /api/users/{user_id})
      case "DELETE_ACCOUNT":
        return {
          title: "Delete Account",
          description: "This action cannot be undone. Your account and all associated data will be permanently deleted. You will be signed out and lose access to all chatrooms.",
          content: (
            <div className="flex justify-between space-x-2 pt-4">
              <Button variant="outline" onClick={() => setCurrentStage("MENU")}>
                Back
              </Button>
              <Button variant="destructive" onClick={() => console.log("delete account")} >
                Delete Account
              </Button>
            </div>
          ),
        };

      default:
        return getDialogContent();
    }
  };

  const dialogContent = getDialogContent();

  return (
    <BaseDialog
      open={ open }
      onOpenChange={ handleOpenChange }
      title={ dialogContent.title }
      description={ dialogContent.description }
    >
      { dialogContent.content }
    </BaseDialog>
  );
}