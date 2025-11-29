import { NextRequest, NextResponse } from "next/server";
import type { LoginRequest } from "@/app/types/auth";
import { isRemoteApiEnabled } from "@/app/config/apiTarget";
import { authStore, buildAuthResponse, MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "../store";
import { jsonError, withSessionCookie } from "../utils";
import { forwardToRemoteApi } from "../../utils/remoteProxy";

const parseBody = async (request: NextRequest) => {
  try {
    return (await request.json()) as LoginRequest;
  } catch {
    return null;
  }
};

export async function POST(request: NextRequest) {
  if (isRemoteApiEnabled()) {
    return forwardToRemoteApi(request);
  }

  const sessionCookie = request.cookies.get("session_id")?.value;
  const authorizedUser = authStore.resolveSessionUser(sessionCookie);

  if (authorizedUser) {
    return jsonError("User already authorized");
  }

  const body = await parseBody(request);

  if (!body) {
    return jsonError("Wrong JSON format");
  }

  const { email, password } = body;

  if (
    !authStore.isValidEmail(email) ||
    typeof password !== "string"
  ) {
    return jsonError("Wrong JSON format");
  }

  if (
    password.length < MIN_PASSWORD_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    return jsonError("Password must have length between 8 and 32 symbols");
  }

  const user = authStore.resolveUserByEmail(email);

  if (!user || user.password !== password) {
    return jsonError("Wrong credentials");
  }

  const token = authStore.createSessionToken(authStore.toPublicUser(user));
  const response = NextResponse.json(buildAuthResponse(user));
  return withSessionCookie(token, response);
}
