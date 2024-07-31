from fastapi import FastAPI, Request
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
from models.pdf import get_pdf_answer

load_dotenv()
OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")

app = FastAPI()
client = OpenAI(api_key=OPENAI_API_KEY)


class Chat(BaseModel):
    username: str
    message: str

    def __str__(self):
        return f"{self.username}: {self.message}"


@app.post("/api/gpt35")
def prompt(chats: list[Chat]):
    chat_strings = ", ".join(str(chat) for chat in chats)
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You are an assistant to university students in a group project, you are expected to act like an additional group member and have natural conversations with them. Your response to them should only be around 1 to 3 short sentences/phrases, and be in a conversational manner. You should read the conversation of students and try to match their energy. You can also address student names directly. You are to start each response with 'Hi team,' or 'Hi <Student Name>, ' ",
            },
            {
                "role": "user",
                "content": "The following is a conversation between students in a group discussion, with the following format <Student Name>: <Message>, Those with student name AI Chatbot are responses you have previously given"
                + chat_strings
                + ". Reply to the following messages and give meaningful insights to help the discussion, like you are group member.",
            },
        ],
    )
    message = completion.choices[0].message.content
    return message


@app.post("/api/pdf")
async def pdf_prompt(request: Request):
    body = await request.body()
    query = body.decode("utf-8")
    res = get_pdf_answer(query)
    return res
