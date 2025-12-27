import { render, screen } from "@testing-library/react";
import { vi, describe, it, beforeEach, expect } from "vitest";
import axios from "axios";
import StoragePage from "../page";
import type { StorageResponse } from "@/app/types/storage";

vi.mock("axios");

vi.mock("@/app/utils/baseUrl", () => ({
  buildBaseUrl: vi.fn().mockResolvedValue("http://localhost:3000"),
}));

const notFoundMock = vi.fn();
vi.mock("next/navigation", () => ({
  notFound: () => notFoundMock(),
}));

const mockAxiosGet = vi.mocked(axios.get);

const buildResponse = (overrides: Partial<StorageResponse> = {}): StorageResponse => ({
  id: "root",
  label: "Главная",
  breadcrumbs: [{ id: "root", label: "Главная" }],
  folders: [],
  files: [],
  ...overrides,
});

describe("StoragePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders root content and uses base URL for fetch", async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: buildResponse({ folders: [{ id: "f1", label: "Folder 1" }] }) });

    const view = await StoragePage({ params: Promise.resolve({ path: undefined }) });
    render(view);

    expect(mockAxiosGet).toHaveBeenCalledWith("http://localhost:3000/api/storage", {
      params: undefined,
    });

    expect(screen.getByLabelText("Панель инструментов")).toBeInTheDocument();
    expect(screen.getByText("Главная")).toBeInTheDocument();
    expect(screen.getByText("Folder 1")).toBeInTheDocument();
    expect(screen.getByText("Выделить все")).toBeInTheDocument();
  });

  it("builds breadcrumbs and folder hrefs for nested path", async () => {
    const response = buildResponse({
      breadcrumbs: [
        { id: "root", label: "Главная" },
        { id: "projects", label: "Проекты" },
        { id: "design", label: "Дизайн" },
      ],
      folders: [{ id: "assets", label: "Assets" }],
    });
    mockAxiosGet.mockResolvedValueOnce({ data: response });

    const view = await StoragePage({ params: Promise.resolve({ path: ["projects", "design"] }) });
    render(view);

    expect(mockAxiosGet).toHaveBeenCalledWith("http://localhost:3000/api/storage", {
      params: { path: "projects/design" },
    });

    expect(screen.getByRole("link", { name: "Главная" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Проекты" })).toHaveAttribute("href", "/projects");
    expect(screen.getByText("Дизайн", { selector: "span" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Assets" })).toHaveAttribute("href", "/projects/design/assets");
  });

  it("invokes notFound when storage fetch fails", async () => {
    mockAxiosGet.mockRejectedValueOnce(new Error("boom"));
    await expect(
      StoragePage({ params: Promise.resolve({ path: [] }) }),
    ).rejects.toThrow();

    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });
});
