# Detailed Installation Guide for BusinessOS

This guide provides step-by-step instructions for setting up BusinessOS on your local machine or server.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Step 1: Clone the Repository](#step-1-clone-the-repository)
- [Step 2: Supabase Setup](#step-2-supabase-setup)
  - [Create a Supabase Project](#create-a-supabase-project)
  - [Database Schema Setup](#database-schema-setup)
  - [Storage Buckets Setup](#storage-buckets-setup)
  - [Authentication Setup](#authentication-setup)
  - [Row Level Security (RLS) Policies](#row-level-security-rls-policies)
- [Step 3: Azure OpenAI Setup](#step-3-azure-openai-setup)
  - [Create an Azure OpenAI Resource](#create-an-azure-openai-resource)
  - [Deploy Models](#deploy-models)
  - [Get API Keys and Endpoints](#get-api-keys-and-endpoints)
- [Step 4: Backend Setup](#step-4-backend-setup)
  - [Python Environment Setup](#python-environment-setup)
  - [Install Dependencies](#install-dependencies)
  - [Environment Variables Configuration](#environment-variables-configuration)
  - [Run the Backend Server](#run-the-backend-server)
- [Step 5: Frontend Setup](#step-5-frontend-setup)
  - [Node.js Setup](#nodejs-setup)
  - [Install Dependencies](#install-dependencies-1)
  - [Environment Variables Configuration](#environment-variables-configuration-1)
  - [Run the Frontend Development Server](#run-the-frontend-development-server)
- [Step 6: Verify Installation](#step-6-verify-installation)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)

## Prerequisites

Before starting the installation, ensure you have the following:

- **Git**: [Download and install Git](https://git-scm.com/downloads)
- **Node.js**: Version 16 or later - [Download Node.js](https://nodejs.org/)
- **Python**: Version 3.9 or later - [Download Python](https://www.python.org/downloads/)
- **uv**: Python package installer - Install with `pip install uv`
- **A Supabase account**: [Sign up for Supabase](https://supabase.com/)
- **An Azure account**: [Sign up for Azure](https://azure.microsoft.com/)

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/businessOS.git

# Navigate to the project directory
cd businessOS
```

## Step 2: Supabase Setup

### Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/) and sign in
2. Click "New Project"
3. Enter a name for your project (e.g., "BusinessOS")
4. Choose a database password (save this for later)
5. Choose a region close to your users
6. Click "Create new project"

### Database Schema Setup

Once your project is created, you'll need to set up the database schema:

1. Go to the SQL Editor in your Supabase dashboard
2. Run the following SQL scripts in order:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create documents table
CREATE TABLE public.documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    file_path TEXT,
    file_type TEXT,
    file_size INTEGER,
    is_folder BOOLEAN DEFAULT false,
    parent_id UUID REFERENCES public.documents(id),
    owner_id UUID REFERENCES public.profiles(id) NOT NULL,
    is_template BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    ai_processed BOOLEAN DEFAULT false,
    ai_summary TEXT,
    ai_entities JSONB,
    ai_sentiment JSONB,
    ai_topics JSONB,
    embedding VECTOR(1536)
);

-- Create document_versions table
CREATE TABLE public.document_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID REFERENCES public.documents(id) NOT NULL,
    version_number INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    created_by UUID REFERENCES public.profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    comment TEXT
);

-- Create document_permissions table
CREATE TABLE public.document_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID REFERENCES public.documents(id) NOT NULL,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    permission_level TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(document_id, user_id)
);

-- Create ai_assistant_conversations table
CREATE TABLE public.ai_assistant_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_pinned BOOLEAN DEFAULT false
);

-- Create ai_assistant_messages table
CREATE TABLE public.ai_assistant_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES public.ai_assistant_conversations(id) NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create budget_categories table
CREATE TABLE public.budget_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create budget_expenses table
CREATE TABLE public.budget_expenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID REFERENCES public.budget_categories(id) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    transaction_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.budget_categories(id),
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create employees table
CREATE TABLE public.employees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    department_id UUID,
    position TEXT,
    hire_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create departments table
CREATE TABLE public.departments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    category TEXT NOT NULL
);

-- Add foreign key constraint to employees table
ALTER TABLE public.employees
ADD CONSTRAINT fk_department
FOREIGN KEY (department_id)
REFERENCES public.departments(id);

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;
```

### Storage Buckets Setup

1. Go to the Storage section in your Supabase dashboard
2. Create the following buckets:
   - `documents` - for storing document files
   - `avatars` - for storing user avatars

For each bucket, set up the following permissions:

**Documents Bucket**:
- Set bucket to private
- Add the following RLS policy for authenticated users:

```sql
-- Allow users to select their own documents or documents shared with them
CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR
   EXISTS (
     SELECT 1 FROM public.document_permissions
     JOIN public.documents ON document_permissions.document_id = documents.id
     WHERE documents.file_path = name
     AND document_permissions.user_id = auth.uid()
   ))
);

-- Allow users to insert their own documents
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own documents
CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own documents
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Avatars Bucket**:
- Set bucket to private
- Add the following RLS policy for authenticated users:

```sql
-- Allow users to select any avatar
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow users to upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Authentication Setup

1. Go to the Authentication section in your Supabase dashboard
2. Under "Settings" > "Auth Providers", enable the providers you want to use (Email, Google, etc.)
3. Configure the redirect URLs for your application:
   - For local development: `http://localhost:5173/login`
   - For production: `https://yourdomain.com/login`

### Row Level Security (RLS) Policies

Set up RLS policies for your tables to ensure data security:

```sql
-- Profiles table policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Documents table policies
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own documents or documents shared with them"
ON public.documents FOR SELECT
USING (
  owner_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.document_permissions
    WHERE document_permissions.document_id = documents.id
    AND document_permissions.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own documents"
ON public.documents FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own documents"
ON public.documents FOR UPDATE
USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own documents"
ON public.documents FOR DELETE
USING (owner_id = auth.uid());

-- Similar policies for other tables...
```

## Step 3: Azure OpenAI Setup

### Create an Azure OpenAI Resource

1. Sign in to the [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Azure OpenAI"
4. Click "Create"
5. Fill in the required details:
   - Subscription: Select your Azure subscription
   - Resource group: Create a new one or select an existing one
   - Region: Choose a region where Azure OpenAI is available
   - Name: Enter a name for your resource
   - Pricing tier: Select a pricing tier
6. Click "Review + create", then "Create"

### Deploy Models

1. Once your Azure OpenAI resource is created, go to the resource
2. Click on "Model deployments" in the left menu
3. Click "Create new deployment"
4. Deploy the following models:
   - Model: `gpt-35-turbo` or `gpt-4` (if available)
     - Deployment name: `text-generation` (or your preferred name)
     - Version: Select the latest version
   - Model: `text-embedding-ada-002`
     - Deployment name: `text-embedding` (or your preferred name)
     - Version: Select the latest version

### Get API Keys and Endpoints

1. In your Azure OpenAI resource, go to "Keys and Endpoint" in the left menu
2. Copy "Key 1" or "Key 2" - this is your `AZURE_OPENAI_API_KEY`
3. Copy the "Endpoint" - this is your `AZURE_OPENAI_API_BASE`
4. Note your deployment names - these are your `AZURE_OPENAI_DEPLOYMENT_NAME` and `AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME`

## Step 4: Backend Setup

### Python Environment Setup

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

### Install Dependencies

```bash
# Install dependencies using uv
uv pip install -r requirements.txt
```

### Environment Variables Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
DEBUG=True
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173

# Supabase Configuration
SUPABASE_URL=https://your-supabase-project-url.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key

# Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
AZURE_OPENAI_API_BASE=https://your-azure-openai-resource.openai.azure.com
AZURE_OPENAI_API_VERSION=2023-05-15
AZURE_OPENAI_DEPLOYMENT_NAME=text-generation
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME=text-embedding

# Agno Configuration (for document processing)
AGNO_API_KEY=your-agno-api-key
```

Replace the placeholder values with your actual configuration:

- `SUPABASE_URL`: Your Supabase project URL (from Project Settings > API)
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key (from Project Settings > API)
- `AZURE_OPENAI_API_KEY`: Your Azure OpenAI API key
- `AZURE_OPENAI_API_BASE`: Your Azure OpenAI endpoint
- `AZURE_OPENAI_DEPLOYMENT_NAME`: Your text generation model deployment name
- `AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME`: Your text embedding model deployment name
- `AGNO_API_KEY`: Your Agno API key (if using Agno for document processing)

### Run the Backend Server

```bash
# Start the development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Step 5: Frontend Setup

### Node.js Setup

Ensure you have Node.js v16 or later installed.

### Install Dependencies

```bash
# Navigate to the frontend directory
cd frontend/business-flow-canvas-suite-main

# Install dependencies
npm install
```

### Environment Variables Configuration

Create a `.env` file in the `frontend/business-flow-canvas-suite-main` directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-supabase-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# API Configuration
VITE_API_URL=http://localhost:8000

# Optional: Analytics
VITE_GA_TRACKING_ID=your-ga-tracking-id
```

Replace the placeholder values with your actual configuration:

- `VITE_SUPABASE_URL`: Your Supabase project URL (from Project Settings > API)
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public key (from Project Settings > API)
- `VITE_API_URL`: URL of your backend API (default: http://localhost:8000)

### Run the Frontend Development Server

```bash
# Start the development server
npm run dev
```

## Step 6: Verify Installation

1. Open your browser and navigate to `http://localhost:5173`
2. You should see the BusinessOS landing page
3. Try signing up for a new account
4. Verify that you can access the dashboard after signing in
5. Test the various features of the application

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure that your frontend URL is included in the `ALLOWED_ORIGINS` in the backend `.env` file
   - Check that your backend server is running and accessible

2. **Authentication Issues**:
   - Verify that your Supabase URL and keys are correct
   - Check that the redirect URLs are properly configured in Supabase

3. **Database Connection Issues**:
   - Ensure that your Supabase service key has the necessary permissions
   - Verify that the database schema is correctly set up

4. **Azure OpenAI Issues**:
   - Check that your API key and endpoint are correct
   - Verify that the model deployments are active

### Getting Help

If you encounter issues not covered here:

1. Check the [GitHub Issues](https://github.com/yourusername/businessOS/issues) for similar problems
2. Join our [Discord community](https://discord.gg/yourdiscord) for real-time help
3. Open a new issue on GitHub with detailed information about your problem

## Production Deployment

For production deployment, consider the following:

1. **Frontend**:
   - Build the frontend with `npm run build`
   - Deploy the built files to a static hosting service (Netlify, Vercel, etc.)
   - Set up environment variables in your hosting provider

2. **Backend**:
   - Deploy to a server or cloud service (AWS, Azure, GCP, etc.)
   - Use a process manager like PM2 or Docker for running the application
   - Set up environment variables securely
   - Configure a reverse proxy (Nginx, Apache) for HTTPS

3. **Database**:
   - Use Supabase's production tier for better performance
   - Set up regular backups
   - Monitor database performance

4. **Security**:
   - Enable HTTPS for all connections
   - Regularly update dependencies
   - Follow security best practices for your deployment platform

---

For more detailed information, refer to the [official documentation](https://yourusername.github.io/businessOS) or join our [community Discord](https://discord.gg/yourdiscord).
