import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import FileUploadDialog, { type UploadTask } from "../FileUploadDialog";

const tasks: UploadTask[] = [
  { id: "1", name: "report.pdf", size: 2048, status: "pending" },
  { id: "2", name: "photo.png", size: 4096, status: "uploading" },
  { id: "3", name: "notes.txt", size: 1024, status: "success" },
  { id: "4", name: "bad.zip", size: 512, status: "error", error: "Network error" },
];

const renderDialog = (isOpen = true, onClose = vi.fn()) =>
  render(<FileUploadDialog isOpen={isOpen} tasks={tasks} onClose={onClose} />);

describe("FileUploadDialog", () => {
  it("renders nothing when closed", () => {
    const { container } = renderDialog(false);
    expect(container.firstChild).toBeNull();
  });

  it("shows task list with statuses and sizes", () => {
    renderDialog();

    expect(screen.getByRole("dialog", { name: "Состояние загрузки файлов" })).toBeInTheDocument();
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
    expect(screen.getByText((text) => text.includes("2.0 КБ"))).toBeInTheDocument();
    expect(screen.getByText("Загружается…")).toBeInTheDocument();
    expect(screen.getByText("Готово")).toBeInTheDocument();
    expect(screen.getByText("Ошибка")).toBeInTheDocument();
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("closes on close button, escape key, and backdrop click", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = renderDialog(true, onClose);

    const closeBtn = screen.getByRole("button", { name: "Закрыть окно загрузки" });
    await user.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(2);

    const overlay = container.firstChild as HTMLElement;
    fireEvent.mouseDown(overlay, { target: overlay });
    expect(onClose).toHaveBeenCalledTimes(3);
  });
});
