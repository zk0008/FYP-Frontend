"use client";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UploadButton } from "@/components/buttons";
import { UploadedDocumentsTable } from "@/components/tables/uploaded-documents-table";
import { useDocumentsWithRealtime } from "@/hooks";

import { BaseDialog } from "./base-dialog";

// Manage files / documents uploaded into the knowledge base
export function ManageDocumentsDialog({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { documents, refresh } = useDocumentsWithRealtime();

  return (
    <BaseDialog
      open={ open }
      onOpenChange={ onOpenChange }
      title="Manage Knowledge Base"
      description="Here you can manage GroupGPT's knowledge base for the chatroom."
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground">
          { documents.length } file{ documents.length !== 1 ? 's' : '' } uploaded
        </h3>
        <div className="space-x-2">
          <UploadButton />
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
      </div>

      <UploadedDocumentsTable documents={ documents } onDocumentDelete={ refresh } />
    </BaseDialog>
  );
}
