# Documents Module

The Documents module provides a comprehensive document management system with Supabase Storage integration for file storage and Supabase PostgreSQL for metadata management.

## Features

- File upload and download
- Folder creation and navigation
- File and folder browsing
- Search functionality
- Grid and list views
- File metadata management

## Setup

### Supabase Configuration

1. Create a Supabase project
2. Create a storage bucket named "documents"
3. Create a 'files' table in PostgreSQL for metadata
4. Set up appropriate RLS (Row Level Security) policies

### Environment Variables

Copy the `.env.example` file to `.env` and update the values:

```
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Installation

Install the required dependencies:

```bash
npm install @supabase/supabase-js
```

## Usage

### Uploading Files

1. Navigate to the All Files page
2. Click the "Upload File" button
3. Select one or more files to upload
4. The files will be uploaded to the current folder

### Creating Folders

1. Navigate to the All Files page
2. Click the "New Folder" button
3. Enter a name for the folder
4. The folder will be created in the current location

### Navigating Folders

1. Click on a folder to navigate into it
2. Use the breadcrumb navigation to go back to parent folders
3. Click the back button to go to the parent folder

### Searching Files

1. Use the search box to filter files and folders
2. The search works on file names and tags

## Architecture

The Documents module uses the following components:

- **SupabaseStorageService**: Handles file storage operations with Supabase Storage
- **SupabaseDocumentService**: Provides a unified API for document operations
- **AllFiles Component**: Main UI for browsing files and folders
- **UploadFileDialog**: UI for uploading files
- **NewFolderDialog**: UI for creating folders

## Future Enhancements

- File preview functionality
- Version control
- Sharing and permissions
- AI document processing with Agno and OpenAI
- Document tagging and categorization
- Advanced search with filters
