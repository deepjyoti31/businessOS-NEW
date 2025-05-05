import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase, User, Session } from "@/config/supabaseClient";
import { RoutePersistenceService } from "@/services/RoutePersistenceService";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AUTH_STORAGE_KEY = "businessos-user";
const SupabaseAuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Refs to track visibility changes and prevent unwanted redirects
  const isVisibilityChangeRef = useRef(false);
  const lastPathRef = useRef<string | null>(null);
  const initialSessionProcessedRef = useRef(false);

  // Convert Supabase user to our AuthUser format
  const convertSupabaseUser = (user: User): AuthUser => {
    console.log("Converting Supabase user:", user);

    // Create the user object
    const authUser: AuthUser = {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      role: user.user_metadata?.role || "User", // Default role
      avatar: user.user_metadata?.avatar_url || "/avatar-placeholder.png"
    };

    console.log("Created user object:", authUser);
    return authUser;
  };

  // Handle visibility change events
  useEffect(() => {
    // Function to handle visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // When the browser is minimized, store the current path
        lastPathRef.current = location.pathname;

        // Use the RoutePersistenceService to store the path
        if (!RoutePersistenceService.isPublicRoute(location.pathname)) {
          RoutePersistenceService.saveRoute(location.pathname);
        }
      } else if (document.visibilityState === 'visible') {
        // When the browser is restored, set the visibility change flag
        // This will completely block any navigation attempts
        isVisibilityChangeRef.current = true;

        // Reset the flag after a longer delay to ensure all auth events are processed
        setTimeout(() => {
          isVisibilityChangeRef.current = false;
        }, 5000);

        // Force the current path to stay the same using history API
        const storedRoute = RoutePersistenceService.getStoredRoute();
        if (storedRoute && storedRoute !== window.location.pathname) {
          window.history.replaceState(null, '', storedRoute);
        }
      }
    };

    // Add event listener for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname]);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsLoading(true);

        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setUser(null);
          return;
        }

        // Restore the last path if it exists using RoutePersistenceService
        // Only get routes that were saved during a reload
        const storedPath = RoutePersistenceService.getStoredRoute(true);
        if (storedPath) {
          lastPathRef.current = storedPath;
        }

        if (session?.user) {
          const authUser = convertSupabaseUser(session.user);
          setUser(authUser);

          // Store in localStorage for backward compatibility
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
            console.log("User data stored in localStorage");
          } catch (storageError) {
            console.error("Failed to store user data:", storageError);
          }

          // Mark that we've processed the initial session
          initialSessionProcessedRef.current = true;
        } else {
          // No session, check localStorage as fallback
          console.log("No Supabase session found, checking localStorage as fallback");

          try {
            const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);

            if (storedUser) {
              try {
                const parsedUser = JSON.parse(storedUser);
                console.log("Using stored user as fallback:", parsedUser.email);
                setUser(parsedUser);
              } catch (parseError) {
                console.error("Error parsing stored user:", parseError);
                setUser(null);
              }
            } else {
              console.log("No stored user found");
              setUser(null);
            }
          } catch (storageError) {
            console.error("Error accessing localStorage:", storageError);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Check if this is happening during a visibility change
        const isVisibilityEvent = isVisibilityChangeRef.current;

        // Only log if not a visibility event to reduce console noise
        if (!isVisibilityEvent) {
          console.log("Auth state changed:", event, session?.user?.email);
        }

        if (session?.user) {
          // Always update the user state, but don't navigate during visibility changes
          const authUser = convertSupabaseUser(session.user);
          setUser(authUser);

          // Store in localStorage for backward compatibility
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
          } catch (storageError) {
            console.error("Failed to store user data:", storageError);
          }

          // Only show toast on explicit sign-in (not INITIAL_SESSION),
          // but don't navigate - let RouterInitializer handle that
          if (event === 'SIGNED_IN' && !isVisibilityEvent) {
            toast.success("Login successful!");
            // Navigation is now handled by RouterInitializer
          }
        } else {
          // Always update the user state
          setUser(null);
          localStorage.removeItem(AUTH_STORAGE_KEY);

          // Only show toast on explicit sign-out,
          // but don't navigate - let RouterInitializer handle that
          if (event === 'SIGNED_OUT' && !isVisibilityEvent) {
            toast.info("You have been logged out.");
            // Navigation is now handled by RouterInitializer

            // Clear stored route on logout
            RoutePersistenceService.clearStoredRoute();
          }
        }
      }
    );

    // Check user on initial load
    checkUser();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Handle route protection - simplified as RouterInitializer now handles most navigation
  useEffect(() => {
    // Completely skip route protection during visibility changes
    if (isVisibilityChangeRef.current) {
      // Force the current path to stay the same using history API
      const storedPath = RoutePersistenceService.getStoredRoute() || lastPathRef.current;
      if (storedPath && storedPath !== window.location.pathname) {
        // Use history API directly to avoid React Router's navigation
        window.history.replaceState(null, '', storedPath);
      }
      return;
    }

    if (!isLoading) {
      const isPublicPath = RoutePersistenceService.isPublicRoute(location.pathname);

      // Store the current path for authenticated users on non-public paths
      // But don't use the reload-specific method as this is normal navigation
      if (user && !isPublicPath) {
        lastPathRef.current = location.pathname;
        // Don't save route during normal navigation to prevent interfering with user navigation
        // RoutePersistenceService.saveRoute(location.pathname);
      }

      // Basic protection for unauthenticated users trying to access protected routes
      // RouterInitializer handles the rest of the navigation logic
      if (!user && !isPublicPath) {
        navigate('/login', { replace: true });
      }
    }
  }, [user, isLoading, location.pathname, navigate]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      console.log("Login successful:", data);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(`Authentication failed: ${error.message || "Please try again."}`);
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: "Admin" // Set default role to Admin for new users
          }
        }
      });

      if (error) {
        throw error;
      }

      console.log("Registration successful:", data);

      // If email confirmation is required
      if (data.user && !data.user.confirmed_at) {
        toast.info("Please check your email to confirm your account.");
        navigate('/login');
      } else {
        // If email confirmation is not required, redirect to company setup
        toast.success("Registration successful! Please set up your company profile.");
        navigate('/dashboard/administration/company');
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(`Registration failed: ${error.message || "Please try again."}`);
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Clear local state
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);

      // Clear stored route
      RoutePersistenceService.clearStoredRoute();
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast.success("Password reset instructions sent to your email.");
    } catch (error: any) {
      toast.error(`Failed to reset password: ${error.message || "Please try again."}`);
      console.error("Password reset error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const authContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    resetPassword
  };

  console.log("SupabaseAuthProvider value:", {
    isAuthenticated: !!user,
    isLoading,
    userEmail: user?.email
  });

  return (
    <SupabaseAuthContext.Provider value={authContextValue}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a SupabaseAuthProvider");
  }
  return context;
}
