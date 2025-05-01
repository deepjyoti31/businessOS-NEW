-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the document_embeddings table if it doesn't exist
CREATE TABLE IF NOT EXISTS document_embeddings (
    id UUID PRIMARY KEY REFERENCES files(id) ON DELETE CASCADE,
    embedding VECTOR(1536),  -- Adjust dimension based on your embedding model
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index for faster vector search
CREATE INDEX IF NOT EXISTS document_embeddings_embedding_idx ON document_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create a function for vector search
CREATE OR REPLACE FUNCTION search_documents(
    query_embedding VECTOR(1536),
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        1 - (e.embedding <=> query_embedding) AS similarity
    FROM
        document_embeddings e
    JOIN
        files f ON e.id = f.id
    WHERE
        f.is_archived = false
        AND 1 - (e.embedding <=> query_embedding) > match_threshold
    ORDER BY
        similarity DESC
    LIMIT
        match_count;
END;
$$;
