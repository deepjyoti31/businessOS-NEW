"""
Document processing service using Agno and Azure OpenAI.

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

# Import models
from app.models.documents import (
    DocumentProcessingResult,
    BatchProcessingResult,
    DocumentSearchResponse,
    DocumentSearchResult,
    DocumentComparisonRequest,
    DocumentComparisonResult,
    DocumentSimilarity,
    DocumentDifference,
    ComparisonSection,
    ContentGenerationRequest,
    ContentGenerationResult,
    DocumentTemplate,
    TemplateField,
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
        f"Generate a concise summary (maximum {max_length} characters) of the following document. Do not include any markdown formatting or labels like 'Summary:' in your response: {text[:10000]}..."
    )
    # Clean up any remaining markdown or "Summary:" labels
    summary = response.content[:max_length]
    summary = re.sub(r'^\s*\*+\s*Summary:?\s*\*+\s*', '', summary, flags=re.IGNORECASE)
    summary = re.sub(r'^\s*Summary:?\s*', '', summary, flags=re.IGNORECASE)
    return summary


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


async def search_documents(query_text: str, match_threshold: float = 0.5, match_count: int = 10) -> DocumentSearchResponse:
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
                    print(f"No matching documents found with threshold {match_threshold}")

                    # If no results with the initial threshold, try with a lower threshold
                    if match_threshold > 0.3:
                        lower_threshold = max(0.3, match_threshold - 0.2)
                        print(f"Trying again with lower threshold: {lower_threshold}")

                        search_response = supabase_client.rpc(
                            "search_documents",
                            {
                                "query_embedding": query_embedding,
                                "match_threshold": lower_threshold,
                                "match_count": match_count
                            }
                        ).execute()

                        print(f"Search response with lower threshold: {search_response}")

                        if not search_response.data:
                            print(f"Still no matching documents found with lower threshold {lower_threshold}")
                            return DocumentSearchResponse(success=True, results=[])
                    else:
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
                        # Ensure dates are properly formatted
                        created_at = file.get("created_at")
                        updated_at = file.get("updated_at")
                        last_accessed_at = file.get("last_accessed_at")
                        processed_at = file.get("processed_at")

                        # Convert to datetime objects if they're strings
                        if isinstance(created_at, str):
                            try:
                                created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                            except (ValueError, TypeError):
                                created_at = None

                        if isinstance(updated_at, str):
                            try:
                                updated_at = datetime.fromisoformat(updated_at.replace('Z', '+00:00'))
                            except (ValueError, TypeError):
                                updated_at = None

                        if isinstance(last_accessed_at, str):
                            try:
                                last_accessed_at = datetime.fromisoformat(last_accessed_at.replace('Z', '+00:00'))
                            except (ValueError, TypeError):
                                last_accessed_at = None

                        if isinstance(processed_at, str):
                            try:
                                processed_at = datetime.fromisoformat(processed_at.replace('Z', '+00:00'))
                            except (ValueError, TypeError):
                                processed_at = None

                        file_metadata = FileMetadata(
                            id=file["id"],
                            name=file["name"],
                            path=file.get("path", ""),
                            size=file.get("size", 0),
                            type=file.get("type", ""),
                            is_folder=file.get("is_folder", False),
                            parent_id=file.get("parent_id"),
                            created_at=created_at,
                            updated_at=updated_at,
                            last_accessed_at=last_accessed_at,
                            storage_path=file.get("storage_path", ""),
                            is_favorite=file.get("is_favorite", False),
                            is_archived=file.get("is_archived", False),
                            metadata=file.get("metadata"),
                            processing_status=file.get("processing_status"),
                            summary=file.get("summary"),
                            entities=Entity.model_validate_json(file["entities"]) if file.get("entities") else None,
                            topics=json.loads(file["topics"]) if file.get("topics") else None,
                            sentiment=Sentiment.model_validate_json(file["sentiment"]) if file.get("sentiment") else None,
                            processed_at=processed_at
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
                        # Ensure dates are properly formatted
                        created_at = file.get("created_at")
                        updated_at = file.get("updated_at")
                        last_accessed_at = file.get("last_accessed_at")
                        processed_at = file.get("processed_at")

                        # Convert to datetime objects if they're strings
                        if isinstance(created_at, str):
                            try:
                                created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                            except (ValueError, TypeError):
                                created_at = None

                        if isinstance(updated_at, str):
                            try:
                                updated_at = datetime.fromisoformat(updated_at.replace('Z', '+00:00'))
                            except (ValueError, TypeError):
                                updated_at = None

                        if isinstance(last_accessed_at, str):
                            try:
                                last_accessed_at = datetime.fromisoformat(last_accessed_at.replace('Z', '+00:00'))
                            except (ValueError, TypeError):
                                last_accessed_at = None

                        if isinstance(processed_at, str):
                            try:
                                processed_at = datetime.fromisoformat(processed_at.replace('Z', '+00:00'))
                            except (ValueError, TypeError):
                                processed_at = None

                        file_metadata = FileMetadata(
                            id=file["id"],
                            name=file["name"],
                            path=file.get("path", ""),
                            size=file.get("size", 0),
                            type=file.get("type", ""),
                            is_folder=file.get("is_folder", False),
                            parent_id=file.get("parent_id"),
                            created_at=created_at,
                            updated_at=updated_at,
                            last_accessed_at=last_accessed_at,
                            storage_path=file.get("storage_path", ""),
                            is_favorite=file.get("is_favorite", False),
                            is_archived=file.get("is_archived", False),
                            metadata=file.get("metadata"),
                            processing_status=file.get("processing_status"),
                            summary=file.get("summary"),
                            entities=Entity.model_validate_json(file["entities"]) if file.get("entities") else None,
                            topics=json.loads(file["topics"]) if file.get("topics") else None,
                            sentiment=Sentiment.model_validate_json(file["sentiment"]) if file.get("sentiment") else None,
                            processed_at=processed_at
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


async def compare_documents(file_id_1: str, file_id_2: str) -> DocumentComparisonResult:
    """Compare two documents semantically and analyze their similarities and differences."""
    try:
        print(f"Starting document comparison between {file_id_1} and {file_id_2}")

        # Get file metadata for both documents
        try:
            response_1 = supabase_client.table("files").select("*").eq("id", file_id_1).execute()
            response_2 = supabase_client.table("files").select("*").eq("id", file_id_2).execute()

            if not response_1.data:
                raise ValueError(f"File with ID {file_id_1} not found")
            if not response_2.data:
                raise ValueError(f"File with ID {file_id_2} not found")

            file_metadata_1 = response_1.data[0]
            file_metadata_2 = response_2.data[0]

            file_name_1 = file_metadata_1.get("name", "Document 1")
            file_name_2 = file_metadata_2.get("name", "Document 2")

            print(f"Comparing '{file_name_1}' with '{file_name_2}'")
        except Exception as e:
            print(f"Error getting file metadata: {e}")
            raise

        # Get document text and embeddings
        try:
            # Check if documents have been processed
            if file_metadata_1.get("processing_status") != "completed":
                print(f"Document {file_id_1} has not been processed yet. Processing now...")
                await process_document(file_id_1)
                # Refresh metadata
                response_1 = supabase_client.table("files").select("*").eq("id", file_id_1).execute()
                file_metadata_1 = response_1.data[0]

            if file_metadata_2.get("processing_status") != "completed":
                print(f"Document {file_id_2} has not been processed yet. Processing now...")
                await process_document(file_id_2)
                # Refresh metadata
                response_2 = supabase_client.table("files").select("*").eq("id", file_id_2).execute()
                file_metadata_2 = response_2.data[0]

            # Get summaries
            summary_1 = file_metadata_1.get("summary", "")
            summary_2 = file_metadata_2.get("summary", "")

            # Get topics
            topics_1 = json.loads(file_metadata_1.get("topics", "{}")) if file_metadata_1.get("topics") else {}
            topics_2 = json.loads(file_metadata_2.get("topics", "{}")) if file_metadata_2.get("topics") else {}

            # Get embeddings
            embedding_response_1 = supabase_client.table("document_embeddings").select("embedding").eq("id", file_id_1).execute()
            embedding_response_2 = supabase_client.table("document_embeddings").select("embedding").eq("id", file_id_2).execute()

            if not embedding_response_1.data or not embedding_response_2.data:
                raise ValueError("Embeddings not found for one or both documents")

            embedding_1 = embedding_response_1.data[0].get("embedding", [])
            embedding_2 = embedding_response_2.data[0].get("embedding", [])

            # Calculate cosine similarity between embeddings
            try:
                import numpy as np
                from sklearn.metrics.pairwise import cosine_similarity

                # Convert embeddings to numpy arrays of floats
                embedding_1_array = np.array(embedding_1, dtype=float).reshape(1, -1)
                embedding_2_array = np.array(embedding_2, dtype=float).reshape(1, -1)

                similarity_score = float(cosine_similarity(embedding_1_array, embedding_2_array)[0][0])
            except ImportError:
                # Fallback to a simple dot product similarity if numpy/sklearn is not available
                print("Warning: numpy or sklearn not available, using fallback similarity calculation")

                try:
                    # Print debug info about embeddings
                    print(f"Embedding 1 type: {type(embedding_1)}, length: {len(embedding_1)}")
                    print(f"Embedding 2 type: {type(embedding_2)}, length: {len(embedding_2)}")
                    if embedding_1 and isinstance(embedding_1, list):
                        print(f"First element type: {type(embedding_1[0])}")

                    # Convert embeddings to float values
                    embedding_1_float = []
                    embedding_2_float = []

                    # Convert first embedding to float
                    for val in embedding_1:
                        if isinstance(val, str):
                            embedding_1_float.append(float(val))
                        else:
                            embedding_1_float.append(float(val))

                    # Convert second embedding to float
                    for val in embedding_2:
                        if isinstance(val, str):
                            embedding_2_float.append(float(val))
                        else:
                            embedding_2_float.append(float(val))

                    # Simple dot product similarity with type checking
                    def dot_product(v1, v2):
                        if len(v1) != len(v2):
                            print(f"Warning: vectors have different lengths: {len(v1)} vs {len(v2)}")
                            # Use the shorter length
                            min_len = min(len(v1), len(v2))
                            return sum(float(v1[i]) * float(v2[i]) for i in range(min_len))
                        return sum(float(v1[i]) * float(v2[i]) for i in range(len(v1)))

                    # Simple magnitude calculation with type checking
                    def magnitude(v):
                        return sum(float(x) * float(x) for x in v) ** 0.5

                    # Simple cosine similarity
                    dot_prod = dot_product(embedding_1_float, embedding_2_float)
                    mag1 = magnitude(embedding_1_float)
                    mag2 = magnitude(embedding_2_float)

                    print(f"Dot product: {dot_prod}, Magnitude 1: {mag1}, Magnitude 2: {mag2}")

                    if mag1 > 0 and mag2 > 0:
                        similarity_score = dot_prod / (mag1 * mag2)
                    else:
                        similarity_score = 0.0

                except Exception as e:
                    print(f"Error in fallback similarity calculation: {e}")
                    # Default to a neutral similarity score
                    similarity_score = 0.5
            print(f"Embedding similarity score: {similarity_score}")

        except Exception as e:
            print(f"Error getting document data: {e}")
            raise

        # Use Agno agent to perform detailed comparison
        comparison_agent = Agent(
            model=AzureOpenAI(
                id=azure_openai_completion_model,
                api_key=azure_openai_api_key,
                azure_endpoint=azure_openai_endpoint,
                api_version=azure_openai_api_version
            ),
            name="Document Comparison Agent",
            description="Compares two documents and analyzes their similarities and differences.",
            instructions=[
                "You are a document comparison agent that analyzes the similarities and differences between two documents.",
                "Identify key similarities and differences in content, structure, and topics.",
                "Provide a detailed comparison that highlights important aspects of both documents."
            ],
            markdown=True
        )

        # Prepare comparison prompt
        comparison_prompt = f"""
        Compare the following two documents and analyze their similarities and differences.

        DOCUMENT 1: {file_name_1}
        Summary: {summary_1}
        Topics: {', '.join(topics_1.keys())}

        DOCUMENT 2: {file_name_2}
        Summary: {summary_2}
        Topics: {', '.join(topics_2.keys())}

        Provide your analysis in the following JSON format:
        ```json
        {{
            "summary": "A concise summary of the comparison between the two documents",
            "similarities": {{
                "overall_similarity": 0.75,
                "content_similarity": 0.8,
                "structure_similarity": 0.7,
                "topic_similarity": 0.9
            }},
            "differences": {{
                "unique_to_first": ["Point 1", "Point 2"],
                "unique_to_second": ["Point 1", "Point 2"],
                "contradictions": ["Contradiction 1", "Contradiction 2"]
            }},
            "common_topics": ["Topic 1", "Topic 2"],
            "sections": [
                {{
                    "title": "Key Similarities",
                    "content": "Detailed analysis of the key similarities between the documents"
                }},
                {{
                    "title": "Notable Differences",
                    "content": "Detailed analysis of the notable differences between the documents"
                }},
                {{
                    "title": "Content Analysis",
                    "content": "Analysis of the content of both documents"
                }},
                {{
                    "title": "Structure Comparison",
                    "content": "Comparison of the structure of both documents"
                }}
            ]
        }}
        ```

        Use the embedding similarity score of {similarity_score} as a reference, but provide your own detailed analysis.
        """

        # Get comparison analysis
        response = comparison_agent.run(comparison_prompt)

        try:
            # Extract JSON from the response
            content = response.content

            # Print debug info
            print(f"Response content type: {type(content)}")
            print(f"Response content length: {len(content) if content else 0}")

            # Find JSON content between ```json and ``` if present
            if "```json" in content and "```" in content.split("```json", 1)[1]:
                json_str = content.split("```json", 1)[1].split("```", 1)[0].strip()
                print("Extracted JSON from ```json``` block")
            elif "```" in content and "```" in content.split("```", 1)[1]:
                json_str = content.split("```", 1)[1].split("```", 1)[0].strip()
                print("Extracted JSON from ``` block")
            else:
                json_str = content
                print("Using full content as JSON")

            # Print the JSON string for debugging
            print(f"JSON string length: {len(json_str) if json_str else 0}")
            if json_str and len(json_str) < 500:  # Only print if not too long
                print(f"JSON string: {json_str}")

            try:
                comparison_data = json.loads(json_str)
                print("Successfully parsed JSON data")
            except json.JSONDecodeError as json_err:
                print(f"JSON parsing error: {json_err}")
                # Create a basic structure if JSON parsing fails
                comparison_data = {
                    "summary": f"Comparison between {file_name_1} and {file_name_2}. (JSON parsing failed)",
                    "similarities": {
                        "overall_similarity": similarity_score,
                        "content_similarity": similarity_score,
                        "structure_similarity": similarity_score,
                        "topic_similarity": similarity_score
                    },
                    "differences": {
                        "unique_to_first": [],
                        "unique_to_second": [],
                        "contradictions": []
                    },
                    "common_topics": [],
                    "sections": [
                        {
                            "title": "Similarity Analysis",
                            "content": f"The documents have a similarity score of {similarity_score:.2f} based on their content embeddings."
                        },
                        {
                            "title": "Processing Note",
                            "content": "Detailed analysis could not be generated due to a processing error."
                        }
                    ]
                }

            # Create comparison result with proper error handling for each field
            result = DocumentComparisonResult(
                success=True,
                file_id_1=file_id_1,
                file_id_2=file_id_2,
                file_name_1=file_name_1,
                file_name_2=file_name_2,
                summary=comparison_data.get("summary", f"Comparison between {file_name_1} and {file_name_2}"),
                similarities=DocumentSimilarity(
                    overall_similarity=float(comparison_data.get("similarities", {}).get("overall_similarity", similarity_score)),
                    content_similarity=float(comparison_data.get("similarities", {}).get("content_similarity", similarity_score)),
                    structure_similarity=float(comparison_data.get("similarities", {}).get("structure_similarity", similarity_score)),
                    topic_similarity=float(comparison_data.get("similarities", {}).get("topic_similarity", similarity_score))
                ),
                differences=DocumentDifference(
                    unique_to_first=comparison_data.get("differences", {}).get("unique_to_first", []),
                    unique_to_second=comparison_data.get("differences", {}).get("unique_to_second", []),
                    contradictions=comparison_data.get("differences", {}).get("contradictions", [])
                ),
                common_topics=comparison_data.get("common_topics", []),
                sections=[
                    ComparisonSection(
                        title=str(section.get("title", "")),
                        content=str(section.get("content", ""))
                    )
                    for section in comparison_data.get("sections", [])
                ]
            )

            return result

        except Exception as e:
            print(f"Error parsing comparison analysis: {e}")

            # Fallback to a simpler comparison result
            common_topics = []
            try:
                # Try to get common topics, but handle potential errors
                common_topics = list(set(topics_1.keys()).intersection(set(topics_2.keys())))
            except Exception as topic_err:
                print(f"Error getting common topics: {topic_err}")

            # Create a basic fallback result
            return DocumentComparisonResult(
                success=True,
                file_id_1=file_id_1,
                file_id_2=file_id_2,
                file_name_1=file_name_1,
                file_name_2=file_name_2,
                summary=f"Comparison between {file_name_1} and {file_name_2}",
                similarities=DocumentSimilarity(
                    overall_similarity=float(similarity_score),
                    content_similarity=float(similarity_score),
                    structure_similarity=float(similarity_score),
                    topic_similarity=float(similarity_score)
                ),
                differences=DocumentDifference(
                    unique_to_first=[],
                    unique_to_second=[],
                    contradictions=[]
                ),
                common_topics=common_topics,
                sections=[
                    ComparisonSection(
                        title="Similarity Analysis",
                        content=f"The documents have a similarity score of {similarity_score:.2f} based on their content embeddings."
                    ),
                    ComparisonSection(
                        title="Basic Comparison",
                        content=f"This is a basic comparison between {file_name_1} and {file_name_2}. A detailed analysis could not be generated."
                    )
                ]
            )

    except Exception as e:
        print(f"Error in compare_documents: {e}")

        # Ensure we have valid file names
        safe_file_name_1 = file_name_1 or "Document 1"
        safe_file_name_2 = file_name_2 or "Document 2"

        # Return a valid result even in case of error
        return DocumentComparisonResult(
            success=False,
            file_id_1=file_id_1,
            file_id_2=file_id_2,
            file_name_1=safe_file_name_1,
            file_name_2=safe_file_name_2,
            summary=f"Comparison between {safe_file_name_1} and {safe_file_name_2} could not be completed.",
            similarities=DocumentSimilarity(
                overall_similarity=0.0,
                content_similarity=0.0,
                structure_similarity=0.0,
                topic_similarity=0.0
            ),
            differences=DocumentDifference(
                unique_to_first=[],
                unique_to_second=[],
                contradictions=[]
            ),
            common_topics=[],
            sections=[
                ComparisonSection(
                    title="Error Information",
                    content=f"The document comparison failed with the following error: {str(e)}"
                ),
                ComparisonSection(
                    title="Troubleshooting",
                    content="Please try again with different documents or contact support if the issue persists."
                )
            ],
            error=f"Comparison failed: {str(e)}"
        )


async def get_templates(category: Optional[str] = None, user_id: Optional[str] = None) -> List[DocumentTemplate]:
    """Get document templates."""
    try:
        print(f"Getting templates for category: {category}, user_id: {user_id}")

        # Query templates from the database
        query = supabase_client.table("document_templates").select("*")

        # Filter by category if provided
        if category:
            query = query.eq("category", category)

        # Filter by user_id or public templates
        if user_id:
            query = query.or_(f"created_by.eq.{user_id},is_public.eq.true")
        else:
            query = query.eq("is_public", True)

        # Execute the query
        response = query.execute()

        if not response.data:
            print("No templates found")
            return []

        # Convert to DocumentTemplate objects
        templates = []
        for item in response.data:
            try:
                # Parse fields from JSON string if needed
                fields = item.get("fields", [])
                if isinstance(fields, str):
                    fields = json.loads(fields)

                # Parse tags from JSON string if needed
                tags = item.get("tags", [])
                if isinstance(tags, str):
                    tags = json.loads(tags)

                template = DocumentTemplate(
                    id=item.get("id"),
                    name=item.get("name"),
                    description=item.get("description"),
                    category=item.get("category"),
                    format=item.get("format", "docx"),
                    content=item.get("content", ""),
                    fields=fields,
                    created_by=item.get("created_by"),
                    created_at=item.get("created_at"),
                    updated_at=item.get("updated_at"),
                    is_public=item.get("is_public", False),
                    tags=tags
                )
                templates.append(template)
            except Exception as e:
                print(f"Error parsing template: {e}")
                continue

        return templates

    except Exception as e:
        print(f"Error in get_templates: {e}")
        return []


async def get_template_by_id(template_id: str) -> Optional[DocumentTemplate]:
    """Get a document template by ID."""
    try:
        print(f"Getting template with ID: {template_id}")

        # Query the template from the database
        response = supabase_client.table("document_templates").select("*").eq("id", template_id).execute()

        if not response.data:
            print(f"Template with ID {template_id} not found")
            return None

        item = response.data[0]

        # Parse fields from JSON string if needed
        fields = item.get("fields", [])
        if isinstance(fields, str):
            fields = json.loads(fields)

        # Parse tags from JSON string if needed
        tags = item.get("tags", [])
        if isinstance(tags, str):
            tags = json.loads(tags)

        template = DocumentTemplate(
            id=item.get("id"),
            name=item.get("name"),
            description=item.get("description"),
            category=item.get("category"),
            format=item.get("format", "docx"),
            content=item.get("content", ""),
            fields=fields,
            created_by=item.get("created_by"),
            created_at=item.get("created_at"),
            updated_at=item.get("updated_at"),
            is_public=item.get("is_public", False),
            tags=tags
        )

        return template

    except Exception as e:
        print(f"Error in get_template_by_id: {e}")
        return None


async def create_template(template: DocumentTemplate, user_id: str) -> Optional[DocumentTemplate]:
    """Create a new document template."""
    try:
        print(f"Creating template: {template.name}")

        # Set created_by and timestamps
        template.created_by = user_id
        template.created_at = datetime.now()
        template.updated_at = datetime.now()

        # Convert to dict for database insertion
        template_dict = template.dict(exclude={"id"})

        # Convert fields and tags to JSON strings if needed
        if isinstance(template_dict["fields"], list):
            template_dict["fields"] = json.dumps([field.dict() for field in template.fields])

        if isinstance(template_dict["tags"], list):
            template_dict["tags"] = json.dumps(template_dict["tags"])

        # Insert into database
        response = supabase_client.table("document_templates").insert(template_dict).execute()

        if not response.data:
            print("Failed to create template")
            return None

        # Get the created template with ID
        created_template = response.data[0]

        # Parse fields from JSON string if needed
        fields = created_template.get("fields", [])
        if isinstance(fields, str):
            fields = json.loads(fields)

        # Parse tags from JSON string if needed
        tags = created_template.get("tags", [])
        if isinstance(tags, str):
            tags = json.loads(tags)

        return DocumentTemplate(
            id=created_template.get("id"),
            name=created_template.get("name"),
            description=created_template.get("description"),
            category=created_template.get("category"),
            format=created_template.get("format", "docx"),
            content=created_template.get("content", ""),
            fields=fields,
            created_by=created_template.get("created_by"),
            created_at=created_template.get("created_at"),
            updated_at=created_template.get("updated_at"),
            is_public=created_template.get("is_public", False),
            tags=tags
        )

    except Exception as e:
        print(f"Error in create_template: {e}")
        return None


async def update_template(template_id: str, template: DocumentTemplate, user_id: str) -> Optional[DocumentTemplate]:
    """Update an existing document template."""
    try:
        print(f"Updating template with ID: {template_id}")

        # Check if template exists and user has permission
        existing_template = await get_template_by_id(template_id)
        if not existing_template:
            print(f"Template with ID {template_id} not found")
            return None

        if existing_template.created_by != user_id and not existing_template.is_public:
            print(f"User {user_id} does not have permission to update template {template_id}")
            return None

        # Update timestamps
        template.updated_at = datetime.now()

        # Convert to dict for database update
        template_dict = template.dict(exclude={"id", "created_by", "created_at"})

        # Convert fields and tags to JSON strings if needed
        if isinstance(template_dict["fields"], list):
            template_dict["fields"] = json.dumps([field.dict() for field in template.fields])

        if isinstance(template_dict["tags"], list):
            template_dict["tags"] = json.dumps(template_dict["tags"])

        # Update in database
        response = supabase_client.table("document_templates").update(template_dict).eq("id", template_id).execute()

        if not response.data:
            print(f"Failed to update template {template_id}")
            return None

        # Get the updated template
        updated_template = response.data[0]

        # Parse fields from JSON string if needed
        fields = updated_template.get("fields", [])
        if isinstance(fields, str):
            fields = json.loads(fields)

        # Parse tags from JSON string if needed
        tags = updated_template.get("tags", [])
        if isinstance(tags, str):
            tags = json.loads(tags)

        return DocumentTemplate(
            id=updated_template.get("id"),
            name=updated_template.get("name"),
            description=updated_template.get("description"),
            category=updated_template.get("category"),
            format=updated_template.get("format", "docx"),
            content=updated_template.get("content", ""),
            fields=fields,
            created_by=updated_template.get("created_by"),
            created_at=updated_template.get("created_at"),
            updated_at=updated_template.get("updated_at"),
            is_public=updated_template.get("is_public", False),
            tags=tags
        )

    except Exception as e:
        print(f"Error in update_template: {e}")
        return None


async def delete_template(template_id: str, user_id: str) -> bool:
    """Delete a document template."""
    try:
        print(f"Deleting template with ID: {template_id}")

        # Check if template exists and user has permission
        existing_template = await get_template_by_id(template_id)
        if not existing_template:
            print(f"Template with ID {template_id} not found")
            return False

        if existing_template.created_by != user_id:
            print(f"User {user_id} does not have permission to delete template {template_id}")
            return False

        # Delete from database
        response = supabase_client.table("document_templates").delete().eq("id", template_id).execute()

        if not response.data:
            print(f"Failed to delete template {template_id}")
            return False

        return True

    except Exception as e:
        print(f"Error in delete_template: {e}")
        return False


async def generate_document_content(request: ContentGenerationRequest) -> ContentGenerationResult:
    """Generate document content using AI."""
    try:
        print(f"Generating document content with format: {request.format}")

        # Initialize content generation agent
        generation_agent = Agent(
            model=AzureOpenAI(
                id=azure_openai_completion_model,
                api_key=azure_openai_api_key,
                azure_endpoint=azure_openai_endpoint,
                api_version=azure_openai_api_version
            ),
            name="Document Generation Agent",
            description="Generates document content based on templates and user inputs.",
            instructions=[
                "You are a document generation agent that creates professional document content.",
                "Generate content based on templates and user inputs.",
                "Ensure the content is well-structured, professional, and follows best practices for the document type."
            ],
            markdown=True
        )

        # If template_id is provided, get the template
        template = None
        if request.template_id:
            template = await get_template_by_id(request.template_id)
            if not template:
                return ContentGenerationResult(
                    success=False,
                    format=request.format,
                    error=f"Template with ID {request.template_id} not found"
                )

        # If template_name is provided but not template_id, try to find the template by name
        elif request.template_name:
            templates = await get_templates()
            for t in templates:
                if t.name.lower() == request.template_name.lower():
                    template = t
                    break

            if not template:
                return ContentGenerationResult(
                    success=False,
                    format=request.format,
                    error=f"Template with name '{request.template_name}' not found"
                )

        # Prepare generation prompt
        if template:
            # Generate from template
            prompt = f"""
            Generate a {template.format} document based on the following template:

            Template Name: {template.name}
            Template Description: {template.description}

            Template Content:
            {template.content}

            User Inputs:
            """

            # Add user inputs for template fields
            for field in template.fields:
                field_value = request.fields.get(field.name, field.default or "")
                prompt += f"\n{field.name}: {field_value}"

            prompt += """

            Please generate the complete document content based on the template and user inputs.
            Ensure the document is well-structured, professional, and follows best practices.
            Return ONLY the generated document content without any additional explanations.
            """
        else:
            # Generate from description
            if not request.description:
                return ContentGenerationResult(
                    success=False,
                    format=request.format,
                    error="Either template_id, template_name, or description must be provided"
                )

            prompt = f"""
            Generate a {request.format} document based on the following description:

            {request.description}

            User Inputs:
            """

            # Add any user inputs
            for field_name, field_value in request.fields.items():
                prompt += f"\n{field_name}: {field_value}"

            prompt += """

            Please generate the complete document content based on the description and user inputs.
            Ensure the document is well-structured, professional, and follows best practices.
            Return ONLY the generated document content without any additional explanations.
            """

        # Generate content
        response = generation_agent.run(prompt)

        # Extract content from response
        content = response.content

        # Remove markdown code blocks if present
        if "```" in content:
            # Extract content between first and last code block markers
            content = content.split("```", 1)[1]
            if "```" in content:
                content = content.split("```", 1)[0]

            # Remove language identifier if present (e.g., ```markdown)
            if content.startswith(request.format) or content.startswith("markdown") or content.startswith("md"):
                content = content.split("\n", 1)[1]

        return ContentGenerationResult(
            success=True,
            content=content,
            format=request.format
        )

    except Exception as e:
        print(f"Error in generate_document_content: {e}")
        return ContentGenerationResult(
            success=False,
            format=request.format,
            error=str(e)
        )
