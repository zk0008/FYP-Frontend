"use client";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UploadedDocumentsTable } from "@/components/tables/uploaded-documents-table";

import { BaseDialog } from "./base-dialog";
import { useUnifiedChatroomContext, useFetchDocuments } from "@/hooks";

export function ManageDocumentsDialog({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { currentChatroom } = useUnifiedChatroomContext();
    const { documents, refresh } = useFetchDocuments(currentChatroom?.chatroomId || "");

  return (
    <BaseDialog
      open={ open }
      onOpenChange={ onOpenChange }
      title="Manage Uploaded Documents"
      description="Here you can manage documents uploaded in the chatroom."
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground">
          { documents.length } file{ documents.length !== 1 ? 's' : '' } uploaded
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

      {documents.length !== 0 && <UploadedDocumentsTable
        documents={ documents }
        onDocumentDeleted={ refresh }
      />}
    </BaseDialog>
  );
}
