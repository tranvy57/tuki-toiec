"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/store-hook";
import { doCheckToken } from "@/store/slice/auth-slice";

export default function AppInit() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(doCheckToken());
  }, []);

  return null;
}
