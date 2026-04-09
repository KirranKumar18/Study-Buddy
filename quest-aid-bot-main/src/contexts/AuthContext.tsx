import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Schedule auto-refresh of the access token before it expires
  const scheduleTokenRefresh = useCallback((token: string) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    // Refresh 1 minute before expiry (tokens last 15 min, so refresh at 14 min)
    refreshTimerRef.current = setTimeout(async () => {
      await refreshAccessTokenFn();
    }, 14 * 60 * 1000);
  }, []);

  const refreshAccessTokenFn = useCallback(async (): Promise<string | null> => {
    const storedRefreshToken = localStorage.getItem("refresh_token");
    if (!storedRefreshToken) {
      setUser(null);
      setAccessToken(null);
      setIsLoading(false);
      return null;
    }

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: storedRefreshToken }),
      });

      if (!response.ok) {
        // Refresh token is invalid/expired — force logout
        localStorage.removeItem("refresh_token");
        setUser(null);
        setAccessToken(null);
        return null;
      }

      const data = await response.json();
      setUser(data.user);
      setAccessToken(data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      scheduleTokenRefresh(data.access_token);
      return data.access_token;
    } catch {
      localStorage.removeItem("refresh_token");
      setUser(null);
      setAccessToken(null);
      return null;
    }
  }, [scheduleTokenRefresh]);

  // Auto-login on mount if a refresh token exists
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshAccessTokenFn();
      setIsLoading(false);
    };
    initAuth();

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Login failed");
    }

    const data = await response.json();
    setUser(data.user);
    setAccessToken(data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    scheduleTokenRefresh(data.access_token);
  };

  const signup = async (username: string, email: string, password: string) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Signup failed");
    }

    const data = await response.json();
    setUser(data.user);
    setAccessToken(data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    scheduleTokenRefresh(data.access_token);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      } catch {
        // Silent fail — we still want to clear local state
      }
    }
    localStorage.removeItem("refresh_token");
    setUser(null);
    setAccessToken(null);
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        signup,
        logout,
        refreshAccessToken: refreshAccessTokenFn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
