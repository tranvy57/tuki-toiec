// src/features/courses/queries.ts
import api from "@/libs/axios-config";
import { Course } from "@/types/implements/course";
import {
  useQuery,
  keepPreviousData,
  queryOptions,
} from "@tanstack/react-query";
import axios from "axios";


async function fetchCourses(): Promise<Course[]> {
  const res = await api.get("courses");
  if (!res.status) throw new Error("Failed to load courses");
  const data = res.data.data;
  return data;
}

export const coursesQueryOptions = () =>
  queryOptions({
    queryKey: ["courses", "all"],
    queryFn: fetchCourses,
    staleTime: 12 * 60 * 60 * 1000, 
    gcTime: 7 * 24 * 60 * 60 * 1000, 
    placeholderData: keepPreviousData,
  });

export function useCourses() {
  return useQuery(coursesQueryOptions());
}
