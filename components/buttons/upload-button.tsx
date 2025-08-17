import { useCallback, useRef } from "react";
import { LoaderCircle, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUploadDocument } from "@/hooks";

export function UploadButton() {
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
      fileInputRef.current.value = "";  // Clear the input after selection
    }
  }, [uploadDocument, uploadMultipleDocuments]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="inline-block">
      <Button 
        variant="outline" 
        size="sm"
        onClick={ handleClick }
        disabled={ isUploading }
      >
        { isUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" /> }
        Upload
      </Button>
      
      <input
        ref={ fileInputRef }
        type="file"
        onChange={ handleFileSelect }
        className="hidden"
        multiple
        accept=".pdf,.txt,.jpg,.jpeg,.png,.csv"
      />
    </div>
  );
}
