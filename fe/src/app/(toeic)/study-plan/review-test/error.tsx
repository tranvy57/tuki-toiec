"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Home, Mail } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-red-200">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-red-800">
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-gray-600">
                <p className="mb-2">We encountered an error while loading the review test.</p>
                <p className="text-sm">
                  This might be a temporary issue. Please try refreshing the page or contact support if the problem persists.
                </p>
              </div>

              {process.env.NODE_ENV === "development" && (
                <div className="bg-gray-100 p-4 rounded-lg text-left">
                  <p className="text-sm font-mono text-gray-800 break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-gray-600 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={reset}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
              </div>

              <div className="border-t pt-6">
                <p className="text-sm text-gray-500 mb-2">
                  Still having trouble?
                </p>
                <Button variant="ghost" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}