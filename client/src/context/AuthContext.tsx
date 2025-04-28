import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Fetch current user on mount
  const { data, isLoading, isError } = useQuery({
    queryKey: [API_ENDPOINTS.CURRENT_USER],
    queryFn: getQueryFn<{ user: User } | null>({ on401: "returnNull" }),
    retry: false,
  });

  // Update user when data changes
  useEffect(() => {
    if (data) {
      setUser(data.user);
    } else {
      setUser(null);
    }
  }, [data]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string, password: string }) => {
      const res = await apiRequest("POST", API_ENDPOINTS.LOGIN, { username, password });
      return res.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard!",
      });
      setLocation("/admin");
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", API_ENDPOINTS.LOGOUT);
      return res.json();
    },
    onSuccess: () => {
      setUser(null);
      toast({
        title: "Logout successful",
        description: "You have been logged out",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred while logging out",
        variant: "destructive",
      });
    },
  });

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper for auth-aware queries
function getQueryFn<T>(options: {
  on401: "returnNull" | "throw";
}): () => Promise<T | null> {
  return async ({ queryKey }) => {
    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });
      
      if (options.on401 === "returnNull" && res.status === 401) {
        return null;
      }
      
      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
      
      return await res.json();
    } catch (error) {
      console.error("Query error:", error);
      throw error;
    }
  };
}
