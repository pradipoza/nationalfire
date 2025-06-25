import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

const AdminLogin: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/admin");
    }
  }, [isAuthenticated, setLocation]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.username, values.password);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 2c.5 0 .9 0 1.4.1a4 4 0 0 1 3.5 3.5c.2 1 .1 2.2-.3 3.4a4 4 0 0 1 2.1 2.1c1.2-.4 2.3-.5 3.4-.3a4 4 0 0 1 3.5 3.5c.4 2.7-2.1 5.8-6.5 7.8-1.3.6-2.8 1-4.1 1.1-1.3.1-2.6 0-3.7-.4A4 4 0 0 1 9 21c-1.1.4-2.4.5-3.7.4-1.3-.1-2.8-.5-4.1-1.1-4.4-2-6.9-5.1-6.5-7.8a4 4 0 0 1 3.5-3.5c1.1-.2 2.3-.1 3.4.3a4 4 0 0 1 2.1-2.1c-.4-1.2-.5-2.3-.3-3.4a4 4 0 0 1 3.5-3.5c.5-.1.9-.1 1.4-.1Z" />
                <path d="M12 7c1.5 0 2.3.8 2.7 1.7" />
                <path d="M9.3 8.7c.4-.9 1.2-1.7 2.7-1.7" />
                <path d="M7.8 15.1c-1.1 0-2-.9-2-2 0-1.2.9-2 2-2h8.4c1.1 0 2 .9 2 2 0 1.1-.9 2-2 2" />
                <path d="M12 7v10" />
                <path d="M4.5 13a2.5 2.5 0 0 0 0-5" />
                <path d="M19.5 13a2.5 2.5 0 0 1 0-5" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-montserrat">
            National Fire
          </h1>
          <p className="text-gray-500">Admin Dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
