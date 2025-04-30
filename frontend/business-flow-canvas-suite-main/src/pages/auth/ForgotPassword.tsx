
import { useState } from "react";
import { Link } from "react-router-dom";
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
import { useAuth } from "@/contexts/SupabaseAuthContext";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ForgotPassword = () => {
  const { resetPassword, isLoading } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    try {
      await resetPassword(values.email);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Password reset error:", error);
      setError(error.message || "Failed to send reset instructions. Please try again.");
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
            Enter your email and we'll send you instructions to reset your password
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 border border-border">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {isSubmitted ? (
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
              <h3 className="text-lg font-medium mb-2">Check Your Email</h3>
              <p className="text-muted-foreground mb-4">
                We've sent you an email with instructions to reset your password.
                Please check your inbox and follow the link to complete the process.
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
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
                      Sending instructions...
                    </>
                  ) : (
                    "Send Reset Instructions"
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

export default ForgotPassword;
