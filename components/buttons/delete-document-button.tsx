import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useDeleteDocument, useToast } from "@/hooks";

interface DeleteDocumentButtonProps {
  documentId: string;
  filename: string;
}

export function DeleteDocumentButton({ documentId, filename }: DeleteDocumentButtonProps) {
  const { deleteDocument } = useDeleteDocument();
  const { toast } = useToast();

  const handleDelete = async () => {
    const { success, error } = await deleteDocument({ documentId });

    if (success) {
      toast({
        title: "Document Deleted",
        description: `'${filename}' has been successfully deleted.`
      });
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
        <Trash className="h-4 w-4 text-red-500" />
      </Button>
    </TooltipWrapper>
  );
}
