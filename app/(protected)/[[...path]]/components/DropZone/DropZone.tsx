"use client";

import { useCallback, useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import clsx from "clsx";
import styles from "./DropZone.module.css";

type DropZoneProps = {
  highlightText: string;
  description: string;
  onOpenFileDialog: () => void;
  onFilesSelected: (files: File[]) => void;
};

const DropZone = ({
  highlightText,
  description,
  onOpenFileDialog,
  onFilesSelected,
}: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDragEnter = useCallback(() => {
    dragCounter.current += 1;
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);
      const files = Array.from(event.dataTransfer?.files ?? []);
      if (files.length) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected],
  );

  const handleClick = useCallback(() => {
    onOpenFileDialog();
  }, [onOpenFileDialog]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onOpenFileDialog();
      }
    },
    [onOpenFileDialog],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      className={clsx(styles.dropZone, styles.dropZoneInteractive, isDragging && styles.dropZoneDragging)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      aria-label="Загрузите файлы через дроп-зону"
    >
      <p>
        <span>{highlightText}</span> {description}
      </p>
    </div>
  );
};

export default DropZone;
