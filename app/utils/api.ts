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

export async function promptPdf(query: string) {
  const data = await fetch("/api/pdf", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: query,
  });
  const res = await data.json();
  return res;
}
