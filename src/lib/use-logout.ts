import { useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

/** Shared logout handler previously defined inline in App.tsx. */
export function useLogout() {
  const { signOut } = useAuth();
  return useCallback(async () => {
    await signOut();
  }, [signOut]);
}
