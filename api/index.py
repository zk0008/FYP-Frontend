from fastapi import FastAPI, Request
from api.models.pdf import get_pdf_answer
from api.models.rag import get_rag_answer
from api.models.gpt import get_answer, Chat
from pydantic import BaseModel


app = FastAPI()


@app.post("/api/gpt35")
def prompt(chats: list[Chat]):
    res = get_answer(chats)
    return res


class PDFRequest(BaseModel):
    topic: str
    query: str


@app.post("/api/pdf")
async def pdf_prompt(request: PDFRequest):
    res = get_pdf_answer(request.topic, request.query)
    return res


class RAGRequest(BaseModel):
    query: str


@app.post("/api/rag")
async def pdf_prompt(request: RAGRequest):
    res = get_rag_answer(request.query)
    return res
