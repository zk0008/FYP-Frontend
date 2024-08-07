from PyPDF2 import PdfReader
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from typing_extensions import Concatenate
from dotenv import load_dotenv
import os

load_dotenv()


def get_pdf_answer(query: str):
    pdfreader = PdfReader("C:/Users/Andrew/Documents/GitHub/fyp/api/models/ccds.pdf")

    # read text from pdf
    raw_text = ""
    for i, page in enumerate(pdfreader.pages):
        content = page.extract_text()
        if content:
            raw_text += content

    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=800,
        chunk_overlap=200,
        length_function=len,
    )
    texts = text_splitter.split_text(raw_text)

    embeddings = OpenAIEmbeddings()

    document_search = FAISS.from_texts(texts, embeddings)
    chain = load_qa_chain(ChatOpenAI(model_name="gpt-3.5-turbo"), chain_type="stuff")

    docs = document_search.similarity_search(query)
    return chain.run(input_documents=docs, question=query)
