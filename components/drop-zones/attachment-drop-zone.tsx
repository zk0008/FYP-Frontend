import { ReactNode } from "react";

import { AttachmentInput } from "@/types";
import { useDropAttachment } from "@/hooks";

import { DropZone } from "./drop-zone";

interface AttachmentDropZoneProps {
  children: ReactNode;
  className?: string;
  attachments: AttachmentInput[];
  setAttachments: React.Dispatch<React.SetStateAction<AttachmentInput[]>>;
}

export function AttachmentDropZone({
  children,
  className,
  attachments,
  setAttachments
}: AttachmentDropZoneProps) {
  const {
    isDragging,
    handleFileDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave
  } = useDropAttachment({ attachments, setAttachments });

  return (
    <DropZone
      className={ className }
      isDragging={ isDragging }
      onFileDrop={ handleFileDrop }
      onDragOver={ handleDragOver }
      onDragEnter={ handleDragEnter }
      onDragLeave={ handleDragLeave }
      dropMessage={{
        title: "Drop files here",
        description: "Release to attach to current message"
      }}
    >
      { children }
    </DropZone>
  );
}
