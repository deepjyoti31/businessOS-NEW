import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/config/supabaseClient";
import { toast } from "sonner";

const formSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Check if we have a hash fragment in the URL (from Supabase password reset email)
  useEffect(() => {
    const checkHashParams = async () => {
      // Supabase automatically handles the hash parameters
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error checking session:", error);
        setError("Invalid or expired password reset link. Please try again.");
        toast.error("Invalid or expired password reset link");
        setTimeout(() => {
          navigate("/forgot-password");
        }, 3000);
      }

      if (!data.session) {
        console.log("No active session found for password reset");
      }
    };

    checkHashParams();
  }, [navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      toast.success("Password has been reset successfully");

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      console.error("Password update error:", error);
      setError(error.message || "Failed to reset password. Please try again.");
      toast.error("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-business-50 to-business-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-xl bg-business-600 text-white flex items-center justify-center text-2xl font-bold">
              B
            </div>
          </div>
          <h1 className="text-2xl font-bold text-business-900">Reset your password</h1>
          <p className="mt-2 text-business-600">
            Enter your new password below
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 border border-border">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {isSuccess ? (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Password Reset Complete</h3>
              <p className="text-muted-foreground mb-4">
                Your password has been reset successfully. You will be redirected to the login page.
              </p>
              <Button asChild className="w-full">
                <Link to="/login">Return to Login</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        At least 6 characters
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-business-600 hover:bg-business-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Resetting password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="text-sm text-business-600 hover:text-business-800"
                  >
                    Return to login
                  </Link>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
