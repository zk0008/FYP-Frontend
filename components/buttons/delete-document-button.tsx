import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useDeleteDocument, useToast } from "@/hooks";

interface DeleteFileButtonProps {
  documentId: string;
  filename: string;
  onDeleted: () => void;
}

export function DeleteDocumentButton({
  documentId,
  filename,
  onDeleted
}: DeleteFileButtonProps) {
  const { deleteDocument } = useDeleteDocument();
  const { toast } = useToast();

  const handleDelete = async () => {
    const { success, error } = await deleteDocument({ documentId, filename });

    if (success) {
      toast({
        title: "Document Deleted",
        description: `"${filename}" has been successfully deleted.`
      })
      onDeleted();
    } else if (error) {
      toast({
        title: "Error Deleting Document",
        description: error,
        variant: "destructive"
      });
    }
  };

  return (
    <TooltipWrapper content="Delete File">
      <Button
        variant="ghost"
        size="icon"
        onClick={ handleDelete }
      >
        <Trash className="h-4 w-4" />
      </Button>
    </TooltipWrapper>
  );
}
