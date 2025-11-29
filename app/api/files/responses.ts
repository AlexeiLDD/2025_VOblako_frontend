import { NextResponse } from "next/server";
import type { ErrorResponseStatus } from "@/app/types/files";

export const jsonError = (status: ErrorResponseStatus, statusCode = 400) =>
  NextResponse.json({ status }, { status: statusCode });

export const emptySuccess = () => NextResponse.json(null);
