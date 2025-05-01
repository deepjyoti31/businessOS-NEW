"""
Document processing service using Agno and Azure OpenAI.

This service handles document text extraction, classification, summarization,
entity extraction, and embedding generation for the BusinessOS application.
"""

import os
import sys
import json
import tempfile
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

# Import models
from app.models.documents import (
    DocumentProcessingResult,
    BatchProcessingResult,
    DocumentSearchResponse,
    DocumentSearchResult,
    Entity,
    Sentiment,
    FileMetadata
)

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")

# Debug information
print(f"Supabase URL: {supabase_url}")
print(f"Supabase Key: {supabase_key[:10]}...{supabase_key[-10:] if supabase_key else None}")

# Create Supabase client with proper error handling
try:
    supabase_client = supabase.create_client(supabase_url, supabase_key)
    print("Supabase client created successfully")
except Exception as e:
    print(f"Error creating Supabase client: {e}")
    raise

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
        f"Generate a concise summary (maximum {max_length} characters) of the following document: {text[:10000]}..."
    )
    return response.content[:max_length]


def extract_entities(text: str) -> Entity:
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

        return Entity(**json.loads(json_str))
    except Exception as e:
        print(f"Error parsing entity extraction response: {e}")
        return Entity(
            people=[],
            organizations=[],
            locations=[],
            dates=[],
            key_terms=[]
        )


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


def analyze_sentiment(text: str) -> Sentiment:
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

        return Sentiment(**json.loads(json_str))
    except Exception as e:
        print(f"Error parsing sentiment analysis response: {e}")
        return Sentiment(
            overall="neutral",
            score=0.0,
            confidence=0.0,
            key_phrases=[]
        )


def generate_embedding(text: str) -> List[float]:
    """Generate an embedding vector for the document text."""
    doc = Document(content=text)
    doc.embed(embedder)
    return doc.embedding


async def process_document(file_id: str) -> DocumentProcessingResult:
    """Process a document to extract text, generate summary, extract entities, classify topics, and generate embeddings."""
    try:
        print(f"Starting to process document with ID: {file_id}")

        # Update processing status
        try:
            update_response = supabase_client.table("files").update({"processing_status": "processing"}).eq("id", file_id).execute()
            print(f"Update status response: {update_response}")
        except Exception as e:
            print(f"Error updating processing status: {e}")
            raise

        # Get file metadata from Supabase
        try:
            response = supabase_client.table("files").select("*").eq("id", file_id).execute()
            print(f"File metadata response: {response}")
            if not response.data:
                raise ValueError(f"File with ID {file_id} not found")

            file_metadata = response.data[0]
            print(f"File metadata: {file_metadata}")
        except Exception as e:
            print(f"Error getting file metadata: {e}")
            raise

        file_path = file_metadata.get("path", "")
        file_type = file_metadata.get("type", "")

        # Download the file from Supabase Storage
        # Get file metadata
        file_url = file_metadata.get("metadata", {}).get("url", "")
        storage_path = file_metadata.get("storage_path", "")
        bucket_name = "documents"  # The bucket name in Supabase Storage
        file_name = file_metadata.get("name", "")

        print(f"File URL from metadata: {file_url}")
        print(f"Storage path from metadata: {storage_path}")
        print(f"File name: {file_name}")

        # Create a temporary file to store the downloaded content
        temp_file_path = None

        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_name.split('.')[-1] if '.' in file_name else 'tmp'}") as temp_file:
                temp_file_path = temp_file.name
                print(f"Created temporary file: {temp_file_path}")

                # Try downloading directly using the storage path
                if storage_path:
                    try:
                        print(f"Downloading file from storage path: {storage_path}")
                        response = supabase_client.storage.from_(bucket_name).download(storage_path)
                        temp_file.write(response)
                        print(f"Successfully downloaded file using storage path! Size: {len(response)} bytes")
                    except Exception as e:
                        print(f"Error downloading with storage path: {e}")

                        # If that fails, try using the URL
                        if file_url:
                            try:
                                print(f"Downloading file from URL: {file_url}")
                                import httpx

                                # Use httpx to download the file
                                with httpx.Client() as client:
                                    response = client.get(file_url)
                                    if response.status_code == 200:
                                        temp_file.write(response.content)
                                        print(f"Successfully downloaded file from URL! Size: {len(response.content)} bytes")
                                    else:
                                        error_message = f"Failed to download file from URL. Status code: {response.status_code}"
                                        print(error_message)
                                        raise Exception(error_message)
                            except Exception as e2:
                                print(f"Error downloading file from URL: {e2}")

                                # Try to find the file in the bucket
                                try:
                                    print("Listing files in the bucket to find the file...")
                                    files_response = supabase_client.storage.from_(bucket_name).list()
                                    print(f"Found {len(files_response)} items in the bucket")

                                    # Look for folders that might contain our file
                                    for folder in files_response:
                                        folder_name = folder.get("name")
                                        print(f"Checking folder: {folder_name}")

                                        try:
                                            # List files in this folder
                                            folder_files = supabase_client.storage.from_(bucket_name).list(folder_name)
                                            print(f"Found {len(folder_files)} files in folder {folder_name}")

                                            # Look for our file
                                            for folder_file in folder_files:
                                                folder_file_name = folder_file.get("name")
                                                print(f"Checking file: {folder_file_name}")

                                                if folder_file_name == file_name:
                                                    # Found our file!
                                                    file_path = f"{folder_name}/{folder_file_name}"
                                                    print(f"Found file at path: {file_path}")

                                                    try:
                                                        response = supabase_client.storage.from_(bucket_name).download(file_path)
                                                        temp_file.write(response)
                                                        print(f"Successfully downloaded file! Size: {len(response)} bytes")
                                                        break
                                                    except Exception as e4:
                                                        print(f"Error downloading found file: {e4}")
                                        except Exception as e3:
                                            print(f"Error listing files in folder {folder_name}: {e3}")
                                except Exception as e3:
                                    print(f"Error listing files in bucket: {e3}")
                                    raise Exception(f"Failed to find and download the file. Please check that the file exists in the bucket and your service key has the necessary permissions.")
                else:
                    # If no storage path, try to find the file in the bucket
                    try:
                        print("No storage path provided. Listing files in the bucket to find the file...")
                        files_response = supabase_client.storage.from_(bucket_name).list()
                        print(f"Found {len(files_response)} items in the bucket")

                        # Look for folders that might contain our file
                        for folder in files_response:
                            folder_name = folder.get("name")
                            print(f"Checking folder: {folder_name}")

                            try:
                                # List files in this folder
                                folder_files = supabase_client.storage.from_(bucket_name).list(folder_name)
                                print(f"Found {len(folder_files)} files in folder {folder_name}")

                                # Look for our file
                                for folder_file in folder_files:
                                    folder_file_name = folder_file.get("name")
                                    print(f"Checking file: {folder_file_name}")

                                    if folder_file_name == file_name:
                                        # Found our file!
                                        file_path = f"{folder_name}/{folder_file_name}"
                                        print(f"Found file at path: {file_path}")

                                        try:
                                            response = supabase_client.storage.from_(bucket_name).download(file_path)
                                            temp_file.write(response)
                                            print(f"Successfully downloaded file! Size: {len(response)} bytes")
                                            break
                                        except Exception as e4:
                                            print(f"Error downloading found file: {e4}")
                            except Exception as e3:
                                print(f"Error listing files in folder {folder_name}: {e3}")
                    except Exception as e3:
                        print(f"Error listing files in bucket: {e3}")
                        raise Exception(f"Failed to find and download the file. Please check that the file exists in the bucket and your service key has the necessary permissions.")

                # Verify the file was downloaded successfully
                if os.path.getsize(temp_file_path) == 0:
                    raise Exception("Downloaded file is empty")

                print(f"File downloaded successfully. Size: {os.path.getsize(temp_file_path)} bytes")
        except Exception as e:
            print(f"Error downloading file: {e}")
            if temp_file_path and os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
            raise Exception(f"Failed to download file: {e}. Please check that the file exists in Supabase Storage and that your service key has the necessary permissions.")

        # Now that we have the file, let's process it with Agno
        try:
            # Extract text from the document
            print(f"Extracting text from file: {temp_file_path}")
            text = extract_text_from_file(temp_file_path, file_metadata.get('type', ''))

            if not text:
                raise ValueError("Failed to extract text from document")

            print(f"Successfully extracted text. Length: {len(text)} characters")
            print(f"Text preview: {text[:200]}...")

            # Generate summary
            print("Generating summary...")
            summary = generate_summary(text)
            print(f"Summary: {summary}")

            # Extract entities
            print("Extracting entities...")
            entities = extract_entities(text)
            print(f"Entities: {entities}")

            # Classify topics
            print("Classifying topics...")
            topics = classify_topics(text)
            print(f"Topics: {topics}")

            # Analyze sentiment
            print("Analyzing sentiment...")
            sentiment = analyze_sentiment(text)
            print(f"Sentiment: {sentiment}")

            # Generate embedding
            print("Generating embedding...")
            embedding = generate_embedding(text)
            print(f"Embedding generated. Length: {len(embedding)}")

            # Update document metadata in Supabase
            print("Updating document metadata in Supabase...")
            update_response = supabase_client.table("files").update({
                "summary": summary,
                "entities": entities.model_dump_json(),
                "topics": json.dumps(topics),
                "sentiment": sentiment.model_dump_json(),
                "processed_at": datetime.now().isoformat(),
                "processing_status": "completed"
            }).eq("id", file_id).execute()
            print(f"Update response: {update_response}")

            # Store embedding in document_embeddings table
            print("Storing embedding in document_embeddings table...")
            embedding_response = supabase_client.table("document_embeddings").upsert({
                "id": file_id,
                "embedding": embedding,
                "created_at": datetime.now().isoformat()
            }).execute()
            print(f"Embedding storage response: {embedding_response}")

            return DocumentProcessingResult(
                success=True,
                file_id=file_id,
                summary=summary,
                entities=entities,
                topics=topics,
                sentiment=sentiment
            )
        except Exception as e:
            print(f"Error updating document metadata: {e}")
            raise
    except Exception as e:
        # Update processing status to failed
        supabase_client.table("files").update({
            "processing_status": "failed"
        }).eq("id", file_id).execute()

        print(f"Error processing document {file_id}: {e}")
        return DocumentProcessingResult(
            success=False,
            file_id=file_id,
            error=str(e)
        )


async def batch_process_documents(file_ids: List[str]) -> BatchProcessingResult:
    """Process multiple documents in batch."""
    results = {}
    success = True
    error = None

    try:
        # Process each document in the batch
        for file_id in file_ids:
            try:
                print(f"Processing document {file_id} in batch")
                result = await process_document(file_id)
                results[file_id] = result

                # If any document fails, mark the batch as failed but continue processing
                if not result.success:
                    success = False
            except Exception as e:
                print(f"Error processing document {file_id} in batch: {e}")
                results[file_id] = DocumentProcessingResult(
                    success=False,
                    file_id=file_id,
                    error=str(e)
                )
                success = False

        return BatchProcessingResult(
            success=success,
            results=results,
            error=None if success else "One or more documents failed to process"
        )
    except Exception as e:
        print(f"Error in batch_process_documents: {e}")
        return BatchProcessingResult(
            success=False,
            results=results,
            error=str(e)
        )


async def search_documents(query_text: str, match_threshold: float = 0.7, match_count: int = 10) -> DocumentSearchResponse:
    """Search for documents similar to the query text."""
    try:
        print(f"Searching for documents similar to: {query_text}")

        try:
            # Generate embedding for the query text
            print("Generating embedding for query text...")
            query_embedding = generate_embedding(query_text)
            print(f"Query embedding generated. Length: {len(query_embedding)}")

            # Check if the document_embeddings table exists and has the search_documents function
            try:
                # Search for similar documents using the vector search function
                print(f"Searching for similar documents with threshold {match_threshold} and limit {match_count}...")
                search_response = supabase_client.rpc(
                    "search_documents",
                    {
                        "query_embedding": query_embedding,
                        "match_threshold": match_threshold,
                        "match_count": match_count
                    }
                ).execute()

                print(f"Search response: {search_response}")

                if not search_response.data:
                    print("No matching documents found")
                    return DocumentSearchResponse(success=True, results=[])

                # Get file metadata for the matching documents
                file_ids = [item["id"] for item in search_response.data]
                print(f"Found {len(file_ids)} matching documents: {file_ids}")

                files_response = supabase_client.table("files").select("*").in_("id", file_ids).execute()

                if not files_response.data:
                    print("No file metadata found for matching documents")
                    return DocumentSearchResponse(success=True, results=[])

                # Combine similarity scores with file metadata
                results = []

                for file in files_response.data:
                    # Get similarity score from search results
                    similarity = next((item["similarity"] for item in search_response.data if item["id"] == file["id"]), 0)

                    try:
                        # Convert to our model format
                        file_metadata = FileMetadata(
                            id=file["id"],
                            name=file["name"],
                            path=file.get("path", ""),
                            size=file.get("size", 0),
                            type=file.get("type", ""),
                            is_folder=file.get("is_folder", False),
                            parent_id=file.get("parent_id"),
                            created_at=file["created_at"],
                            updated_at=file.get("updated_at"),
                            last_accessed_at=file.get("last_accessed_at"),
                            storage_path=file.get("storage_path", ""),
                            is_favorite=file.get("is_favorite", False),
                            is_archived=file.get("is_archived", False),
                            metadata=file.get("metadata"),
                            processing_status=file.get("processing_status"),
                            summary=file.get("summary"),
                            entities=Entity.model_validate_json(file["entities"]) if file.get("entities") else None,
                            topics=json.loads(file["topics"]) if file.get("topics") else None,
                            sentiment=Sentiment.model_validate_json(file["sentiment"]) if file.get("sentiment") else None,
                            processed_at=file.get("processed_at")
                        )

                        # Create search result with similarity score
                        search_result = DocumentSearchResult(
                            **file_metadata.model_dump(),
                            similarity=similarity
                        )

                        results.append(search_result)
                    except Exception as e:
                        print(f"Error processing file {file.get('id')}: {e}")

                # Sort by similarity (highest first)
                results.sort(key=lambda x: x.similarity, reverse=True)

                print(f"Returning {len(results)} search results")
                return DocumentSearchResponse(success=True, results=results)

            except Exception as e:
                print(f"Error with vector search: {e}")
                print("Falling back to keyword search...")
                # Fall back to keyword search if vector search fails
                raise

        except Exception as e:
            print(f"Falling back to keyword search due to error: {e}")

            # Get all files
            files_response = supabase_client.table("files").select("*").eq("is_archived", False).execute()

            if not files_response.data:
                return DocumentSearchResponse(success=True, results=[])

            # Filter files based on the query text
            query_terms = query_text.lower().split()
            results = []

            for file in files_response.data:
                # Calculate a simple relevance score based on how many terms match the filename
                file_name = file.get("name", "").lower()
                matches = sum(1 for term in query_terms if term in file_name)
                if matches > 0 or len(query_terms) == 0:
                    # Calculate similarity score (0.5-1.0 range)
                    similarity = 0.5 + (0.5 * matches / len(query_terms)) if len(query_terms) > 0 else 0.5

                    # Convert to our model format
                    try:
                        file_metadata = FileMetadata(
                            id=file["id"],
                            name=file["name"],
                            path=file.get("path", ""),
                            size=file.get("size", 0),
                            type=file.get("type", ""),
                            is_folder=file.get("is_folder", False),
                            parent_id=file.get("parent_id"),
                            created_at=file["created_at"],
                            updated_at=file.get("updated_at"),
                            last_accessed_at=file.get("last_accessed_at"),
                            storage_path=file.get("storage_path", ""),
                            is_favorite=file.get("is_favorite", False),
                            is_archived=file.get("is_archived", False),
                            metadata=file.get("metadata"),
                            processing_status=file.get("processing_status"),
                            summary=file.get("summary"),
                            entities=Entity.model_validate_json(file["entities"]) if file.get("entities") else None,
                            topics=json.loads(file["topics"]) if file.get("topics") else None,
                            sentiment=Sentiment.model_validate_json(file["sentiment"]) if file.get("sentiment") else None,
                            processed_at=file.get("processed_at")
                        )

                        # Create search result with similarity score
                        search_result = DocumentSearchResult(
                            **file_metadata.model_dump(),
                            similarity=similarity
                        )

                        results.append(search_result)
                    except Exception as e:
                        print(f"Error processing file {file.get('id')}: {e}")

            # Sort by similarity (highest first)
            results.sort(key=lambda x: x.similarity, reverse=True)

            # Limit to requested count
            results = results[:match_count]

            print(f"Returning {len(results)} keyword search results")
            return DocumentSearchResponse(success=True, results=results)

    except Exception as e:
        print(f"Error in search_documents: {e}")
        return DocumentSearchResponse(
            success=False,
            results=[],
            error=str(e)
        )
