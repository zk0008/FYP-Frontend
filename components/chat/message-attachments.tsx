import { ExternalLink, FileText, Image as ImageIcon } from "lucide-react";

import { Attachment } from "@/types";
import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useFetchAttachmentUrl } from "@/hooks";

interface MessageAttachmentsProps {
  attachments: Attachment[];
  isOwnMessage: boolean;
}

export function MessageAttachments({ attachments, isOwnMessage }: MessageAttachmentsProps) {
  const { fetchAttachmentUrl } = useFetchAttachmentUrl();

  const handleAttachmentClick = async (attachmentId: string) => {
    const { attachmentUrl } = await fetchAttachmentUrl({ attachmentId });
    if (attachmentUrl) {
      window.open(attachmentUrl, "_blank");
    }
  }

  return (
    <div className={`
      py-1 space-y-1 rounded-lg
      ${isOwnMessage ? "bg-primary/50" : "bg-secondary/50"}
    `}>
      {attachments.map((attachment) => (
        <div
          key={attachment.attachmentId}
          className="flex items-center gap-2 px-1 rounded-lg"
        >
          {attachment.type === "IMAGE" ? (
            <ImageIcon className="w-5 h-5" />
          ) : (
            <FileText className="w-5 h-5" />
          )}

          {/* File info */}
          <TooltipWrapper content={ attachment.filename } side="top">
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium line-clamp-1">
                { attachment.filename }
              </p>
            </div>
          </TooltipWrapper>

          {/* Open attachment button */}
          <TooltipWrapper content="Open Attachment" side="top">
            <Button
              variant="ghost"
              size="icon"
              className={`
                ${isOwnMessage
                  ? "hover:bg-primary-foreground/20 text-primary-foreground hover:text-primary-foreground"
                  : "hover:bg-secondary-foreground/20 text-secondary-foreground hover:text-secondary-foreground"
                }
              `}
              onClick={(e) => {
                e.stopPropagation();
                handleAttachmentClick(attachment.attachmentId);
              }}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </TooltipWrapper>
        </div>
      ))}
    </div>
  );
}
