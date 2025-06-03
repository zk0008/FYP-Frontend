import { Chat } from "../types";
import { fetchWithAuth } from "@/utils";

export async function promptModel(promptData: Chat[]) {
  const response = await fetchWithAuth("/api/queries/gpt35", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(promptData),
  });

  return await response.json();
}

export async function promptPdf(topic: string, query: string) {
  const response = await fetchWithAuth("/api/queries/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, query }),
  });

  return await response.json();
}

export async function promptRag(topic: string, query: string) {
  const response = await fetchWithAuth("/api/queries/rag", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, query }),
  });

  return await response.json();
}

export async function promptAdvanced(
  chats: Chat[],
  topic: string,
  query: string
) {
  const response = await fetchWithAuth("/api/queries/advanced", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chats, topic, query }),
  });

  return await response.json();
}

export async function embedDocument(topic: string, query: string) {
  const response = await fetchWithAuth("/api/queries/embed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, query }),
  });

  return await response.json();
}
