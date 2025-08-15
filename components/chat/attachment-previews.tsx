// Each preview item for attachment
"use client";

import { useRef } from "react";
import { FileText, Image as ImageIcon, Plus, X } from "lucide-react";
import Image from "next/image";

import { AttachmentInput } from "@/types";
import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useChatInput, useToast } from "@/hooks";
import { MAX_ATTACHMENTS, MAX_FILE_SIZE_MB } from "@/utils/constants";

export function AttachmentPreviews() {
  const { attachments, setAttachments, isSubmitting } = useChatInput();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Ensure only max. 5 files are attached
    const remainingSlots = MAX_ATTACHMENTS - attachments.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast({
        title: "Too Many Attached Files",
        description: "Please remove some files before adding new ones.",
        variant: "destructive",
      });
    }

    // Ensure every attached file is less than MAX_FILE_SIZE_MB
    const validFiles: File[] = [];
    const invalidFileNames: string[] = [];

    filesToProcess.forEach(file => {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        invalidFileNames.push(file.name);
      } else {
        validFiles.push(file);
      }
    })

    if (invalidFileNames.length > 0) {
      toast({
        title: "File Size Limit Exceeded",
        description: `The following files exceed the ${MAX_FILE_SIZE_MB} MB limit: ${invalidFileNames.join(', ')}`,
        variant: "destructive",
      });
    }

    validFiles.forEach(file => {
      const attachmentId = crypto.randomUUID();
      const type = file.type.startsWith('image/') ? "IMAGE" : "DOCUMENT";

      const attachedFile: AttachmentInput = {
        attachmentId,
        type,
        filename: file.name,
        file
      };

      // Generate preview for images
      if (type === "IMAGE") {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachments(prev =>
            prev.map(f =>
              f.attachmentId === attachmentId
                ? { ...f, preview: e.target?.result as string }
                : f
            )
          );
        };
        reader.readAsDataURL(file);
      }

      setAttachments(prev => [...prev, attachedFile]);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachments = (attachmentId: string) => {
    setAttachments(prev => prev.filter(file => file.attachmentId !== attachmentId));
  };

  const triggerAttachmentUpload = () => {
    fileInputRef.current?.click();
  };

  const canAddMore = attachments.length < MAX_ATTACHMENTS;

  return (
    <div className="px-4 py-3 border-b border-border/50">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt"
          onChange={ handleAttachmentUpload }
          className="hidden"
        />
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-muted-foreground">
            {`Attached Files (${attachments.length}/${MAX_ATTACHMENTS})`}
          </span>
          <TooltipWrapper content="Attach File" side="top">
            <Button
              variant="ghost"
              onClick={ triggerAttachmentUpload }
              disabled={ isSubmitting || !canAddMore }
              className="h-8 w-8"
            >
              <Plus />
              <span className="sr-only">Attach File</span>
            </Button>
          </TooltipWrapper>
        </div>
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachments.map((a: AttachmentInput) => (
              <div
                key={ a.attachmentId }
                className="relative group bg-muted rounded-lg p-2 flex items-center gap-2 max-w-[200px]"
              >
                {a.type === "IMAGE" && a.preview ? (
                  <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={ a.preview }
                      alt={ a.file.name }
                      fill
                      className="object-cover"
                    />
                   </div>
                ) : (
                  <div className="w-12 h-12 rounded bg-background flex items-center justify-center flex-shrink-0">
                    {a.type === "IMAGE" ? (
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <FileText className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                )}

              { /* File size indicator */ }
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  { a.file.name }
                </p>
                <p className="text-xs text-muted-foreground">
                  { (a.file.size / 1024 / 1024).toFixed(1) } MB
                </p>
              </div>

              <TooltipWrapper content="Remove File" side="top">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => removeAttachments(a.attachmentId)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </TooltipWrapper>
            </div>
          ))}
        </div>
      )}
      </div>
  );
}
