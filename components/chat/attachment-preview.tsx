"use client";

import { useRef } from "react";
import { FileText, Image as ImageIcon, Plus, X } from "lucide-react";
import Image from "next/image";

import { AttachmentInput } from "@/types";
import { Button } from "@/components/ui/button";
import { MAX_ATTACHMENTS } from "@/utils/constants";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useAttachmentManager, useToast } from "@/hooks";

interface AttachmentPreviewProps {
  attachments: AttachmentInput[];
  setAttachments: React.Dispatch<React.SetStateAction<AttachmentInput[]>>;
  isSending: boolean;
}

export function AttachmentPreview({
  attachments,
  setAttachments,
  isSending
}: AttachmentPreviewProps) {
  const { addAttachments, removeAttachment } = useAttachmentManager({ attachments, setAttachments });
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const { success, error } = addAttachments(fileArray);

    if (!success) {
      toast({
        title: "Error Adding Attachment",
        description: error,
        variant: "destructive",
      });
    }
  };

  const triggerAttachmentUpload = () => {
    fileInputRef.current?.click();
  };

  const canAddMore = attachments.length < MAX_ATTACHMENTS;

  return (
    <div className="px-4 py-3 border-b border-border/50">
        <input
          ref={ fileInputRef }
          type="file"
          multiple
          accept="image/*,.pdf,.txt"
          onChange={ handleAttachmentUpload }
          className="hidden"
        />
        <div className="flex items-center justify-between w-full">
          <span className="text-sm cursor-default">
            {`Attached Files (${attachments.length}/${MAX_ATTACHMENTS})`}
          </span>
          <TooltipWrapper content="Attach File" side="top">
            <Button
              variant="ghost"
              onClick={ triggerAttachmentUpload }
              disabled={ isSending || !canAddMore }
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
                {a.file.type.startsWith("image/") && a.preview ? (
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
                    {a.file.type.startsWith("image/") ? (
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
                  onClick={() => removeAttachment(a.attachmentId)}
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
