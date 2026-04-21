
"use client";

import { useEffect, useRef } from "react";
import { apiClient } from "@/src/lib/api/client";
import { getOrCreateSessionId } from "@/src/utils/session-id";

export function useTrackExperienceView(experienceId: string, isActive: boolean) {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (!isActive || !experienceId || hasTrackedRef.current) {
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        await apiClient.post("/experience-views", {
          experience_id: experienceId,
          session_id: getOrCreateSessionId(),
          watch_seconds: 2,
          completed: false,
        });
        hasTrackedRef.current = true;
      } catch {
        // silent fail for tracking
      }
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [experienceId, isActive]);
}