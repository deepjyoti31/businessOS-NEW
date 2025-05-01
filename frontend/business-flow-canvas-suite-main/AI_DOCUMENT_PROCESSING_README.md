# AI Document Processing Implementation

This document provides instructions for setting up and using the AI document processing functionality in BusinessOS.

## Overview

The AI document processing functionality uses Agno agents with Azure OpenAI models to extract text, generate summaries, identify entities, classify topics, analyze sentiment, and generate embeddings for semantic search.

## Setup Instructions

### 1. Environment Variables

Make sure your `.env` file in the `frontend/business-flow-canvas-suite-main` directory contains the following variables:

```
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key

# Azure OpenAI Configuration
VITE_AZURE_OPENAI_API_KEY=your-azure-openai-api-key
VITE_AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com
VITE_AZURE_OPENAI_API_VERSION=2024-10-21
VITE_AZURE_OPENAI_COMPLETION_MODEL=gpt-4o
VITE_AZURE_OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Python Environment Variables (for document processing service)
AZURE_OPENAI_API_KEY=${VITE_AZURE_OPENAI_API_KEY}
AZURE_OPENAI_ENDPOINT=${VITE_AZURE_OPENAI_ENDPOINT}
AZURE_OPENAI_API_VERSION=${VITE_AZURE_OPENAI_API_VERSION}
AZURE_OPENAI_COMPLETION_MODEL=${VITE_AZURE_OPENAI_COMPLETION_MODEL}
AZURE_OPENAI_EMBEDDING_MODEL=${VITE_AZURE_OPENAI_EMBEDDING_MODEL}
SUPABASE_URL=${VITE_SUPABASE_URL}
SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}
```

### 2. Azure OpenAI Setup

1. Create an Azure OpenAI resource in the Azure Portal
2. Deploy the following models:
   - GPT-4o or similar for document processing (completions)
   - text-embedding-3-small for document embeddings
3. Configure API access and security settings
4. Obtain API keys and endpoints

### 3. Supabase Database Setup

Make sure your Supabase database has the following columns in the `files` table:

- `summary` (text): Document summary
- `entities` (jsonb): Extracted entities (people, organizations, dates, etc.)
- `topics` (jsonb): Identified topics and categories
- `sentiment` (jsonb): Sentiment analysis results
- `processed_at` (timestamp): When the document was last processed
- `processing_status` (text): Current processing status

### 4. Python Dependencies

Install the required Python dependencies:

```bash
pip install supabase python-dotenv
```

## Usage

### Document Processing

1. Upload documents through the All Files page
2. Navigate to the AI Document Analysis page
3. Select a document from the list
4. Click "Process Document" to extract insights
5. View the generated summary, entities, topics, and sentiment analysis

### Semantic Search

1. Navigate to the AI Document Analysis page
2. Scroll down to the Semantic Search section
3. Enter a natural language query describing what you're looking for
4. Click "Search" to find semantically similar documents
5. View the search results with similarity scores

### Document AI Assistant

1. Navigate to the Documents Dashboard
2. Select a document from the Recent Documents list
3. Ask questions about the document in the Document AI Assistant
4. The assistant will provide answers based on the document's content and AI analysis

## Components

### Frontend Components

- **Analysis.tsx**: The AI Document Analysis page
- **DocumentAIAssistant.tsx**: The Document AI Assistant component
- **Dashboard.tsx**: The Documents Dashboard with AI features

### Services

- **SupabaseAIDocumentService.ts**: TypeScript service for AI document processing
- **documentProcessingService.py**: Python service for document processing using Agno and Azure OpenAI

## Troubleshooting

### Common Issues

1. **Document processing fails**:
   - Check that the Azure OpenAI API key and endpoint are correct
   - Verify that the model deployments exist and are available
   - Check the file type is supported (PDF, DOCX, TXT, CSV, etc.)

2. **Semantic search returns no results**:
   - Ensure documents have been processed and have embeddings
   - Try different search queries with more specific terms
   - Check that the pgvector extension is enabled in Supabase

3. **Python service errors**:
   - Check that all required Python dependencies are installed
   - Verify that the environment variables are set correctly
   - Check the Python path includes the Agno library

## Next Steps

1. **Batch Processing**: Implement batch processing for multiple documents
2. **Document Comparison**: Add functionality to compare documents
3. **Content Generation**: Implement AI-powered document generation
4. **Advanced Collaboration**: Add commenting and annotation features
