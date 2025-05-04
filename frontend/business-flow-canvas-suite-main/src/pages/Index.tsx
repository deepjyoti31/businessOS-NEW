
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { RoutePersistenceService } from "@/services/RoutePersistenceService";

/**
 * Index page that handles initial redirection based on authentication status
 */
const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Use useEffect to handle navigation instead of relying on the render cycle
  useEffect(() => {
    if (!isLoading) {
      // Check for a stored route if the user is authenticated
      const storedRoute = RoutePersistenceService.getStoredRoute();
      const destination = isAuthenticated
        ? (storedRoute || "/dashboard")
        : "/login";

      console.log(`Index component useEffect redirecting to: ${destination}`);
      navigate(destination, { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Show loading UI until auth check is complete
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Loading...</h1>
          <p className="text-xl text-gray-600">Please wait while we check your authentication status.</p>
        </div>
      </div>
    );
  }

  // Provide a fallback UI instead of a direct Navigate component
  // This prevents rendering issues while the navigation happens in useEffect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Redirecting...</h1>
        <p className="text-xl text-gray-600">Please wait while we direct you to the right page.</p>
      </div>
    </div>
  );
};

export default Index;
