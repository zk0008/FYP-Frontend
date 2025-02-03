import { Chat } from "../types";

export async function promptModel(promptData: Chat[]) {
  const data = await fetch("/api/queries/gpt35", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(promptData),
  });
  const res = await data.json();
  return res;
}

export async function promptPdf(topic: string, query: string) {
  const data = await fetch("/api/queries/pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic,
      query,
    }),
  });
  const res = await data.json();
  return res;
}

export async function promptRag(topic: string, query: string) {
  const data = await fetch("/api/queries/rag", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic,
      query,
    }),
  });
  const res = await data.json();
  return res;
}

export async function promptAdvanced(
  chats: Chat[],
  topic: string,
  query: string
) {
  const data = await fetch("/api/queries/advanced", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chats, topic, query }),
  });
  const res = await data.json();
  return res;
}

export async function embedDocument(topic: string, query: string) {
  const data = await fetch("/api/queries/embed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic,
      query,
    }),
  });
  const res = await data.json();
  return res;
}
