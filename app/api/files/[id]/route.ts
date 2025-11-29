import { NextRequest, NextResponse } from "next/server";
import { isRemoteApiEnabled } from "@/app/config/apiTarget";
import { forwardToRemoteApi } from "@/app/api/utils/remoteProxy";
import {
  deleteFile,
  getFilePayload,
  getMetadata,
  replaceFileContents,
} from "../mockStore";
import { emptySuccess, jsonError } from "../responses";

const ensureAvailableFile = (id: string) => {
  const metadata = getMetadata(id);
  if (!metadata) {
    return jsonError("Invalid ID format", 400);
  }

  if (metadata.is_deleted) {
    return jsonError("User have no access to this content", 403);
  }

  return null;
};

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const resolveParams = async (params: RouteContext["params"]) => params;

export async function GET(request: NextRequest, context: RouteContext) {
  if (isRemoteApiEnabled()) {
    return forwardToRemoteApi(request);
  }

  const { id } = await resolveParams(context.params);

  const payload = getFilePayload(id);
  if (!payload) {
    return jsonError("Invalid ID format", 400);
  }

  if (payload.metadata.is_deleted) {
    return jsonError("User have no access to this content", 403);
  }

  const response = new NextResponse(payload.content, {
    headers: {
      "Content-Type": payload.metadata.content_type,
      "Content-Length": String(payload.metadata.size),
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(payload.metadata.filename)}`,
    },
  });

  return response;
}

export async function POST(request: NextRequest, context: RouteContext) {
  if (isRemoteApiEnabled()) {
    return forwardToRemoteApi(request);
  }

  const { id } = await resolveParams(context.params);

  const availabilityError = ensureAvailableFile(id);
  if (availabilityError) {
    return availabilityError;
  }

  let file: File | null = null;
  try {
    const formData = await request.formData();
    const rawFile = formData.get("file");
    if (rawFile instanceof File) {
      file = rawFile;
    }
  } catch {
    return jsonError("Wrong form format", 400);
  }

  if (!file) {
    return jsonError("Wrong form format", 400);
  }

  const updated = await replaceFileContents(id, file);
  if (!updated) {
    return jsonError("Invalid ID format", 400);
  }

  return emptySuccess();
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (isRemoteApiEnabled()) {
    return forwardToRemoteApi(request);
  }

  const { id } = await resolveParams(context.params);

  const metadata = deleteFile(id);
  if (!metadata) {
    return jsonError("Invalid ID format", 400);
  }

  return emptySuccess();
}
