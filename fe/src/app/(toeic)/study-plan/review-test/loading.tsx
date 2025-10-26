import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Skeleton */}
          <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
          
          {/* Header Skeleton */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>

          {/* Cards Skeleton */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-3 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
            </div>
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-3 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
            </div>
          </div>

          {/* Test Coverage Skeleton */}
          <div className="border rounded-lg p-6 mb-8">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Button Skeleton */}
          <div className="text-center">
            <div className="h-12 bg-gray-200 rounded w-48 mx-auto animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-64 mx-auto mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}