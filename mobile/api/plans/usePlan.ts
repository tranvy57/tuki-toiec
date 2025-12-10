import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { api } from '~/libs/axios';

// Types for plan data
export interface PlanContent {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  type: 'strategy' | 'video' | 'quiz' | 'explanation' | 'vocabulary';
  content: string;
  order: number;
  isPremium: boolean;
  studyTaskId?: string; // ID của study task tương ứng với content này
}

export interface PlanLesson {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  name: string;
  description: string;
  level: string;
  order: number;
  studyTaskStatus: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'locked';
  studyTaskId?: string; // ID của study task tương ứng với lesson này
  contents: PlanContent[];
}

export interface PhaseLesson {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lesson: PlanLesson;
  order: number;
}

export interface PlanPhase {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  title: string;
  status: 'locked' | 'current' | 'completed';
  order: number;
  flag: string | null;
  startAt: string | null;
  completedAt: string | null;
  phaseLessons: PhaseLesson[];
}

export interface StudyPlan {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  title: string;
  band: number;
  durationDays: number;
  price: number;
  description: string;
  phases: PlanPhase[];
}

async function fetchMyPlan(): Promise<StudyPlan | null> {
  try {
    const res = await api.get('/plans/my-plan');
    if (!res.data || !res.data.data) return null;
    return res.data.data;
  } catch (error: any) {
    // If user doesn't have a plan, return null instead of throwing
    if (error.response?.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch study plan');
  }
}

async function fetchLatestCourse(): Promise<StudyPlan> {
  const res = await api.get('/courses/latest');
  if (!res.data) throw new Error('Failed to fetch latest course');
  return res.data.data;
}

async function fetchCourseById(id: string): Promise<StudyPlan> {
  const res = await api.get(`/courses/${id}`);
  if (!res.data) throw new Error('Failed to fetch course');
  return res.data.data;
}

export const useMyPlan = () => {
  return useQuery({
    queryKey: ['plans', 'my-plan'],
    queryFn: fetchMyPlan,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry if user doesn't have a plan (404)
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
};

export const useLatestCourse = () => {
  return useQuery({
    queryKey: ['courses', 'latest'],
    queryFn: fetchLatestCourse,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useCourseById = (id: string) => {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: () => fetchCourseById(id),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    enabled: !!id, // Only run query if id is provided
  });
};
