"use client";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PendingInvitesTable } from "@/components/tables/pending-invites-table";
import { useInvitesContext } from "@/hooks";

import { BaseDialog } from "./base-dialog";

export function ManageInvitesDialog({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { invites, refresh } = useInvitesContext();

  return (
    <BaseDialog
      open={ open }
      onOpenChange={ onOpenChange }
      title="Manage Pending Invites"
      description="Here you can manage your pending chatroom invites."
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground">
          { invites.length } pending invite{ invites.length !== 1 ? 's' : '' } found
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={ refresh }
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <PendingInvitesTable invites={ invites } onInviteUpdated={ refresh } />
    </BaseDialog>
  );
}