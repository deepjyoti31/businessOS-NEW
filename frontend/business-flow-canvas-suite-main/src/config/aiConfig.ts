/**
 * Configuration for AI services (Azure OpenAI and Agno)
 */

export const aiConfig = {
  // Azure OpenAI Configuration
  azureOpenAI: {
    apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY || '',
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || '',
    apiVersion: import.meta.env.VITE_AZURE_OPENAI_API_VERSION || '2024-10-21',
    // Model deployments
    models: {
      completion: import.meta.env.VITE_AZURE_OPENAI_COMPLETION_MODEL || 'gpt-4o',
      embedding: import.meta.env.VITE_AZURE_OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
    }
  },

  // Agno Configuration
  agno: {
    // Path to Agno library (relative to project root)
    path: './agno-main',
    // Document processing settings
    documentProcessing: {
      maxFileSize: 50 * 1024 * 1024, // 50MB
      supportedFileTypes: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'text/csv',
        'text/markdown',
      ],
      // Processing options
      options: {
        extractText: true,
        generateSummary: true,
        extractEntities: true,
        classifyTopics: true,
        analyzeSentiment: true,
        generateEmbeddings: true,
      }
    }
  }
};

export default aiConfig;
