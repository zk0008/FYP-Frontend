import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Document } from "@/types";
import { DownloadDocumentButton, DeleteDocumentButton } from "@/components/buttons";

interface UploadedDocumentsTableProps {
  documents: Document[];
}

// Table showing files / documents within the knowledge base
export function UploadedDocumentsTable({ documents }: UploadedDocumentsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>File Name</TableHead>
          <TableHead>Uploaded By</TableHead>
          <TableHead className="text-center w-8">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.length !== 0 && documents.map((doc, index) => (
          <TableRow key={ index }>
            <TableCell>{ doc.filename }</TableCell>
            <TableCell>{ doc.username }</TableCell>
            <TableCell className="flex justify-end">
              <DownloadDocumentButton filename={ doc.filename } />
              <DeleteDocumentButton
                documentId={ doc.documentId }
                filename={ doc.filename }
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

