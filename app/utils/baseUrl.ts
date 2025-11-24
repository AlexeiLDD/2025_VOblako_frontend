import { headers } from "next/headers";

export async function buildBaseUrl() {
  const headerList = await headers();
  const host = headerList.get("host");
  if (!host) {
    throw new Error("Host header is missing");
  }
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}
