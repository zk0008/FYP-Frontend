import { Chat } from "../types";

export async function promptModel(promptData: Chat[]) {
  const data = await fetch("/api/gpt35", {
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
  const data = await fetch("/api/pdf", {
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
  const data = await fetch("/api/rag", {
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

export async function embedDocument(topic: string, query: string) {
  const data = await fetch("/api/embed", {
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
