import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { RoutePersistenceService } from '@/services/RoutePersistenceService';
import { usePageReloadDetection } from '@/hooks/use-page-reload-detection';

/**
 * Component to handle initial routing decisions based on auth state and stored routes
 */
const RouterInitializer = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isPageReload = usePageReloadDetection();

  useEffect(() => {
    // Skip if still loading authentication
    if (isLoading) return;

    const currentPath = location.pathname;
    const isPublicRoute = RoutePersistenceService.isPublicRoute(currentPath);

    // Only restore routes on actual page reload, not during normal navigation
    if (isPageReload) {
      // Use the checkReloadFlag parameter to ensure we only get routes saved during reload
      const storedRoute = RoutePersistenceService.getStoredRoute(true);

      // Only navigate if we have a stored route and it's different from current
      if (isAuthenticated && storedRoute && storedRoute !== currentPath) {
        console.log(`RouterInitializer: Page reload detected - Navigating from ${currentPath} to stored route ${storedRoute}`);
        navigate(storedRoute, { replace: true });
        return; // Exit early to prevent other navigation logic
      }
    }

    // Handle basic auth protection
    if (isAuthenticated) {
      // User is authenticated on a public route (like login)
      if (isPublicRoute && currentPath !== '/') {
        console.log(`RouterInitializer: Authenticated user on public route ${currentPath}, navigating to dashboard`);
        navigate('/dashboard', { replace: true });
      }
    } else {
      // User is not authenticated trying to access protected route
      if (!isPublicRoute) {
        // Store the current route for after login
        RoutePersistenceService.saveRoute(currentPath);
        console.log(`RouterInitializer: Unauthenticated user on protected route, navigating to login`);
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate, isPageReload]);

  return null;
};

export default RouterInitializer;
