import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { Document } from "@/types";
import { DownloadDocumentButton, DeleteDocumentButton } from "@/components/buttons";

interface UploadedDocumentsTableProps {
  documents: Document[];
  maxHeight?: string;
}

// Table showing files / documents within the knowledge base
export function UploadedDocumentsTable({ documents, maxHeight = "200px" }: UploadedDocumentsTableProps) {
  return (
    <div className="border rounded-md">
      <div className="border-b">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2 cursor-default">File Name</TableHead>
              <TableHead className="w-1/4 cursor-default">Uploaded By</TableHead>
              <TableHead className="w-1/4 text-center cursor-default">Actions</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      <div 
        className="overflow-y-auto"
        style={{ maxHeight }}
      >
        <Table>
          <TableBody>
            {documents.length !== 0 ? (
              documents.map((doc, index) => (
                <TableRow key={ index }>
                  <TooltipWrapper content={ doc.filename }>
                    <TableCell className="w-1/2 max-w-0 truncate cursor-default">{ doc.filename }</TableCell>
                  </TooltipWrapper>

                  <TooltipWrapper content={ doc.username }>
                    <TableCell className="w-1/4 max-w-0 truncate cursor-default">{ doc.username }</TableCell>
                  </TooltipWrapper>

                  <TableCell className="w-1/4">
                    <div className="flex justify-center gap-1">
                      <DownloadDocumentButton
                        documentId={ doc.documentId }
                        filename={ doc.filename }
                      />
                      <DeleteDocumentButton
                        documentId={ doc.documentId }
                        filename={ doc.filename }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                  No documents uploaded yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

