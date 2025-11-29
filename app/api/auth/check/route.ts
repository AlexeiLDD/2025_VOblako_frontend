import { NextRequest, NextResponse } from "next/server";
import { isRemoteApiEnabled } from "@/app/config/apiTarget";
import { authStore, buildAuthResponse } from "../store";
import { forwardToRemoteApi } from "../../utils/remoteProxy";

export async function GET(request: NextRequest) {
  if (isRemoteApiEnabled()) {
    return forwardToRemoteApi(request);
  }

  const sessionCookie = request.cookies.get("session_id")?.value;
  const user = authStore.resolveSessionUser(sessionCookie);
  const payload = buildAuthResponse(user);

  return NextResponse.json(payload);
}
