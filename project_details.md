# BusinessOS Project Details

## Project Overview

### Vision and Purpose
BusinessOS is an AI-first business management platform designed for small businesses (up to 50 employees). The platform integrates various business functions into a single system powered by AI to simplify operations and enhance productivity.

### Target Market
- Small businesses with up to 50 employees
- Businesses seeking AI-powered automation
- Focus industries: Service, Retail, and Professional Services

### Core Value Proposition
1. **AI-powered business operations**: Leveraging AI to automate and enhance business processes
2. **Integrated business functions**: Bringing together various business modules in one platform
3. **Simplified workflow automation**: Making complex business processes easier to manage
4. **Reduced operational complexity**: Streamlining operations for small businesses

## Technical Architecture

### Technology Stack

#### Frontend
- **Framework**: React with TypeScript
- **UI Components**: shadcn/ui component library
- **State Management**: React Query for server state
- **Routing**: React Router
- **Build Tool**: Vite

#### Backend
- **API Framework**: FastAPI (Python)
- **Authentication**: Supabase Authentication (migrated from Azure AD B2C)
- **Database**: Supabase PostgreSQL (migrated from Azure Cosmos DB)
- **Storage**: Supabase Storage (migrated from Azure Blob Storage)
- **Vector Database**: pgvector extension in Supabase PostgreSQL for document embeddings

#### AI Integration
- **AI Framework**: Agno with Azure OpenAI models
- **Document Processing**: PDF, DOCX, CSV, and text extraction
- **AI Capabilities**:
  - Text extraction
  - Document summarization
  - Entity extraction
  - Topic classification
  - Sentiment analysis
  - Vector embeddings for semantic search
  - Document comparison
  - Content generation

### Project Structure
- **frontend/business-flow-canvas-suite-main**: React frontend application
- **backend**: FastAPI backend services
- **agno-main**: Agno framework for AI capabilities

## Database Schema

### Key Tables

#### Users and Authentication
- **auth.users**: Managed by Supabase Auth
- **profiles**: Extended user information
  - id (references auth.users.id)
  - name
  - email
  - role
  - avatar_url
  - created_at
  - updated_at

#### Document Management
- **files**: Document metadata
  - id (UUID)
  - name (string)
  - path (string)
  - size (integer)
  - type (string)
  - is_folder (boolean)
  - parent_id (UUID, nullable)
  - user_id (references auth.users.id)
  - created_at (timestamp)
  - updated_at (timestamp)
  - last_accessed_at (timestamp, nullable)
  - storage_path (string)
  - is_favorite (boolean)
  - is_archived (boolean)
  - metadata (jsonb, nullable)
  - processing_status (string, nullable)
  - summary (text, nullable)
  - entities (jsonb, nullable)
  - topics (jsonb, nullable)
  - sentiment (jsonb, nullable)
  - processed_at (timestamp, nullable)

- **document_embeddings**: Vector embeddings for semantic search
  - id (references files.id)
  - embedding (vector)
  - created_at (timestamp)

#### Finance Management
- **transactions**: Financial transactions
  - id (UUID)
  - user_id (UUID, references auth.users.id)
  - date (timestamp)
  - type (string, 'Income' or 'Expense')
  - description (string)
  - amount (decimal)
  - category (string, nullable)
  - reference (string, nullable)
  - created_at (timestamp)
  - updated_at (timestamp)
  - is_deleted (boolean)

#### Administration
- **roles**: User roles
  - id (UUID)
  - name (string)
  - description (text)
  - created_at (timestamp)
  - updated_at (timestamp)

- **permissions**: System permissions
  - id (UUID)
  - name (string)
  - description (text)
  - resource (string)
  - action (string)
  - created_at (timestamp)
  - updated_at (timestamp)

- **role_permissions**: Junction table for roles and permissions
  - role_id (references roles.id)
  - permission_id (references permissions.id)
  - created_at (timestamp)

- **user_roles**: Junction table for users and roles
  - user_id (references auth.users.id)
  - role_id (references roles.id)
  - created_at (timestamp)

#### System Settings
- **company_profile**: Company information
  - id (UUID)
  - name (string)
  - logo_url (string)
  - industry (string)
  - size (string)
  - founded (string)
  - website (string)
  - description (text)
  - email (string)
  - phone (string)
  - address (text)
  - city (string)
  - state (string)
  - postal_code (string)
  - country (string)
  - tax_id (string)
  - registration_number (string)
  - fiscal_year (string)
  - created_at (timestamp)
  - updated_at (timestamp)

- **system_settings**: System configuration
  - id (UUID)
  - category (string)
  - key (string)
  - value (jsonb)
  - description (text)
  - data_type (string)
  - created_at (timestamp)
  - updated_at (timestamp)

### Database Functions
- **search_documents(query_embedding vector, match_threshold float, match_count int)**: Vector similarity search for documents

## API Endpoints

### Document Management

#### Document Processing
- **POST /api/documents/process**
  - Process a document with AI
  - Request: `{ "file_id": "string" }`
  - Response: Document processing result with summary, entities, topics, and sentiment

#### Batch Processing
- **POST /api/documents/process-batch**
  - Process multiple documents
  - Request: `{ "file_ids": ["string"] }`
  - Response: Batch processing results

#### Document Search
- **POST /api/documents/search**
  - Search for documents semantically
  - Request: `{ "query_text": "string", "match_threshold": 0.7, "match_count": 10 }`
  - Response: List of matching documents with similarity scores

#### Document Comparison
- **POST /api/documents/compare**
  - Compare two documents
  - Request: `{ "file_id_1": "string", "file_id_2": "string" }`
  - Response: Comparison results with similarities and differences

#### Content Generation
- **POST /api/documents/generate**
  - Generate document content
  - Request: Content generation parameters
  - Response: Generated content

### Finance Management

#### Transaction Operations
- **GET /api/finance/transactions**
  - Get all transactions with optional filtering, pagination, and sorting
  - Query Parameters: page, page_size, sort_by, sort_order, start_date, end_date, type, category, min_amount, max_amount, search
  - Response: List of transactions

- **GET /api/finance/transactions/{transaction_id}**
  - Get a specific transaction by ID
  - Response: Transaction details

- **POST /api/finance/transactions**
  - Create a new transaction
  - Request: Transaction creation parameters (date, type, description, amount, category, reference)
  - Response: Created transaction details

- **PUT /api/finance/transactions/{transaction_id}**
  - Update a transaction
  - Request: Transaction update parameters
  - Response: Updated transaction details

- **DELETE /api/finance/transactions/{transaction_id}**
  - Delete a transaction (soft delete by default)
  - Query Parameters: hard_delete (boolean)
  - Response: Success status

#### Transaction Summary
- **GET /api/finance/transactions/summary**
  - Get summary statistics for transactions
  - Query Parameters: start_date, end_date, type, category
  - Response: Transaction summary with total income, total expenses, net amount, transaction count, and categories

#### Transaction Categories
- **GET /api/finance/transactions/categories**
  - Get all unique transaction categories
  - Response: List of categories

### User Management

#### User Operations
- **GET /api/admin/users**
  - Get all users
  - Response: List of users with profiles

- **GET /api/admin/users/{user_id}**
  - Get user by ID
  - Response: User details

- **POST /api/admin/users**
  - Create a new user
  - Request: User creation parameters
  - Response: Created user details

- **PUT /api/admin/users/{user_id}**
  - Update user
  - Request: User update parameters
  - Response: Updated user details

- **DELETE /api/admin/users/{user_id}**
  - Delete user
  - Response: Success status

### Role Management

#### Role Operations
- **GET /api/roles**
  - Get all roles
  - Response: List of roles

- **GET /api/roles/{role_id}**
  - Get role by ID
  - Response: Role details

- **POST /api/roles**
  - Create a new role
  - Request: Role creation parameters
  - Response: Created role details

- **PUT /api/roles/{role_id}**
  - Update role
  - Request: Role update parameters
  - Response: Updated role details

- **DELETE /api/roles/{role_id}**
  - Delete role
  - Response: Success status

### System Settings

#### Company Profile
- **GET /api/company/profile**
  - Get company profile
  - Response: Company details

- **PUT /api/company/profile**
  - Update company profile
  - Request: Company profile parameters
  - Response: Updated company details

#### System Settings
- **GET /api/settings**
  - Get all system settings
  - Response: List of settings

- **GET /api/settings/{category}**
  - Get settings by category
  - Response: Category settings

- **PUT /api/settings/{category}/{key}**
  - Update setting
  - Request: Setting value
  - Response: Updated setting

## AI Document Processing

### Processing Pipeline
1. Document upload to Supabase Storage
2. Text extraction using Agno document readers (PDF, DOCX, CSV, TXT)
3. AI processing with Azure OpenAI models:
   - Summary generation
   - Entity extraction (people, organizations, locations, dates, key terms)
   - Topic classification with confidence scores
   - Sentiment analysis (positive, negative, neutral)
4. Vector embedding generation for semantic search
5. Storage of results in Supabase PostgreSQL

### Semantic Search Implementation
- Document embeddings stored in document_embeddings table
- pgvector extension for vector similarity search
- Fallback to keyword search when vector search fails
- Configurable similarity threshold and result count

## Authentication and Security

### Authentication Flow
1. User signs in through Supabase Authentication
2. JWT token issued and stored in browser
3. Token included in API requests for authentication
4. Backend validates token with Supabase

### Security Measures
- Row Level Security (RLS) policies in Supabase
- Role-based access control for API endpoints
- Secure file storage with proper bucket policies
- Environment variable management for sensitive credentials

## Frontend Modules

### Core Modules
- **Dashboard**: Overview of business metrics and quick access to modules
- **Documents**: Document management with AI capabilities
- **Administration**: User and role management
- **Finance**: Financial management and reporting
- **Human Resources**: Employee management
- **Sales**: Sales pipeline and customer management
- **Marketing**: Campaign management
- **Business Intelligence**: Data visualization and insights
- **Customer Service**: Customer support management
- **Project Management**: Project tracking and management
- **Inventory**: Inventory tracking and management

### Documents Module Pages
- **Dashboard**: Overview of document metrics and quick access
- **All Files**: File browser with upload and organization capabilities
- **Analysis**: AI document analysis with summary, entities, topics, and sentiment
- **Compare**: Document comparison tool
- **Shared**: Shared documents
- **Templates**: Document templates
- **Archive**: Archived documents
- **File Details**: Detailed view of a specific file

### Finance Module Pages
- **Dashboard**: Overview of financial metrics and quick access to finance features
- **Transactions**: Transaction management with filtering, sorting, and categorization
- **Invoices**: Invoice creation, management, and tracking
- **Expenses**: Expense tracking and approval workflow
- **Reports**: Financial reports and analytics
- **Budgets**: Budget planning and tracking
- **Tax**: Tax calculation and reporting

## Development Guidelines

### Code Organization
- Frontend code in frontend/business-flow-canvas-suite-main
- Backend code in backend directory
- Source files should not be placed in root src directory

### Authentication Handling
- Authentication checks should happen invisibly without redirecting
- Use Supabase Authentication for all auth operations
- Implement proper error handling for auth failures

### API Integration
- Use React Query for API calls
- Implement proper error handling and loading states
- Optimize API calls to reduce requests

### AI Integration
- Use Agno with Azure OpenAI models for AI capabilities
- Implement proper error handling for AI processing
- Provide fallback mechanisms when AI services are unavailable

### Storage Integration
- Use Supabase Storage for file storage
- Implement robust file download with multiple fallback methods
- Configure proper storage policies for security

## Supabase Integration Details

### Supabase Project
- **Project Name**: BusinessOS
- **Project ID**: epgrylrflsrxkvpeieud
- **Region**: ap-southeast-1

### Storage Configuration
- **Bucket Name**: documents
- **Public Access**: Read-only for authenticated users
- **RLS Policies**:
  - Allow authenticated users to upload files
  - Allow users to access only their own files
  - Allow shared files to be accessed by specified users

### Database Extensions
- **pgvector**: Enabled for vector embeddings and similarity search
- **uuid-ossp**: Enabled for UUID generation

### RLS Policies
- **files table**:
  - Users can only see their own files or files shared with them
  - Users can only update their own files
  - Users can only delete their own files

- **profiles table**:
  - Users can only see their own profile
  - Users can only update their own profile
  - Admins can see and update all profiles

- **roles table**:
  - Only admins can create, update, or delete roles
  - All authenticated users can view roles

## FastAPI Backend Implementation

### Server Configuration
- **Host**: 0.0.0.0
- **Port**: 8000
- **CORS**: Configured to allow frontend origin

### Middleware
- **CORS Middleware**: Allows cross-origin requests from frontend
- **Authentication Middleware**: Validates Supabase JWT tokens

### Error Handling
- Comprehensive error handling with proper HTTP status codes
- Detailed error messages for debugging
- Graceful fallbacks for service failures

### Document Processing Implementation
- **Agno Agent**: Configured with Azure OpenAI models
- **Document Readers**: PDF, DOCX, CSV, TXT
- **Processing Queue**: Asynchronous processing with status tracking
- **Error Recovery**: Retry mechanism for failed processing

## Frontend Implementation Details

### State Management
- **React Query**: For server state management
- **Context API**: For global state (auth, theme, etc.)
- **Local State**: Component-specific state with useState

### Component Structure
- **Layout Components**: Page layouts, navigation, etc.
- **UI Components**: Buttons, cards, inputs, etc.
- **Feature Components**: Module-specific components
- **Page Components**: Full pages for routes

### Routing
- **React Router**: For client-side routing
- **Protected Routes**: Require authentication
- **Role-based Routes**: Require specific roles
- **Route Persistence**: Maintains current route during page reloads

### Performance Optimization
- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo for expensive components
- **Debouncing**: For search inputs and other frequent events
- **API Caching**: With React Query

## Environment Variables

### Frontend (.env)
- VITE_SUPABASE_URL: Supabase project URL
- VITE_SUPABASE_ANON_KEY: Supabase anonymous key
- VITE_API_URL: Backend API URL

### Backend (.env)
- SUPABASE_URL: Supabase project URL
- SUPABASE_SERVICE_KEY: Supabase service role key
- AZURE_OPENAI_API_KEY: Azure OpenAI API key
- AZURE_OPENAI_ENDPOINT: Azure OpenAI endpoint
- AZURE_OPENAI_API_VERSION: Azure OpenAI API version
- AZURE_OPENAI_EMBEDDING_MODEL: Azure OpenAI embedding model name
- AZURE_OPENAI_COMPLETION_MODEL: Azure OpenAI completion model name
- CORS_ORIGINS: Allowed origins for CORS

## Route Persistence Implementation

### Overview
The route persistence system ensures that users remain on their current page when refreshing the browser, providing a seamless user experience. This implementation follows industry best practices by separating authentication from navigation logic.

### Components
- **RoutePersistenceService**: Core service that manages route storage and retrieval
  - Stores routes in localStorage with special flags for page reloads
  - Provides methods to save, retrieve, and clear routes
  - Distinguishes between public and protected routes

- **NavigationGuard**: Component that preserves routes during navigation
  - Listens for beforeunload events to save the current route before page refresh
  - Uses a ref to track the current path without triggering re-renders

- **RouterInitializer**: Component that handles initial routing decisions
  - Detects page reloads using session storage flags
  - Restores the previous route after authentication
  - Prevents unwanted redirects during normal navigation

- **PageReloadDetection**: Hook that detects actual page reloads vs normal navigation
  - Uses session storage to track browser sessions
  - Provides a flag indicating when a page has been reloaded

### Implementation Details
- Routes are only saved during actual page reloads, not during normal navigation
- Special flags in sessionStorage distinguish between reloads and normal navigation
- The system respects authentication state while preserving navigation context
- Public routes (login, register, etc.) are excluded from persistence

## Known Issues and Solutions

### Circular Dependencies
- **Issue**: Circular dependency between SupabaseVersionControlService and SupabaseDocumentService
- **Solution**: Refactor services to use dependency injection or a service locator pattern

### Authentication Errors
- **Issue**: Supabase API response object doesn't have expected 'error' attribute
- **Solution**: Implement proper error handling with try/catch blocks and check response structure

### Performance Issues
- **Issue**: Too many API calls in role management UI
- **Solution**: Implement parallel data fetching and add database functions for efficient role statistics

## Future Enhancements

### Technical Improvements
- Implement CDN for faster document delivery
- Set up caching for frequently accessed documents
- Develop performance monitoring and analytics
- Implement auto-scaling for document processing workloads

### Feature Enhancements
- Advanced document collaboration features
- Real-time notifications system
- Mobile application development
- Integration with third-party services
- Advanced AI-powered insights and recommendations
