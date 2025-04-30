import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase, User, Session } from "@/config/supabaseClient";

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
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (session?.user) {
          const authUser = convertSupabaseUser(session.user);
          setUser(authUser);
          
          // Store in localStorage for backward compatibility
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
          } catch (storageError) {
            console.error("Failed to store user data:", storageError);
          }
          
          if (event === 'SIGNED_IN') {
            toast.success("Login successful!");
            navigate('/dashboard');
          }
        } else {
          setUser(null);
          localStorage.removeItem(AUTH_STORAGE_KEY);
          
          if (event === 'SIGNED_OUT') {
            toast.info("You have been logged out.");
            navigate('/login');
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

  // Handle route protection
  useEffect(() => {
    if (!isLoading) {
      const publicPaths = ['/login', '/register', '/forgot-password', '/'];
      const isPublicPath = publicPaths.includes(location.pathname);

      if (!user && !isPublicPath) {
        console.log("User not authenticated, redirecting to login");
        navigate('/login', { replace: true });
      } else if (user && isPublicPath && location.pathname !== '/') {
        console.log("User is authenticated, redirecting to dashboard");
        navigate('/dashboard', { replace: true });
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
            role: "User" // Default role for new users
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
