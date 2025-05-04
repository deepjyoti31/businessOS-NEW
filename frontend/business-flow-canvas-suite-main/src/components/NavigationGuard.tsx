import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { RoutePersistenceService } from '@/services/RoutePersistenceService';

/**
 * Component to preserve routes during navigation
 * Only saves routes on beforeunload event to prevent interfering with normal navigation
 */
const NavigationGuard = () => {
  const location = useLocation();
  const currentPathRef = useRef(location.pathname);

  // Update the current path ref when location changes
  useEffect(() => {
    currentPathRef.current = location.pathname;
  }, [location.pathname]);

  // Save the current route only when the page is about to unload (refresh/close)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentPath = currentPathRef.current;

      // Only save non-public routes and use the special reload method
      if (!RoutePersistenceService.isPublicRoute(currentPath)) {
        console.log(`NavigationGuard: Saving route ${currentPath} before unload`);
        RoutePersistenceService.saveRouteForReload(currentPath);
      }
    };

    // Add event listener for beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null;
};

export default NavigationGuard;
