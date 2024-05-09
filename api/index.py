from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI

app = FastAPI()
client = OpenAI(api_key="sk-proj-kak1pX2W2MBzYmLAeSS3T3BlbkFJ5ZHFHandKweL4aStaKa2")


class Chat(BaseModel):
    user: str
    message: str

    def __str__(self):
        return f"{self.user}: {self.message}"


@app.post("/api/test")
def prompt(chats: list[Chat]):
    chat_strings = ", ".join(str(chat) for chat in chats)
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You are an assistant to students in a group project, you are expected to act like an additional group member and have natural conversations with them.",
            },
            {
                "role": "user",
                "content": "The following is a conversation between students in a group discussion, with the following format <Student Name>: <Message>, Those with student name AI Chatbot are responses you have previously given"
                + chat_strings
                + ". Reply to the following messages and give meaningful insights, start the response with 'Hi team,' ",
            },
        ],
    )
    message = completion.choices[0].message.content
    return {"user": "AI Chatbot", "message": message}
