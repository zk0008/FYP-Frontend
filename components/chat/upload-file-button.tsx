import { useCallback, useRef } from "react";
import { LoaderCircle, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useUploadFile } from "@/hooks";

export function UploadFileButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploadMultipleFiles, isUploading } = useUploadFile();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (files.length === 1) {
      uploadFile(files[0]);
    } else {
      uploadMultipleFiles(Array.from(files));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the input after selection
    }
  }, [uploadFile, uploadMultipleFiles]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="inline-block">
      <TooltipWrapper
        content="Upload File"
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
          <span className="sr-only">Upload File</span>
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
