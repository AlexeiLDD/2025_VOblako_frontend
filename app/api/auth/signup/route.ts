import { NextRequest, NextResponse } from "next/server";
import type { SignupRequest } from "@/app/types/auth";
import { isRemoteApiEnabled } from "@/app/config/apiTarget";
import { authStore, buildAuthResponse, MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "../store";
import { jsonError, withSessionCookie } from "../utils";
import { forwardToRemoteApi } from "../../utils/remoteProxy";

const parseBody = async (request: NextRequest) => {
  try {
    return (await request.json()) as SignupRequest;
  } catch {
    return null;
  }
};

export async function POST(request: NextRequest) {
  if (isRemoteApiEnabled()) {
    return forwardToRemoteApi(request);
  }

  const body = await parseBody(request);

  if (!body) {
    return jsonError("Wrong JSON format");
  }

  const { email, password, password_repeat: passwordRepeat } = body;

  if (!authStore.isValidEmail(email)) {
    return jsonError("Wrong JSON format");
  }

  if (
    typeof password !== "string" ||
    typeof passwordRepeat !== "string"
  ) {
    return jsonError("Wrong JSON format");
  }

  if (
    password.length < MIN_PASSWORD_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    return jsonError("Password must have length between 8 and 32 symbols");
  }

  if (password !== passwordRepeat) {
    return jsonError("Passwords do not match");
  }

  if (authStore.resolveUserByEmail(email)) {
    return jsonError("User with this email already exists");
  }

  const user = authStore.createUser(email, password);
  const token = authStore.createSessionToken(authStore.toPublicUser(user));
  const payload = buildAuthResponse(user);
  const response = NextResponse.json(payload);
  return withSessionCookie(token, response);
}
