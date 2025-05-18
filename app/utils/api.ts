import { Chat } from "../types";
import { fetchWithAuth } from "@/app/_utils/utils";

export async function promptModel(promptData: Chat[]) {
  return fetchWithAuth("/api/queries/gpt35", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(promptData),
  });
}

export async function promptPdf(topic: string, query: string) {
  return fetchWithAuth("/api/queries/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, query }),
  });
}

export async function promptRag(topic: string, query: string) {
  return fetchWithAuth("/api/queries/rag", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, query }),
  });
}

export async function promptAdvanced(
  chats: Chat[],
  topic: string,
  query: string
) {
  return fetchWithAuth("/api/queries/advanced", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chats, topic, query }),
  });
}

export async function embedDocument(topic: string, query: string) {
  return fetchWithAuth("/api/queries/embed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, query }),
  });
}
