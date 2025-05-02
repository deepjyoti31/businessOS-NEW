-- Create document_shares table for tracking shared documents
CREATE TABLE IF NOT EXISTS document_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL,
    shared_with_id UUID NOT NULL,
    permission_level TEXT NOT NULL CHECK (permission_level IN ('view', 'edit', 'comment')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(file_id, shared_with_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS document_shares_file_id_idx ON document_shares(file_id);
CREATE INDEX IF NOT EXISTS document_shares_shared_with_id_idx ON document_shares(shared_with_id);
CREATE INDEX IF NOT EXISTS document_shares_owner_id_idx ON document_shares(owner_id);

-- Add RLS policies for document_shares table
ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see shares where they are the owner or the recipient
CREATE POLICY document_shares_select_policy ON document_shares
    FOR SELECT
    USING (
        owner_id = auth.uid() OR 
        shared_with_id = auth.uid()
    );

-- Policy: Users can only insert shares for files they own
CREATE POLICY document_shares_insert_policy ON document_shares
    FOR INSERT
    WITH CHECK (
        owner_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM files 
            WHERE files.id = file_id AND files.owner_id = auth.uid()
        )
    );

-- Policy: Users can only update shares they own
CREATE POLICY document_shares_update_policy ON document_shares
    FOR UPDATE
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

-- Policy: Users can only delete shares they own
CREATE POLICY document_shares_delete_policy ON document_shares
    FOR DELETE
    USING (owner_id = auth.uid());

-- Create document_versions table for version control
CREATE TABLE IF NOT EXISTS document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    storage_path TEXT NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    size INTEGER,
    comment TEXT,
    UNIQUE(file_id, version_number)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS document_versions_file_id_idx ON document_versions(file_id);

-- Add RLS policies for document_versions table
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see versions of files they own or have been shared with them
CREATE POLICY document_versions_select_policy ON document_versions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM files 
            WHERE files.id = file_id AND files.owner_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM document_shares 
            WHERE document_shares.file_id = file_id AND document_shares.shared_with_id = auth.uid()
        )
    );

-- Policy: Users can only insert versions for files they own or have edit permission
CREATE POLICY document_versions_insert_policy ON document_versions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM files 
            WHERE files.id = file_id AND files.owner_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM document_shares 
            WHERE document_shares.file_id = file_id 
            AND document_shares.shared_with_id = auth.uid()
            AND document_shares.permission_level = 'edit'
        )
    );

-- Function to update the version number automatically
CREATE OR REPLACE FUNCTION update_document_version_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.version_number := (
        SELECT COALESCE(MAX(version_number), 0) + 1
        FROM document_versions
        WHERE file_id = NEW.file_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set the version number
CREATE TRIGGER set_document_version_number
BEFORE INSERT ON document_versions
FOR EACH ROW
EXECUTE FUNCTION update_document_version_number();
