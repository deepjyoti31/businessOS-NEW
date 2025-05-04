import { useEffect, useState } from 'react';

/**
 * Hook to detect page reloads vs normal navigation
 */
export function usePageReloadDetection() {
  const [isPageReload, setIsPageReload] = useState<boolean>(false);
  
  useEffect(() => {
    // Generate a unique session ID
    const sessionId = Math.random().toString(36).substring(2);
    
    // Check if we already have a session ID (indicating this is a reload)
    const existingSessionId = sessionStorage.getItem('businessos-session-id');
    const wasReload = existingSessionId !== null;
    
    // Store the new session ID
    sessionStorage.setItem('businessos-session-id', sessionId);
    
    // If this was a reload, set the flag
    if (wasReload) {
      sessionStorage.setItem('businessos-is-reload', 'true');
      setIsPageReload(true);
      console.log('PageReloadDetection: Detected page reload');
    }
    
    return () => {
      // Clean up reload flag on unmount
      sessionStorage.removeItem('businessos-is-reload');
    };
  }, []);
  
  return isPageReload;
}
