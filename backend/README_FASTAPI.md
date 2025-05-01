# BusinessOS FastAPI Server

This document provides instructions for setting up and running the FastAPI server for document processing in BusinessOS.

## Overview

The FastAPI server provides API endpoints for document processing and AI analysis using Agno agents with Azure OpenAI models. It handles document text extraction, summarization, entity extraction, topic classification, sentiment analysis, and semantic search.

## Setup

1. Make sure you have completed the general setup steps in the main README.md file.

2. Ensure your `.env` file contains all the required environment variables:
   ```
   # Supabase Configuration
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_KEY=your-supabase-service-key
   
   # Azure OpenAI Configuration
   AZURE_OPENAI_API_KEY=your-azure-openai-api-key
   AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com
   AZURE_OPENAI_API_VERSION=2024-10-21
   AZURE_OPENAI_COMPLETION_MODEL=gpt-4o
   AZURE_OPENAI_EMBEDDING_MODEL=text-embedding-3-small
   
   # FastAPI Configuration
   API_PORT=8000
   CORS_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
   ```

3. Set up vector search in Supabase by running:
   ```bash
   python setup_vector_search.py
   ```
   This script will:
   - Enable the pgvector extension in your Supabase database
   - Create the document_embeddings table
   - Create a function for vector search

## Running the Server

Start the FastAPI server:
```bash
python run.py
```

The API will be available at http://localhost:8000

## Testing the API

You can test the API using the provided test script:
```bash
python test_api.py
```

This script will test the following endpoints:
- `/health`: Health check endpoint
- `/api/documents/status`: Document processing service status
- `/api/documents/search`: Document search endpoint

## API Endpoints

### Health Check

- `GET /health`: Check the health of the API and its dependencies
  - Returns the status of the API, Supabase connection, and Azure OpenAI connection

### Document Processing

- `GET /api/documents/status`: Get the status of the document processing service
  - Returns information about available features

- `POST /api/documents/process`: Process a document to extract insights
  - Request body: `{ "file_id": "your-file-id" }`
  - This endpoint will:
    - Download the document from Supabase Storage
    - Extract text using Agno document readers
    - Generate a summary using Azure OpenAI
    - Extract entities (people, organizations, locations, dates, key terms)
    - Classify the document into topics
    - Analyze sentiment
    - Generate embeddings for semantic search
    - Store all this information in Supabase

- `POST /api/documents/batch-process`: Process multiple documents in batch
  - Request body: `{ "file_ids": ["file-id-1", "file-id-2", ...] }`
  - This endpoint processes multiple documents in parallel

### Document Search

- `POST /api/documents/search`: Search for documents similar to a query
  - Request body: `{ "query_text": "your search query", "match_threshold": 0.7, "match_count": 10 }`
  - This endpoint will:
    - Generate an embedding for the query text
    - Use vector search to find similar documents
    - Return the matching documents with similarity scores
    - Fall back to keyword search if vector search fails

## Troubleshooting

### Common Issues

1. **Server won't start**:
   - Check that all required environment variables are set in the `.env` file
   - Verify that the port specified in `API_PORT` is available
   - Make sure all dependencies are installed

2. **Document processing fails**:
   - Check that the Azure OpenAI API key and endpoint are correct
   - Verify that the model deployments exist and are available
   - Check the file type is supported (PDF, DOCX, TXT, CSV, etc.)

3. **Vector search fails**:
   - Make sure you've run the `setup_vector_search.py` script
   - Check that the pgvector extension is enabled in Supabase
   - Verify that the document_embeddings table exists and has data

4. **CORS errors**:
   - Update the `CORS_ORIGINS` environment variable to include your frontend URL
   - Make sure the frontend is making requests to the correct API URL

## Next Steps

1. **Implement document comparison**: Add functionality to compare documents semantically
2. **Add content generation**: Implement AI-powered document generation
3. **Create document analytics**: Build a comprehensive analytics dashboard
4. **Implement question answering**: Add a document AI assistant for answering questions
