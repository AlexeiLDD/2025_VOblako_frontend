import { NextRequest, NextResponse } from "next/server";
import { isRemoteApiEnabled } from "@/app/config/apiTarget";
import { forwardToRemoteApi } from "@/app/api/utils/remoteProxy";
import { getMetadata } from "../../mockStore";
import { jsonError } from "../../responses";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  if (isRemoteApiEnabled()) {
    return forwardToRemoteApi(_request);
  }

  const metadata = getMetadata(params.id);
  if (!metadata) {
    return jsonError("Invalid ID format", 400);
  }

  return NextResponse.json(metadata);
}
