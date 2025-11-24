import { NextResponse } from "next/server";
import { resolveNode } from "./data";
import type { StorageResponse } from "@/app/types/storage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pathParam = searchParams.get("path") ?? "";
  const pathIds = pathParam.split("/").filter(Boolean);

  const resolved = resolveNode(pathIds);

  if (!resolved) {
    return NextResponse.json({ error: "Папка не найдена" }, { status: 404 });
  }

  const { node, breadcrumbs } = resolved;

  const payload: StorageResponse = {
    id: node.id,
    label: node.label,
    breadcrumbs,
    folders: node.folders?.map(({ id, label }) => ({ id, label })) ?? [],
    files: node.files ?? [],
  };

  return NextResponse.json(payload);
}
