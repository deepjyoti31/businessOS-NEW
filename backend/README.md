# BusinessOS Backend

This is the backend service for BusinessOS, providing document processing and AI services using FastAPI and Agno agents.

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   # Or with uv:
   uv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   # Or with uv:
   uv pip install -r requirements.txt
   ```

4. Create a `.env` file based on `.env.example` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

5. Make sure the Agno library is available in the project root:
   - The `agno-main` directory should be in the project root
   - If not, clone it from the repository

6. Set up vector search in Supabase:
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
# Or with uvicorn directly:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Document Processing

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

### Document Search

- `POST /api/documents/search`: Search for documents similar to a query
  - Request body: `{ "query_text": "your search query", "match_threshold": 0.7, "match_count": 10 }`
  - This endpoint will:
    - Generate an embedding for the query text
    - Use vector search to find similar documents
    - Return the matching documents with similarity scores
    - Fall back to keyword search if vector search fails

## How It Works

### Document Processing

1. The frontend calls the `/api/documents/process` endpoint with a file ID
2. The backend downloads the file from Supabase Storage
3. Agno extracts text from the document using the appropriate reader (PDF, DOCX, etc.)
4. Azure OpenAI generates a summary, extracts entities, classifies topics, and analyzes sentiment
5. The backend stores the results in Supabase
6. The frontend displays the analysis results

### Semantic Search

1. The frontend calls the `/api/documents/search` endpoint with a query
2. The backend generates an embedding for the query using Azure OpenAI
3. The backend uses vector search to find similar documents
4. The frontend displays the search results

## Troubleshooting

### Common Issues

1. **File download fails**:
   - Check that the file exists in Supabase Storage
   - Verify that the storage path is correct
   - Check that the Supabase service key has the necessary permissions

2. **Document processing fails**:
   - Check that the Azure OpenAI API key and endpoint are correct
   - Verify that the model deployments exist and are available
   - Check the file type is supported (PDF, DOCX, TXT, CSV, etc.)

3. **Vector search fails**:
   - Make sure you've run the `setup_vector_search.py` script
   - Check that the pgvector extension is enabled in Supabase
   - Verify that the document_embeddings table exists and has data

## Integration with Frontend

The frontend calls these API endpoints to process documents and search for similar documents. The `SupabaseAIDocumentService.ts` file has been updated to call these endpoints.
