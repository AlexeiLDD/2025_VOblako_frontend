import { NextRequest, NextResponse } from "next/server";
import { isRemoteApiEnabled } from "@/app/config/apiTarget";
import { forwardToRemoteApi } from "@/app/api/utils/remoteProxy";
import { listMetadata } from "../mockStore";
import { jsonError } from "../responses";
import type { FilesListOptions } from "@/app/types/files";

const isValidLimit = (value: unknown) =>
  value === undefined || (typeof value === "number" && Number.isFinite(value) && value >= 0);

const isValidOffset = (value: unknown) =>
  value === undefined || (typeof value === "number" && Number.isFinite(value) && value >= 0);

export async function POST(request: NextRequest) {
  if (isRemoteApiEnabled()) {
    return forwardToRemoteApi(request);
  }

  let payload: FilesListOptions;
  try {
    payload = (await request.json()) as FilesListOptions;
  } catch {
    return jsonError("Wrong JSON format", 400);
  }

  if (!isValidLimit(payload.limit) || !isValidOffset(payload.offset)) {
    return jsonError("Invalid URL params", 400);
  }

  const files = listMetadata(payload);
  return NextResponse.json(files);
}
