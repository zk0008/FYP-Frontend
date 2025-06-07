import { Download, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useDownloadDocument } from "@/hooks";

export function DownloadDocumentButton({ filename }: { filename: string }) {
  const { isDownloading, downloadDocument } = useDownloadDocument({ filename });

  const handleDownload = async () => {
    await downloadDocument();
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
