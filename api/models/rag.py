from PyPDF2 import PdfReader
from langchain.schema import Document
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from typing_extensions import Concatenate
from dotenv import load_dotenv
import os
from supabase import create_client, Client

load_dotenv()
url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)
embeddings = OpenAIEmbeddings()


def get_pdf_files_from_bucket(topic: str):
    # List files in the specified Supabase storage bucket
    data = supabase.storage.from_("chat-room-documents").list(path=topic)
    return [file["name"] for file in data]


def download_pdf(topic: str, file_name: str):
    # Download the PDF file from Supabase storage
    data = supabase.storage.from_("chat-room-documents").download(
        f"{topic}/{file_name}"
    )
    return data


def insert_embedding_into_supabase(text: str, embedding: list):
    # Insert the text and its corresponding embedding into Supabase
    supabase.table("document-vectors").insert(
        {"text": text, "embedding": embedding}
    ).execute()


def preprocess_documents(topic):
    pdf_files = get_pdf_files_from_bucket(topic)
    if len(pdf_files) == 0:
        return "No documents to query, please upload to get started"

    raw_text = ""
    for file_name in pdf_files:
        pdf_content = download_pdf(topic, file_name)
        with open(file_name, "wb") as f:
            f.write(pdf_content)

        pdfreader = PdfReader(file_name)
        for page in pdfreader.pages:
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

    # Insert each text chunk and its embedding into Supabase
    count = 0
    for text in texts:
        count += 1
        embedding = embeddings.embed_query(text)  # Create the embedding for the chunk
        insert_embedding_into_supabase(text, embedding)
        print("Embedding" + str(count))


def get_rag_answer(query: str):
    # Get the embedding for the query
    query_embedding = embeddings.embed_query(query)

    # Query the Supabase vector table for nearest neighbors
    response = supabase.rpc(
        "get_similar_embeddings", {"query_embedding": query_embedding}
    ).execute()

    # Extract the texts from the response
    similar_texts = [record["text"] for record in response.data]

    if not similar_texts:
        return "No relevant documents found."

    print(similar_texts)

    similar_docs = [Document(page_content=text) for text in similar_texts]

    # Use the similar texts for question answering
    chain = load_qa_chain(ChatOpenAI(model_name="gpt-3.5-turbo"), chain_type="stuff")
    return chain.run(input_documents=similar_docs, question=query)
