import { NextRequest } from "next/server";
import { isRemoteApiEnabled } from "@/app/config/apiTarget";
import { forwardToRemoteApi } from "@/app/api/utils/remoteProxy";
import { getMetadata, renameFile } from "../../mockStore";
import { emptySuccess, jsonError } from "../../responses";
import type { UpdateFilenameRequest } from "@/app/types/files";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function POST(request: NextRequest, { params }: RouteContext) {
  if (isRemoteApiEnabled()) {
    return forwardToRemoteApi(request);
  }

  let payload: UpdateFilenameRequest;
  try {
    payload = (await request.json()) as UpdateFilenameRequest;
  } catch {
    return jsonError("Wrong JSON format", 400);
  }

  const filename = typeof payload.filename === "string" ? payload.filename.trim() : "";
  if (!filename || filename.length > 50) {
    return jsonError("Filename must have length between 1 and 50", 400);
  }

  const metadata = getMetadata(params.id);
  if (!metadata) {
    return jsonError("Invalid ID format", 400);
  }

  if (metadata.is_deleted) {
    return jsonError("User have no access to this content", 403);
  }

  const renamed = renameFile(params.id, filename);
  if (!renamed) {
    return jsonError("Invalid ID format", 400);
  }

  return emptySuccess();
}
