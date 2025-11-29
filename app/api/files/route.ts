import { NextRequest, NextResponse } from "next/server";
import { isRemoteApiEnabled } from "@/app/config/apiTarget";
import { forwardToRemoteApi } from "@/app/api/utils/remoteProxy";
import { createFile } from "./mockStore";
import { jsonError } from "./responses";

export async function POST(request: NextRequest) {
  if (isRemoteApiEnabled()) {
    return forwardToRemoteApi(request);
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

  const metadata = await createFile(file);
  return NextResponse.json(metadata);
}
