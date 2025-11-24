import { NextResponse } from "next/server";
import type { ErrorResponse, ErrorStatus } from "@/app/types/auth";

export const jsonError = (status: ErrorStatus, statusCode = 400) =>
  NextResponse.json({ status } satisfies ErrorResponse, { status: statusCode });

export const withSessionCookie = (token: string, response: NextResponse) => {
  response.cookies.set({
    name: "session_id",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
};

export const clearSessionCookie = (response: NextResponse) => {
  response.cookies.set({
    name: "session_id",
    value: "",
    path: "/",
    maxAge: 0,
  });

  return response;
};
