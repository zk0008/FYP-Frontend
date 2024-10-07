from fastapi import FastAPI, BackgroundTasks
from api.models.pdf import get_pdf_answer
from api.models.rag import get_rag_answer
from api.models.gpt import get_answer, Chat
from api.models.embed import embed_document
from pydantic import BaseModel


app = FastAPI()


class APIRequest(BaseModel):
    topic: str
    query: str


@app.post("/api/gpt35")
def prompt(chats: list[Chat]):
    res = get_answer(chats)
    return res


@app.post("/api/pdf")
async def pdf_prompt(request: APIRequest):
    res = get_pdf_answer(request.topic, request.query)
    return res


@app.post("/api/rag")
async def rag_prompt(request: APIRequest):
    res = get_rag_answer(request.topic, request.query)
    return res


@app.post("/api/embed")
async def embed(request: APIRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(embed_document, request.topic, request.query)
    return {"message": "Embedding process started."}
