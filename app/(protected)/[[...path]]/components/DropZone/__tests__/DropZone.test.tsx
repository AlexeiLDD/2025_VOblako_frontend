import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DropZone from "../DropZone";

const renderZone = (onOpenFileDialog = vi.fn(), onFilesSelected = vi.fn()) =>
  render(
    <DropZone
      highlightText="Нажмите"
      description="или перенесите файлы"
      onOpenFileDialog={onOpenFileDialog}
      onFilesSelected={onFilesSelected}
    />,
  );

describe("DropZone", () => {
  it("triggers file dialog on click and keyboard", () => {
    const openDialog = vi.fn();
    renderZone(openDialog);

    const zone = screen.getByRole("button", { name: /дроп-зону/i });
    fireEvent.click(zone);
    fireEvent.keyDown(zone, { key: "Enter" });
    fireEvent.keyDown(zone, { key: " " });

    expect(openDialog).toHaveBeenCalledTimes(3);
  });

  const createDataTransfer = (files: File[] = []) => {
    const fileList = [...files];
    return {
      files: fileList,
      items: {
        add: (file: File) => fileList.push(file),
      },
      dropEffect: "copy",
    };
  };

  it("adds dragging class and clears it on drop", () => {
    const { container } = renderZone();
    const zone = screen.getByRole("button", { name: /дроп-зону/i });

    const dataTransfer = createDataTransfer();
    fireEvent.dragEnter(zone, { dataTransfer });
    expect(zone.className).toContain("dropZoneDragging");

    fireEvent.drop(zone, { dataTransfer });
    expect(zone.className).not.toContain("dropZoneDragging");
  });

  it("passes dropped files to handler", () => {
    const onFilesSelected = vi.fn();
    renderZone(vi.fn(), onFilesSelected);

    const zone = screen.getByRole("button", { name: /дроп-зону/i });
    const dataTransfer = createDataTransfer();
    const file = new File(["hello"], "hello.txt", { type: "text/plain" });
    dataTransfer.items.add(file);

    fireEvent.drop(zone, { dataTransfer });

    expect(onFilesSelected).toHaveBeenCalledTimes(1);
    const [[files]] = onFilesSelected.mock.calls;
    expect(files[0].name).toBe("hello.txt");
  });
});
