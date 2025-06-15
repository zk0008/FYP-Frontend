import { useCallback, useState } from "react";

import { createClient } from "@/utils/supabase/client";
import { useChatroomContext, useToast } from "@/hooks";

const supabase = createClient();

export function useDownloadDocument({ filename }: { filename: string }) {
  const { chatroom } = useChatroomContext();
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadDocument = useCallback(async () => {
    if (!filename || !chatroom?.chatroomId) return;

    setIsDownloading(true);

    try {
      const { data, error } = await supabase.storage
        .from("uploaded-documents")
        .download(`${chatroom!.chatroomId}/${filename}`);

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No data received from download.");
      }

      // Create a blob URL and trigger download
      const blob = new Blob([data], { type: data.type || 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename; // Use the original filename
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error downloading document:", error);
      toast({
        title: "Error Downloading Document",
        description: error.message || "An unexpected error occurred while downloading the document.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  }, [filename, chatroom, toast]);

  return { isDownloading, downloadDocument };
}
