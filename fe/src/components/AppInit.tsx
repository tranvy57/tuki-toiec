"use client";

import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppInit() {
  const { authenticated, loading, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("auth:", authenticated, "loading:", loading, "hydrated:", hydrated);

    if (!hydrated) return; 

    if (!authenticated) {
      router.replace("/login"); 
    }
  }, [authenticated, hydrated, router]);

  return null;
}
