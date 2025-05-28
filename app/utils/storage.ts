import { createClient } from "@/utils/supabase/client";

export const supabase = createClient();

export async function sendToBucket(topic: string, file: File) {
  const { data, error } = await supabase.storage
    .from("chat-room-documents")
    .upload(`${topic}/${file.name}`, file);
  if (error) {
    console.log(error);
  } else {
  }
}

export async function getDocumentNames(topic: string) {
  const { data, error } = await supabase.storage
    .from("chat-room-documents")
    .list(topic);

  if (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
  const documentNames = data.map((file) => file.name);
  return documentNames;
}

export async function getDocument(topic: string, fileName: string) {
  const { data, error } = await supabase.storage
    .from("chat-room-documents")
    .download(`${topic}/${fileName}`);

  if (error) {
    console.error("Error downloading file:", error);
  } else {
    // Create a blob URL for the downloaded file
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName; // Set the file name for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up the link element
  }
}
