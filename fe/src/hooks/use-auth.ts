import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { User } from "@/types";

/**
 * Custom hook for authentication with Zustand
 * Replaces Redux-based auth management
 */
export function useAuth() {
  const {
    // State
    user,
    accessToken,
    authenticated,
    loading,
    hydrated,
    error,
    
    // Actions
    setAccessToken,
    setUser,
    setLoading,
    setError,
    setAuthenticated,
    doLogin,
    doLoginGoogle,
    doLoginFacebook,
    doCheckToken,
    logout,
    reset,
    initializeAuth,
  } = useAuthStore();

  // Auto-initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Enhanced login with better error handling
  const login = useCallback(
    async (credentials: { username: string; password: string }) => {
      try {
        await doLogin(credentials);
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : "Login failed" 
        };
      }
    },
    [doLogin]
  );

  // Enhanced Google login
  const loginGoogle = useCallback(
    async (idToken: string) => {
      try {
        await doLoginGoogle(idToken);
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : "Google login failed" 
        };
      }
    },
    [doLoginGoogle]
  );

  // Enhanced Facebook login
  const loginFacebook = useCallback(
    async (accessToken: string) => {
      try {
        await doLoginFacebook(accessToken);
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : "Facebook login failed" 
        };
      }
    },
    [doLoginFacebook]
  );

  // Check if user has specific role
  const hasRole = useCallback(
    (roleName: "ADMIN" | "USER") => {
      return user?.roles?.some((role) => role.name === roleName);
    },
    [user]
  );

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return hasRole("ADMIN");
  }, [hasRole]);

  // Get user display name
  const getDisplayName = useCallback(() => {
    return user?.displayName || user?.username || "User";
  }, [user]);

  // Update user profile
  const updateUser = useCallback(
    (updatedUser: User) => {
      setUser(updatedUser);
      // Also update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
    },
    [setUser]
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  // Force refresh token check
  const refreshAuth = useCallback(async () => {
    await doCheckToken();
  }, [doCheckToken]);

  return {
    // State
    user,
    accessToken,
    authenticated,
    loading,
    hydrated,
    error,
    
    // Enhanced actions
    login,
    loginGoogle,
    loginFacebook,
    logout,
    reset,
    
    // Utility functions
    hasRole,
    isAdmin,
    getDisplayName,
    updateUser,
    clearError,
    refreshAuth,
    
    // Raw actions (if needed)
    setAccessToken,
    setUser,
    setLoading,
    setError,
    setAuthenticated,
  };
}

/**
 * Hook for auth selectors only (no actions)
 * Useful for components that only need to read auth state
 */
export function useAuthSelector() {
  const {
    user,
    accessToken,
    authenticated,
    loading,
    hydrated,
    error,
  } = useAuthStore();

  const hasRole = useCallback(
    (roleName: "ADMIN" | "USER") => {
      return user?.roles?.some((role) => role.name === roleName);
    },
    [user]
  );

  const isAdmin = useCallback(() => {
    return hasRole("ADMIN");
  }, [hasRole]);

  const getDisplayName = useCallback(() => {
    return user?.displayName || user?.username || "User";
  }, [user]);

  return {
    user,
    accessToken,
    authenticated,
    loading,
    error,
    hasRole,
    isAdmin,
    getDisplayName,
  };
}
