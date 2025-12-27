import { NextRequest, NextResponse } from "next/server";
import { isRemoteApiEnabled } from "@/app/config/apiTarget";
import { forwardToRemoteApi } from "@/app/api/utils/remoteProxy";
import { getMetadata } from "../../mockStore";
import { jsonError } from "../../responses";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const resolveParams = async (params: RouteContext["params"]) => params;

export async function GET(_request: NextRequest, context: RouteContext) {
  if (isRemoteApiEnabled()) {
    return forwardToRemoteApi(_request);
  }

  const { id } = await resolveParams(context.params);

  const metadata = getMetadata(id);
  if (!metadata) {
    return jsonError("Invalid ID format", 400);
  }

  return NextResponse.json(metadata);
}
