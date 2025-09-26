"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

/**
 * Auth Provider component that initializes authentication state
 * This replaces the Redux-based auth initialization
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { initializeAuth, loading } = useAuth();

  useEffect(() => {
    // Initialize auth state when the app starts
    initializeAuth();
  }, [initializeAuth]);

  // Optional: Show loading spinner while auth is initializing
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-toeic-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * HOC for protecting routes that require authentication
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { authenticated, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-toeic-primary"></div>
        </div>
      );
    }

    if (!authenticated) {
      // Redirect to login or show login modal
      window.location.href = "/login";
      return null;
    }

    return <Component {...props} />;
  };
}

/**
 * HOC for protecting routes that require admin role
 */
export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AdminAuthenticatedComponent(props: P) {
    const { authenticated, isAdmin, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-toeic-primary"></div>
        </div>
      );
    }

    if (!authenticated) {
      window.location.href = "/login";
      return null;
    }

    if (!isAdmin()) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
