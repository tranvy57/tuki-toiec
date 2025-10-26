"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InlineLoading } from '@/components/ui/loading';

interface LoadingState {
    id: string;
    message?: string;
    progress?: number;
}

interface LoadingContextType {
    showLoading: (id: string, message?: string) => void;
    hideLoading: (id: string) => void;
    updateProgress: (id: string, progress: number) => void;
    isLoading: (id?: string) => boolean;
    getLoadingMessage: (id: string) => string | undefined;
    clearAll: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoadingContext() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoadingContext must be used within a LoadingProvider');
    }
    return context;
}

interface LoadingProviderProps {
    children: React.ReactNode;
    showGlobalIndicator?: boolean;
}

export function LoadingProvider({
    children,
    showGlobalIndicator = true
}: LoadingProviderProps) {
    const [loadingStates, setLoadingStates] = useState<LoadingState[]>([]);

    const showLoading = useCallback((id: string, message?: string) => {
        setLoadingStates(prev => {
            const existing = prev.find(state => state.id === id);
            if (existing) {
                return prev.map(state =>
                    state.id === id ? { ...state, message } : state
                );
            }
            return [...prev, { id, message }];
        });
    }, []);

    const hideLoading = useCallback((id: string) => {
        setLoadingStates(prev => prev.filter(state => state.id !== id));
    }, []);

    const updateProgress = useCallback((id: string, progress: number) => {
        setLoadingStates(prev =>
            prev.map(state =>
                state.id === id ? { ...state, progress } : state
            )
        );
    }, []);

    const isLoading = useCallback((id?: string) => {
        if (id) {
            return loadingStates.some(state => state.id === id);
        }
        return loadingStates.length > 0;
    }, [loadingStates]);

    const getLoadingMessage = useCallback((id: string) => {
        return loadingStates.find(state => state.id === id)?.message;
    }, [loadingStates]);

    const clearAll = useCallback(() => {
        setLoadingStates([]);
    }, []);

    const contextValue: LoadingContextType = {
        showLoading,
        hideLoading,
        updateProgress,
        isLoading,
        getLoadingMessage,
        clearAll
    };

    const hasGlobalLoading = loadingStates.some(state =>
        state.id.startsWith('global-') || state.id.startsWith('page-')
    );

    return (
        <LoadingContext.Provider value={contextValue}>
            {children}

            {/* Global Loading Indicator */}
            {showGlobalIndicator && (
                <AnimatePresence>
                    {hasGlobalLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed top-4 right-4 z-50"
                        >
                            <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-3 flex items-center gap-3 min-w-48">
                                <InlineLoading size="sm" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {loadingStates.find(state =>
                                            state.id.startsWith('global-') || state.id.startsWith('page-')
                                        )?.message || 'Đang tải...'}
                                    </p>
                                    {loadingStates.some(state => state.progress !== undefined) && (
                                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                                            <motion.div
                                                className="bg-primary h-1 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: `${loadingStates.find(state => state.progress !== undefined)?.progress || 0}%`
                                                }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* Loading Overlay for page-level loading */}
            <AnimatePresence>
                {loadingStates.some(state => state.id.startsWith('page-overlay-')) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-center"
                    >
                        <div className="text-center">
                            <InlineLoading size="lg" />
                            <p className="mt-4 text-lg font-medium text-gray-900">
                                {loadingStates.find(state => state.id.startsWith('page-overlay-'))?.message || 'Đang tải...'}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </LoadingContext.Provider>
    );
}