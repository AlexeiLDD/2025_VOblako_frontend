/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as getStorage } from "../route";
import { FILE_ALIAS_TO_ID } from "@/app/api/files/mockData";
import { __resetMockStore, deleteFile } from "@/app/api/files/mockStore";
import type { StorageResponse } from "@/app/types/storage";

vi.mock("@/app/config/apiTarget", () => ({
  isRemoteApiEnabled: () => false,
}));

vi.mock("@/app/api/utils/remoteProxy", () => ({
  forwardToRemoteApi: vi.fn(),
}));

const parseJson = async (response: Response) => response.json() as Promise<StorageResponse | { error: string }>;

describe("storage API mock route", () => {
  beforeEach(() => {
    __resetMockStore();
  });

  it("returns root contents by default", async () => {
    const response = await getStorage(new NextRequest("http://localhost/api/storage"));

    expect(response.status).toBe(200);
    const body = (await parseJson(response)) as StorageResponse;
    expect(body.id).toBe("root");
    expect(body.folders.length).toBeGreaterThan(0);
    expect(body.files.length).toBeGreaterThan(0);
  });

  it("builds breadcrumbs and nested folders for a valid path", async () => {
    const response = await getStorage(
      new NextRequest("http://localhost/api/storage?path=projects/design"),
    );

    expect(response.status).toBe(200);
    const body = (await parseJson(response)) as StorageResponse;
    expect(body.id).toBe("design");
    expect(body.breadcrumbs.map((b) => b.id)).toEqual(["root", "projects", "design"]);
    expect(body.folders).toEqual([]);
    expect(body.files.map((f) => f.label)).toContain("Moodboard.png");
  });

  it("returns 404 for unknown folder path", async () => {
    const response = await getStorage(
      new NextRequest("http://localhost/api/storage?path=does/not/exist"),
    );

    expect(response.status).toBe(404);
    const body = (await parseJson(response)) as { error: string };
    expect(body.error).toBe("Папка не найдена");
  });

  it("skips deleted files from results", async () => {
    const rootFileId = FILE_ALIAS_TO_ID["welcome-note"];
    deleteFile(rootFileId);

    const response = await getStorage(new NextRequest("http://localhost/api/storage"));
    expect(response.status).toBe(200);

    const body = (await parseJson(response)) as StorageResponse;
    const fileIds = body.files.map((f) => f.id);
    expect(fileIds).not.toContain(rootFileId);
  });
});
