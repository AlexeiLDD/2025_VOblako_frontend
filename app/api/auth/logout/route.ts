import { NextRequest, NextResponse } from "next/server";
import { authStore } from "../store";
import { clearSessionCookie, jsonError } from "../utils";

export async function POST(request: NextRequest) {
  const sessionCookie = request.cookies.get("session_id")?.value;
  const user = authStore.resolveSessionUser(sessionCookie);

  if (!sessionCookie || !user) {
    return jsonError("User not authorized", 401);
  }

  authStore.clearSession(sessionCookie);
  const response = NextResponse.json(null);
  return clearSessionCookie(response);
}
