import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useDeleteDocument } from "@/hooks";

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

  const handleDelete = async () => {
    await deleteDocument({ documentId, filename });
    onDeleted();
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
