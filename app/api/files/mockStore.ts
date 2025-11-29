import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { FileMetadata, FilesListOptions } from "@/app/types/files";
import { FILE_SEEDS, type FileSeed } from "./mockData";

type StoredFile = {
  metadata: FileMetadata;
  content: Uint8Array;
};

const files = new Map<string, StoredFile>();
const DEFAULT_OWNER_ID = 101;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const MOCKS_DIRECTORY = path.join(process.cwd(), "app/api/files/mocks");

const textEncoder = new TextEncoder();

const nowIso = () => new Date().toISOString();

const ensureDeletedTime = (metadata: FileMetadata): FileMetadata => ({
  ...metadata,
  deleted_time: metadata.deleted_time ?? null,
});

const readSeedContent = (seed: FileSeed) => {
  if (seed.filePath) {
    try {
      const absolutePath = path.join(MOCKS_DIRECTORY, seed.filePath);
      return fs.readFileSync(absolutePath);
    } catch (error) {
      console.warn(`Не удалось прочитать mock-файл ${seed.filePath}:`, error);
      return textEncoder.encode(`Ошибка загрузки файла ${seed.filename}`);
    }
  }

  return textEncoder.encode(seed.content ?? "");
};

const seedIfEmpty = () => {
  if (files.size > 0) {
    return;
  }

  FILE_SEEDS.forEach((seed, index) => {
    const content = readSeedContent(seed);
    const timestamp = new Date(Date.now() - index * 15 * 60 * 1000).toISOString();
    const metadata: FileMetadata = {
      uuid: seed.uuid,
      owner_id: DEFAULT_OWNER_ID,
      filename: seed.filename,
      content_type: seed.contentType,
      size: content.byteLength,
      is_deleted: false,
      upload_time: timestamp,
      update_time: timestamp,
      deleted_time: null,
    };

    files.set(seed.uuid, { metadata, content });
  });
};

const clampLimit = (limit?: number) => {
  if (typeof limit !== "number" || Number.isNaN(limit)) {
    return DEFAULT_LIMIT;
  }

  if (limit < 0) {
    return 0;
  }

  return Math.min(limit, MAX_LIMIT);
};

const normalizeOffset = (offset?: number) => {
  if (typeof offset !== "number" || Number.isNaN(offset) || offset < 0) {
    return 0;
  }

  return offset;
};

const getStoredFile = (id: string) => {
  seedIfEmpty();
  return files.get(id) ?? null;
};

const readFileBytes = async (file: File) => new Uint8Array(await file.arrayBuffer());

const buildMetadataFromFile = async (file: File) => {
  const uuid = randomUUID();
  const uploadedAt = nowIso();
  const buffer = await readFileBytes(file);

  const metadata: FileMetadata = {
    uuid,
    owner_id: DEFAULT_OWNER_ID,
    filename: file.name || "Безымянный файл",
    content_type: file.type || "application/octet-stream",
    size: buffer.byteLength,
    is_deleted: false,
    upload_time: uploadedAt,
    update_time: uploadedAt,
    deleted_time: null,
  };

  return { metadata, content: buffer };
};

export const getMetadata = (id: string) => {
  const stored = getStoredFile(id);
  return stored ? ensureDeletedTime(stored.metadata) : null;
};

export const listMetadata = (options: FilesListOptions = {}) => {
  const { with_deleted = false } = options;
  const limit = clampLimit(options.limit);
  const offset = normalizeOffset(options.offset);

  seedIfEmpty();

  const allItems = Array.from(files.values())
    .filter((item) => with_deleted || !item.metadata.is_deleted)
    .sort(
      (a, b) =>
        new Date(b.metadata.update_time).getTime() -
        new Date(a.metadata.update_time).getTime(),
    )
    .map((item) => ensureDeletedTime(item.metadata));

  const slice = limit === 0 ? [] : allItems.slice(offset, offset + limit);

  return slice;
};

export const createFile = async (file: File) => {
  const stored = await buildMetadataFromFile(file);
  files.set(stored.metadata.uuid, stored);
  return ensureDeletedTime(stored.metadata);
};

export const replaceFileContents = async (id: string, file: File) => {
  const existing = getStoredFile(id);
  if (!existing) {
    return null;
  }

  const buffer = await readFileBytes(file);
  const updatedAt = nowIso();

  const updated: StoredFile = {
    metadata: {
      ...existing.metadata,
      filename: file.name || existing.metadata.filename,
      content_type: file.type || existing.metadata.content_type,
      size: buffer.byteLength,
      update_time: updatedAt,
      is_deleted: false,
      deleted_time: null,
    },
    content: buffer,
  };

  files.set(id, updated);
  return ensureDeletedTime(updated.metadata);
};

export const deleteFile = (id: string) => {
  const existing = getStoredFile(id);
  if (!existing) {
    return null;
  }

  const deletedAt = nowIso();
  existing.metadata.is_deleted = true;
  existing.metadata.deleted_time = deletedAt;
  existing.metadata.update_time = deletedAt;
  files.set(id, existing);

  return ensureDeletedTime(existing.metadata);
};

export const renameFile = (id: string, filename: string) => {
  const existing = getStoredFile(id);
  if (!existing) {
    return null;
  }

  existing.metadata.filename = filename;
  existing.metadata.update_time = nowIso();
  files.set(id, existing);

  return ensureDeletedTime(existing.metadata);
};

export const getFilePayload = (id: string) => {
  const existing = getStoredFile(id);
  if (!existing) {
    return null;
  }

  return {
    metadata: ensureDeletedTime(existing.metadata),
    content: existing.content,
  };
};
