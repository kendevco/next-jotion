"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export const useSyncUserProfile = () => {
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      fetch('/api/syncUserProfile', { method: 'POST' });
    }
  }, [userId]);
};