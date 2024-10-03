from fastapi import FastAPI, Request
from api.models.pdf import get_pdf_answer
from api.models.gpt import get_answer, Chat


app = FastAPI()


@app.post("/api/gpt35")
def prompt(chats: list[Chat]):
    res = get_answer(chats)
    return res


@app.post("/api/pdf")
async def pdf_prompt(request: Request):
    body = await request.body()
    query = body.decode("utf-8")
    res = get_pdf_answer(query)
    return res
