import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useDeleteDocument, useToast } from "@/hooks";

interface DeleteDocumentButtonProps {
  documentId: string;
  filename: string;
  onDelete: () => void;
}

export function DeleteDocumentButton({ documentId, filename, onDelete }: DeleteDocumentButtonProps) {
  const { deleteDocument, isDeleting } = useDeleteDocument();
  const { toast } = useToast();

  const handleDelete = async () => {
    const { success, error } = await deleteDocument({ documentId });

    if (success) {
      toast({
        title: "Document Deleted",
        description: `'${filename}' has been successfully deleted.`
      });

      onDelete();  // Notify parent to refresh document list
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
        disabled={ isDeleting }
      >
        <Trash className="h-4 w-4 text-red-500" />
      </Button>
    </TooltipWrapper>
  );
}
