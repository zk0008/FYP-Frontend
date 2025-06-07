import { useCallback, useRef } from "react";
import { LoaderCircle, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useUploadDocument } from "@/hooks";

export function UploadDocumentButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadDocument, uploadMultipleDocuments, isUploading } = useUploadDocument();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (files.length === 1) {
      uploadDocument(files[0]);
    } else {
      uploadMultipleDocuments(Array.from(files));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the input after selection
    }
  }, [uploadDocument, uploadMultipleDocuments]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="inline-block">
      <TooltipWrapper
        content="Upload Document"
        side="top"
      >
        <Button 
          variant="ghost" 
          size="icon"
          onClick={ handleButtonClick }
          disabled={ isUploading }
        >
          {isUploading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Paperclip />
          )}
          <span className="sr-only">Upload Document</span>
        </Button>
      </TooltipWrapper>
      
      <input
        ref={ fileInputRef }
        type="file"
        onChange={ handleFileSelect }
        className="hidden"
        multiple
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
      />
    </div>
  );
}
