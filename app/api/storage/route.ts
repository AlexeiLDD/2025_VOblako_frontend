import { NextRequest, NextResponse } from "next/server";
import { isRemoteApiEnabled } from "@/app/config/apiTarget";
import { resolveNode, type StorageFileRef } from "./data";
import type { StorageResponse, FileItem } from "@/app/types/storage";
import type { FileMetadata } from "@/app/types/files";
import { forwardToRemoteApi } from "../utils/remoteProxy";
import { getMetadata } from "../files/mockStore";

const formatSize = (size: number) => {
  if (size <= 0) {
    return "0 Б";
  }
  const units = ["Б", "КБ", "МБ", "ГБ"];
  let value = size;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const formatted = value >= 10 || unitIndex === 0 ? Math.round(value) : value.toFixed(1);
  return `${formatted} ${units[unitIndex]}`;
};

const buildMeta = (metadata: FileMetadata) => {
  const parts = metadata.filename.split(".");
  const ext = parts.length > 1 ? parts.pop()!.toUpperCase() : metadata.content_type.toUpperCase();
  return `${ext} • ${formatSize(metadata.size)}`;
};

const buildFileItems = (files?: StorageFileRef[]): FileItem[] => {
  if (!files?.length) {
    return [];
  }

  const items: FileItem[] = [];

  files.forEach((ref) => {
    const metadata = getMetadata(ref.fileId);
    if (!metadata || metadata.is_deleted) {
      return;
    }

    const item: FileItem = {
      id: metadata.uuid,
      label: metadata.filename,
      meta: buildMeta(metadata),
    };

    if (metadata.content_type.startsWith("image/")) {
      item.preview = `/api/files/${metadata.uuid}`;
    } else if (ref.preview) {
      item.preview = ref.preview;
    }

    items.push(item);
  });

  return items;
};

export async function GET(request: NextRequest) {
  if (isRemoteApiEnabled()) {
    return forwardToRemoteApi(request);
  }

  const { searchParams } = new URL(request.url);
  const pathParam = searchParams.get("path") ?? "";
  const pathIds = pathParam.split("/").filter(Boolean);

  const resolved = resolveNode(pathIds);

  if (!resolved) {
    return NextResponse.json({ error: "Папка не найдена" }, { status: 404 });
  }

  const { node, breadcrumbs } = resolved;

  const folders = node.folders?.map(({ id, label }) => ({ id, label })) ?? [];
  const files = buildFileItems(node.files);

  const payload: StorageResponse = {
    id: node.id,
    label: node.label,
    breadcrumbs,
    folders,
    files,
  };

  return NextResponse.json(payload);
}
