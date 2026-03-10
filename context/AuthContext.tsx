import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { apiRequest } from "@/lib/query-client";

export interface AuthUser {
  id: number;
  email: string;
  isPremium: boolean;
  premiumExpiresAt: string | null;
  hasLetters: boolean;
  hasUniversity: boolean;
  subscriptionStatus: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await apiRequest("GET", "/api/auth/me");
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest("GET", "/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await apiRequest("POST", "/api/auth/login", { email, password });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: "Login failed" };
    } catch (err: any) {
      const msg = err?.message || "Login failed";
      let parsed = "Invalid email or password";
      try {
        const jsonPart = msg.substring(msg.indexOf("{"));
        parsed = JSON.parse(jsonPart).message || parsed;
      } catch {}
      return { success: false, message: parsed };
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    try {
      const res = await apiRequest("POST", "/api/auth/register", { email, password });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: "Registration failed" };
    } catch (err: any) {
      const msg = err?.message || "Registration failed";
      let parsed = "Registration failed";
      try {
        const jsonPart = msg.substring(msg.indexOf("{"));
        parsed = JSON.parse(jsonPart).message || parsed;
      } catch {}
      return { success: false, message: parsed };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } catch {}
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
