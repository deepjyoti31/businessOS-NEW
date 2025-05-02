/**
 * This file contains singleton instances of document-related services.
 * It helps avoid circular dependencies between services.
 */

import { SupabaseDocumentService } from './SupabaseDocumentService';
import { SupabaseDocumentSharingService } from './SupabaseDocumentSharingService';
import { SupabaseVersionControlService } from './SupabaseVersionControlService';

// Create singleton instances
export const sharingService = new SupabaseDocumentSharingService();
export const versionControlService = new SupabaseVersionControlService();
export const documentService = new SupabaseDocumentService();

// Export default document service for backward compatibility
export default documentService;
