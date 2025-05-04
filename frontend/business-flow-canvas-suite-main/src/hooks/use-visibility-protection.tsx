import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RoutePersistenceService } from '@/services/RoutePersistenceService';

/**
 * A hook that prevents unwanted navigation when the browser window is minimized and restored
 * This provides an additional layer of protection beyond what's in the SupabaseAuthContext
 */
export function useVisibilityProtection() {
  const location = useLocation();

  useEffect(() => {
    // Store the current path
    const currentPath = location.pathname;
    let lastKnownPath = currentPath;

    // Function to handle visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // When the browser is minimized, store the current path
        lastKnownPath = window.location.pathname;

        // Use RoutePersistenceService to store the path
        // Don't use saveRouteForReload here as this isn't a page reload
        if (!RoutePersistenceService.isPublicRoute(window.location.pathname)) {
          RoutePersistenceService.saveRoute(window.location.pathname);
        }
      } else if (document.visibilityState === 'visible') {
        // When the browser is restored, force the path to stay the same
        const storedPath = RoutePersistenceService.getStoredRoute() || lastKnownPath;

        // Use a short timeout to let any pending navigation settle
        setTimeout(() => {
          const currentPath = window.location.pathname;
          if (storedPath && storedPath !== currentPath) {
            // Use history API directly to avoid React Router's navigation
            window.history.replaceState(null, '', storedPath);

            // Force a reload of the page content without refreshing
            window.dispatchEvent(new Event('popstate'));
          }
        }, 50);
      }
    };

    // Add event listener for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname]);
}
