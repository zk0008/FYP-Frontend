import { ReactNode } from "react";

interface DropZoneProps {
  children: ReactNode;
  className?: string;
  onFileDrop: (files: File[]) => void;
  isDragging: boolean;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  dropMessage?: {
    title: string;
    description: string;
  };
  showDropMessage?: boolean;
}

export function DropZone({
  children,
  className = "",
  onFileDrop,
  isDragging,
  onDragOver,
  onDragEnter,
  onDragLeave,
  dropMessage = { title: "Drop files here", description: "Release to upload" },
  showDropMessage = true
}: DropZoneProps) {
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    onFileDrop(files);
  };

  return (
    <div
      onDrop={ handleDrop }
      onDragOver={ onDragOver }
      onDragEnter={ onDragEnter }
      onDragLeave={ onDragLeave }
      className={`relative transition-all duration-200 ease-in-out border-2 border-dashed ${isDragging ? "border-blue-400 rounded-lg z-10" : "border-transparent"} ${className}`}
    >
      {children}

      {isDragging && showDropMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90">
          <div className="text-center">
            <div className="text-blue-600 font-medium">{ dropMessage.title }</div>
            <div className="text-blue-500 text-sm mt-1">{ dropMessage.description }</div>
          </div>
        </div>
      )}
    </div>
  );
}
