import { NextRequest, NextResponse } from "next/server";
import { buildRemoteApiUrl, isRemoteApiEnabled } from "@/app/config/apiTarget";

const HOP_BY_HOP_REQUEST_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "content-length",
  "host",
]);

const HOP_BY_HOP_RESPONSE_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "content-length",
]);

const buildForwardHeaders = (request: NextRequest) => {
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (HOP_BY_HOP_REQUEST_HEADERS.has(key.toLowerCase())) {
      return;
    }

    headers.set(key, value);
  });

  return headers;
};

const applyResponseHeaders = (source: Headers, target: NextResponse) => {
  source.forEach((value, key) => {
    if (HOP_BY_HOP_RESPONSE_HEADERS.has(key.toLowerCase())) {
      return;
    }

    if (key.toLowerCase() === "set-cookie") {
      target.headers.append(key, value);
      return;
    }

    target.headers.set(key, value);
  });
};

export async function forwardToRemoteApi(request: NextRequest, overridePath?: string) {
  if (!isRemoteApiEnabled()) {
    throw new Error("forwardToRemoteApi was called while remote API is disabled");
  }

  const nextUrl = request.nextUrl;
  const path = overridePath ?? nextUrl.pathname.replace(/^\/api/, "");
  const search = nextUrl.search ?? "";
  const targetUrl = `${buildRemoteApiUrl(path)}${search}`;
  const shouldIncludeBody = !["GET", "HEAD"].includes(request.method);
  const body = shouldIncludeBody ? await request.text() : undefined;

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: buildForwardHeaders(request),
    body,
    cache: "no-store",
    redirect: "manual",
  });

  const nextResponse = new NextResponse(response.body, {
    status: response.status,
  });

  applyResponseHeaders(response.headers, nextResponse);

  return nextResponse;
}
