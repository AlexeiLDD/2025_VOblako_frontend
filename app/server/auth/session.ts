import type { AuthResponse, AuthUser } from "@/app/types/auth";
import { authStore } from "@/app/api/auth/store";
import { buildRemoteApiUrl, isRemoteApiEnabled } from "@/app/config/apiTarget";

const fetchRemoteSessionUser = async (sessionId: string) => {
  try {
    const response = await fetch(buildRemoteApiUrl("/auth/check"), {
      headers: {
        cookie: `session_id=${sessionId}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return undefined;
    }

    const payload = (await response.json()) as AuthResponse;

    if (!payload.is_auth || !payload.user) {
      return undefined;
    }

    return payload.user;
  } catch {
    return undefined;
  }
};

export const resolveSessionUser = async (sessionId?: string): Promise<AuthUser | undefined> => {
  if (!sessionId) {
    return undefined;
  }

  if (!isRemoteApiEnabled()) {
    return authStore.resolveSessionUser(sessionId);
  }

  return fetchRemoteSessionUser(sessionId);
};
