import { useDragAndDrop } from "@/hooks";

export function FileDropZone({
  children,
  className = "",
  showDropMessage = true
} : {
  children: React.ReactNode;
  className?: string;
  showDropMessage?: boolean;
}) {
  const {
    isDragging,
    handleDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave
  } = useDragAndDrop();
  
  return (
    <div
      onDrop={ handleDrop }
      onDragOver={ handleDragOver }
      onDragEnter={ handleDragEnter }
      onDragLeave={ handleDragLeave }
      className={`
        relative transition-all duration-200 ease-in-out
        ${isDragging ? 'border-2 border-dashed border-blue-400 rounded-lg z-10' : ''}
        ${className}
      `}
    >
      { children }

      {isDragging && showDropMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90">
          <div className="text-center">
            <div className="text-blue-600 font-medium">Drop files here</div>
            <div className="text-blue-500 text-sm mt-1">
              Release to upload to knowledge base
            </div>
          </div>
        </div>
      )}
    </div>
  )
}