"use client";

import React, { useState } from "react";
import { useAuth, useAuthSelector } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, CheckCircle2, Loader2, LogOut, User, Shield } from "lucide-react";

/**
 * Example component demonstrating the new Zustand-based auth hook
 * This replaces the old Redux-based auth implementation
 */

// Login form component
export function LoginExample() {
  const { login, loginGoogle, loading, error, clearError } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const result = await login(credentials);
    if (result.success) {
      console.log("Login successful!");
      // Redirect or update UI
    } else {
      console.error("Login failed:", result.error);
    }
  };

  const handleGoogleLogin = async () => {
    // In real app, get idToken from Google OAuth
    const idToken = "mock-google-token";
    const result = await loginGoogle(idToken);
    if (result.success) {
      console.log("Google login successful!");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login Example</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center space-x-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
              disabled={loading}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              disabled={loading}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full"
        >
          Login with Google
        </Button>
      </CardContent>
    </Card>
  );
}

// User profile component using selector-only hook
export function UserProfileExample() {
  const { user, authenticated, isAdmin, hasRole, getDisplayName } = useAuthSelector();

  if (!authenticated) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Please log in to view your profile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>User Profile</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{getDisplayName().slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{getDisplayName()}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Role:</span>
            <Badge variant={isAdmin() ? "default" : "secondary"}>
              {isAdmin() && <Shield className="h-3 w-3 mr-1" />}
              {user?.role}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Status:</span>
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              <span className="text-sm text-green-500">Authenticated</span>
            </div>
          </div>
        </div>
        
        {/* Role-based content */}
        {hasRole("ADMIN") && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              🔧 Admin Panel Access Available
            </p>
          </div>
        )}
        
        {hasRole("USER") && (
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              📚 Student Dashboard Access
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Auth actions component
export function AuthActionsExample() {
  const { 
    authenticated, 
    loading, 
    logout, 
    refreshAuth, 
    clearError, 
    updateUser,
    user 
  } = useAuth();

  const handleLogout = () => {
    logout();
    console.log("Logged out successfully");
  };

  const handleRefreshAuth = async () => {
    await refreshAuth();
    console.log("Auth refreshed");
  };

  const handleUpdateProfile = () => {
    if (user) {
      const updatedUser = {
        ...user,
        displayName: "Updated Name",
      };
      updateUser(updatedUser);
    }
  };

  if (!authenticated) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auth Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={handleRefreshAuth}
            disabled={loading}
            size="sm"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Refresh Auth"
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={clearError}
            size="sm"
          >
            Clear Error
          </Button>
          
          <Button
            variant="outline"
            onClick={handleUpdateProfile}
            size="sm"
          >
            Update Profile
          </Button>
          
          <Button
            variant="destructive"
            onClick={handleLogout}
            size="sm"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Complete example page
export function AuthExamplePage() {
  const { authenticated } = useAuthSelector();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Auth System Example</h1>
        <p className="text-muted-foreground">
          Demonstrating Zustand-based authentication
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!authenticated && <LoginExample />}
        {authenticated && <UserProfileExample />}
        {authenticated && <AuthActionsExample />}
      </div>
      
      {/* Migration info */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            🔄 Migration Complete
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            This example shows the new Zustand-based auth system that replaces 
            the previous Redux Toolkit implementation. Key benefits include:
          </p>
          <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
            <li>Simpler API with direct function calls</li>
            <li>Better error handling with immediate returns</li>
            <li>Built-in utility functions (hasRole, isAdmin, etc.)</li>
            <li>Automatic auth initialization</li>
            <li>Smaller bundle size</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
