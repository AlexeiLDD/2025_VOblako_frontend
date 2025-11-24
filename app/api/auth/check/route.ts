import { NextRequest, NextResponse } from "next/server";
import { authStore, buildAuthResponse } from "../store";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("session_id")?.value;
  const user = authStore.resolveSessionUser(sessionCookie);
  const payload = buildAuthResponse(user);

  return NextResponse.json(payload);
}
