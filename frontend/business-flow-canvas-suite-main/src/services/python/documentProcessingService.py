"""
Document Processing Service using Agno and Azure OpenAI

This service handles document text extraction, classification, summarization,
entity extraction, and embedding generation for the BusinessOS application.
"""

import os
import sys
import json
import tempfile
import re
from datetime import datetime
from typing import Dict, List, Optional, Any

# Add Agno to the Python path
sys.path.append(os.path.abspath("./agno-main"))

# Import Agno components
from agno.agent import Agent
from agno.document import Document
from agno.document.reader.pdf_reader import PDFReader
from agno.document.reader.docx_reader import DocxReader
from agno.document.reader.text_reader import TextReader
from agno.document.reader.csv_reader import CSVReader
from agno.embedder.azure_openai import AzureOpenAIEmbedder
from agno.models.azure import AzureOpenAI

# Import Supabase client for database operations
import supabase

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
supabase_client = supabase.create_client(supabase_url, supabase_key)

# Initialize Azure OpenAI configuration
azure_openai_api_key = os.environ.get("AZURE_OPENAI_API_KEY")
azure_openai_endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
azure_openai_api_version = os.environ.get("AZURE_OPENAI_API_VERSION", "2024-10-21")
azure_openai_completion_model = os.environ.get("AZURE_OPENAI_COMPLETION_MODEL", "gpt-4o")
azure_openai_embedding_model = os.environ.get("AZURE_OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")

# Initialize Azure OpenAI embedder
embedder = AzureOpenAIEmbedder(
    id=azure_openai_embedding_model,
    api_key=azure_openai_api_key,
    azure_endpoint=azure_openai_endpoint,
    api_version=azure_openai_api_version
)

# Initialize document processing agent
document_agent = Agent(
    model=AzureOpenAI(
        id=azure_openai_completion_model,
        api_key=azure_openai_api_key,
        azure_endpoint=azure_openai_endpoint,
        api_version=azure_openai_api_version
    ),
    name="Document Processing Agent",
    description="Processes documents to extract text, summarize content, identify entities, and classify topics.",
    instructions=[
        "You are a document processing agent that analyzes documents and extracts valuable information.",
        "Extract key information from documents including entities, topics, and sentiment.",
        "Generate concise summaries that capture the main points of documents.",
        "Classify documents into relevant categories based on their content."
    ],
    markdown=True
)

def get_reader_for_file_type(file_type: str):
    """Get the appropriate document reader based on file type."""
    file_type = file_type.lower()
    if file_type.endswith('.pdf') or file_type == 'application/pdf':
        return PDFReader()
    elif file_type.endswith('.docx') or file_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return DocxReader()
    elif file_type.endswith('.csv') or file_type == 'text/csv':
        return CSVReader()
    elif file_type.endswith('.txt') or file_type == 'text/plain' or file_type.endswith('.md') or file_type == 'text/markdown':
        return TextReader()
    else:
        raise ValueError(f"Unsupported file type: {file_type}")

def extract_text_from_file(file_path: str, file_type: str) -> str:
    """Extract text from a document file."""
    reader = get_reader_for_file_type(file_type)
    documents = reader.read(file_path)
    if not documents:
        return ""
    return " ".join([doc.content for doc in documents])

def generate_summary(text: str, max_length: int = 500) -> str:
    """Generate a summary of the document text."""
    response = document_agent.run(
        f"Generate a concise summary (maximum {max_length} characters) of the following document. Do not include any markdown formatting or labels like 'Summary:' in your response: {text[:10000]}..."
    )
    # Clean up any remaining markdown or "Summary:" labels
    summary = response.content[:max_length]
    summary = re.sub(r'^\s*\*+\s*Summary:?\s*\*+\s*', '', summary, flags=re.IGNORECASE)
    summary = re.sub(r'^\s*Summary:?\s*', '', summary, flags=re.IGNORECASE)
    return summary

def extract_entities(text: str) -> Dict[str, List[str]]:
    """Extract entities from the document text."""
    prompt = """
    Extract the following entity types from the document text. Return the results as a JSON object with entity types as keys and lists of unique entities as values:
    - people: Names of individuals mentioned
    - organizations: Names of companies, institutions, or other organizations
    - locations: Geographic locations mentioned
    - dates: Any dates or time periods mentioned
    - key_terms: Important domain-specific terms or jargon

    Document text:
    {text}

    Format your response as valid JSON only, with no additional text.
    """

    response = document_agent.run(prompt.format(text=text[:10000]))
    try:
        # Extract JSON from the response
        content = response.content
        # Find JSON content between ```json and ``` if present
        if "```json" in content and "```" in content.split("```json", 1)[1]:
            json_str = content.split("```json", 1)[1].split("```", 1)[0].strip()
        elif "```" in content and "```" in content.split("```", 1)[1]:
            json_str = content.split("```", 1)[1].split("```", 1)[0].strip()
        else:
            json_str = content

        return json.loads(json_str)
    except Exception as e:
        print(f"Error parsing entity extraction response: {e}")
        return {
            "people": [],
            "organizations": [],
            "locations": [],
            "dates": [],
            "key_terms": []
        }

def classify_topics(text: str) -> Dict[str, float]:
    """Classify the document into topics with confidence scores."""
    prompt = """
    Classify the document into relevant topics. Return the results as a JSON object with topics as keys and confidence scores (0.0 to 1.0) as values.
    Include only topics with a confidence score of 0.5 or higher.

    Document text:
    {text}

    Format your response as valid JSON only, with no additional text.
    """

    response = document_agent.run(prompt.format(text=text[:10000]))
    try:
        # Extract JSON from the response
        content = response.content
        # Find JSON content between ```json and ``` if present
        if "```json" in content and "```" in content.split("```json", 1)[1]:
            json_str = content.split("```json", 1)[1].split("```", 1)[0].strip()
        elif "```" in content and "```" in content.split("```", 1)[1]:
            json_str = content.split("```", 1)[1].split("```", 1)[0].strip()
        else:
            json_str = content

        return json.loads(json_str)
    except Exception as e:
        print(f"Error parsing topic classification response: {e}")
        return {}

def analyze_sentiment(text: str) -> Dict[str, Any]:
    """Analyze the sentiment of the document."""
    prompt = """
    Analyze the sentiment of the document. Return the results as a JSON object with the following properties:
    - overall: Overall sentiment (positive, negative, or neutral)
    - score: Sentiment score from -1.0 (very negative) to 1.0 (very positive)
    - confidence: Confidence in the sentiment analysis from 0.0 to 1.0
    - key_phrases: List of key phrases that influenced the sentiment analysis

    Document text:
    {text}

    Format your response as valid JSON only, with no additional text.
    """

    response = document_agent.run(prompt.format(text=text[:10000]))
    try:
        # Extract JSON from the response
        content = response.content
        # Find JSON content between ```json and ``` if present
        if "```json" in content and "```" in content.split("```json", 1)[1]:
            json_str = content.split("```json", 1)[1].split("```", 1)[0].strip()
        elif "```" in content and "```" in content.split("```", 1)[1]:
            json_str = content.split("```", 1)[1].split("```", 1)[0].strip()
        else:
            json_str = content

        return json.loads(json_str)
    except Exception as e:
        print(f"Error parsing sentiment analysis response: {e}")
        return {
            "overall": "neutral",
            "score": 0.0,
            "confidence": 0.0,
            "key_phrases": []
        }

def generate_embedding(text: str) -> List[float]:
    """Generate an embedding vector for the document text."""
    doc = Document(content=text)
    doc.embed(embedder)
    return doc.embedding

def process_document(file_id: str, file_path: str, file_type: str) -> Dict[str, Any]:
    """Process a document to extract text, generate summary, extract entities, classify topics, and generate embeddings."""
    try:
        # Update processing status
        supabase_client.table("files").update({"processing_status": "processing"}).eq("id", file_id).execute()

        # Extract text from the document
        text = extract_text_from_file(file_path, file_type)
        if not text:
            raise ValueError("Failed to extract text from document")

        # Generate summary
        summary = generate_summary(text)

        # Extract entities
        entities = extract_entities(text)

        # Classify topics
        topics = classify_topics(text)

        # Analyze sentiment
        sentiment = analyze_sentiment(text)

        # Generate embedding
        embedding = generate_embedding(text)

        # Update document metadata in Supabase
        supabase_client.table("files").update({
            "summary": summary,
            "entities": json.dumps(entities),
            "topics": json.dumps(topics),
            "sentiment": json.dumps(sentiment),
            "processed_at": datetime.now().isoformat(),
            "processing_status": "completed"
        }).eq("id", file_id).execute()

        # Store embedding in document_embeddings table
        supabase_client.table("document_embeddings").upsert({
            "id": file_id,
            "embedding": embedding,
            "created_at": datetime.now().isoformat()
        }).execute()

        return {
            "success": True,
            "file_id": file_id,
            "summary": summary,
            "entities": entities,
            "topics": topics,
            "sentiment": sentiment
        }
    except Exception as e:
        # Update processing status to failed
        supabase_client.table("files").update({
            "processing_status": "failed"
        }).eq("id", file_id).execute()

        print(f"Error processing document {file_id}: {e}")
        return {
            "success": False,
            "file_id": file_id,
            "error": str(e)
        }

def process_document_from_storage(file_id: str) -> Dict[str, Any]:
    """Process a document that's already in Supabase Storage."""
    try:
        # Get file metadata from Supabase
        response = supabase_client.table("files").select("*").eq("id", file_id).execute()
        if not response.data:
            raise ValueError(f"File with ID {file_id} not found")

        file_metadata = response.data[0]
        file_path = file_metadata.get("path", "")
        file_type = file_metadata.get("type", "")

        # Download the file from Supabase Storage
        user_id = file_metadata.get("user_id", "")
        storage_path = f"{user_id}/{file_path}"

        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            response = supabase_client.storage.from_("documents").download(storage_path)
            temp_file.write(response)
            temp_file_path = temp_file.name

        try:
            # Process the document
            result = process_document(file_id, temp_file_path, file_type)
            return result
        finally:
            # Clean up the temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
    except Exception as e:
        print(f"Error processing document from storage {file_id}: {e}")
        # Update processing status to failed
        supabase_client.table("files").update({
            "processing_status": "failed"
        }).eq("id", file_id).execute()

        return {
            "success": False,
            "file_id": file_id,
            "error": str(e)
        }

def search_similar_documents(query_text: str, match_threshold: float = 0.7, match_count: int = 10) -> List[Dict[str, Any]]:
    """Search for documents similar to the query text."""
    try:
        # Generate embedding for the query text
        query_embedding = generate_embedding(query_text)

        # Search for similar documents using the search_documents function
        response = supabase_client.rpc(
            "search_documents",
            {
                "query_embedding": query_embedding,
                "match_threshold": match_threshold,
                "match_count": match_count
            }
        ).execute()

        if not response.data:
            return []

        # Get file metadata for the matching documents
        file_ids = [item["id"] for item in response.data]
        files_response = supabase_client.table("files").select("*").in_("id", file_ids).execute()

        if not files_response.data:
            return []

        # Combine similarity scores with file metadata
        result = []
        for file in files_response.data:
            similarity = next((item["similarity"] for item in response.data if item["id"] == file["id"]), 0)
            result.append({
                **file,
                "similarity": similarity
            })

        # Sort by similarity (highest first)
        result.sort(key=lambda x: x["similarity"], reverse=True)

        return result
    except Exception as e:
        print(f"Error searching similar documents: {e}")
        return []

# Main handler for API requests
def handle_request(request_data: Dict[str, Any]) -> Dict[str, Any]:
    """Handle API requests to the document processing service."""
    action = request_data.get("action")

    if action == "process_document":
        file_id = request_data.get("file_id")
        if not file_id:
            return {"success": False, "error": "Missing file_id parameter"}

        return process_document_from_storage(file_id)

    elif action == "search_documents":
        query_text = request_data.get("query_text")
        if not query_text:
            return {"success": False, "error": "Missing query_text parameter"}

        match_threshold = request_data.get("match_threshold", 0.7)
        match_count = request_data.get("match_count", 10)

        results = search_similar_documents(query_text, match_threshold, match_count)
        return {"success": True, "results": results}

    else:
        return {"success": False, "error": f"Unknown action: {action}"}

# If running as a script, parse command line arguments
if __name__ == "__main__":
    if len(sys.argv) > 1:
        request_json = sys.argv[1]
        try:
            request_data = json.loads(request_json)
            result = handle_request(request_data)
            print(json.dumps(result))
        except Exception as e:
            print(json.dumps({"success": False, "error": str(e)}))
    else:
        print(json.dumps({"success": False, "error": "No request data provided"}))
