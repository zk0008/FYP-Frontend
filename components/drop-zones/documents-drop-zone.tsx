import { ReactNode } from "react";

import { useDropDocument } from "@/hooks";

import { DropZone } from "./drop-zone";

interface DocumentsDropZoneProps {
  children: ReactNode;
  className?: string;
}

export function DocumentsDropZone({ children, className = "" }: DocumentsDropZoneProps) {
  const {
    isDragging,
    handleFileDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave
  } = useDropDocument();

  return (
    <DropZone
      isDragging={ isDragging }
      onFileDrop={ handleFileDrop }
      onDragOver={ handleDragOver }
      onDragEnter={ handleDragEnter }
      onDragLeave={ handleDragLeave }
      className={ className }
      dropMessage={{
        title: "Drop files here",
        description: "Release to upload to knowledge base"
      }}
    >
      { children }
    </DropZone>
  );
}