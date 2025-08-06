import { Download, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useDownloadDocument, useToast } from "@/hooks";

export function DownloadDocumentButton({ filename }: { filename: string }) {
  const { isDownloading, downloadDocument } = useDownloadDocument({ filename });
  const { toast } = useToast();

  const handleDownload = async () => {
    const { success, error } = await downloadDocument();

    if (success) {
      toast({
        title: "Download Requested",
        description: `The download for '${filename}' has been requested. You should see a prompt to save the file shortly.`
      });
    } else if (error) {
      toast({
        title: "Error Downloading Document",
        description: error,
        variant: "destructive"
      });
    }
  }

  return (
    <TooltipWrapper content="Download File">
      <Button
        variant="ghost"
        size="icon"
        onClick={ handleDownload }
        disabled={ isDownloading }
      >
        {isDownloading ? <LoaderCircle className="animate-spin h-4 w-4" /> : <Download className="h-4 w-4" />}
      </Button>
    </TooltipWrapper>
  );
}
