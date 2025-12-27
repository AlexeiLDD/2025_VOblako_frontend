/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { FILE_ALIAS_TO_ID } from "../mockData";
import {
  __resetMockStore,
  getFilePayload,
  getMetadata,
} from "../mockStore";
import { GET as getFile } from "../[id]/route";
import { GET as getMeta } from "../[id]/meta/route";
import { POST as listFiles } from "../list/route";
import { POST as renameFile } from "../[id]/name/route";
import { POST as createFile } from "../route";

vi.mock("@/app/config/apiTarget", () => ({
  isRemoteApiEnabled: () => false,
}));

vi.mock("@/app/api/utils/remoteProxy", () => ({
  forwardToRemoteApi: vi.fn(),
}));

const buildContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

describe("files API mock routes", () => {
  beforeEach(() => {
    __resetMockStore();
  });

  it("returns metadata for existing file", async () => {
    const id = FILE_ALIAS_TO_ID["welcome-note"];
    const response = await getMeta(
      new NextRequest(`http://localhost/api/files/${id}/meta`),
      buildContext(id),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.uuid).toBe(id);
    expect(body.filename).toBeTruthy();
  });

  it("rejects unknown id with 400", async () => {
    const response = await getMeta(
      new NextRequest("http://localhost/api/files/unknown/meta"),
      buildContext("unknown"),
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.status).toBe("Invalid ID format");
  });

  it("returns file payload with correct headers", async () => {
    const id = FILE_ALIAS_TO_ID["welcome-note"];
    const response = await getFile(
      new NextRequest(`http://localhost/api/files/${id}`),
      buildContext(id),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/plain");
    expect(response.headers.get("Content-Disposition")).toContain("filename*=");

    const buffer = Buffer.from(await response.arrayBuffer());
    expect(buffer.toString("utf-8")).toContain("VOblako");
  });

  it("validates list payload", async () => {
    const badPayload = { limit: "oops" };
    const request = new NextRequest("http://localhost/api/files/list", {
      method: "POST",
      body: JSON.stringify(badPayload),
      headers: { "content-type": "application/json" },
    });

    const response = await listFiles(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.status).toBe("Invalid URL params");
  });

  it("renames file when payload is valid", async () => {
    const id = FILE_ALIAS_TO_ID["welcome-note"];
    const request = new NextRequest(`http://localhost/api/files/${id}/name`, {
      method: "POST",
      body: JSON.stringify({ filename: "new-name.txt" }),
      headers: { "content-type": "application/json" },
    });

    const response = await renameFile(request, buildContext(id));
    expect(response.status).toBe(200);

    const metadata = getMetadata(id);
    expect(metadata?.filename).toBe("new-name.txt");
  });

  it("rejects empty filename on rename", async () => {
    const id = FILE_ALIAS_TO_ID["welcome-note"];
    const request = new NextRequest(`http://localhost/api/files/${id}/name`, {
      method: "POST",
      body: JSON.stringify({ filename: " " }),
      headers: { "content-type": "application/json" },
    });

    const response = await renameFile(request, buildContext(id));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.status).toBe("Filename must have length between 1 and 50");
  });

  it("creates a new file from form-data", async () => {
    const file = new File(["hello world"], "hello.txt", { type: "text/plain" });
    const formData = new FormData();
    formData.set("file", file);

    const request = new NextRequest("http://localhost/api/files", {
      method: "POST",
      body: formData,
    });

    const response = await createFile(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.filename).toBe("hello.txt");
    expect(body.content_type).toBe("text/plain");

    const stored = getFilePayload(body.uuid);
    expect(stored?.metadata.filename).toBe("hello.txt");
    expect(stored?.content.byteLength).toBe(file.size);
  });
});
