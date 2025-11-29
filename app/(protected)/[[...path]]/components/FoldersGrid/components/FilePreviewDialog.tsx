"use client";

import { type MouseEvent, useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import {
  Icon24DownloadOutline,
  Icon24ShareOutline,
  Icon24Cancel,
} from "@vkontakte/icons";
import type { FileItem } from "@/app/types/storage";
import styles from "../FilePreviewDialog.module.css";

type FilePreviewDialogProps = {
  file: FileItem | null;
  onClose: () => void;
};

type PreviewState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "text"; content: string }
  | { status: "pdf"; url: string }
  | { status: "image"; url: string; alt: string };

const FilePreviewDialog = ({ file, onClose }: FilePreviewDialogProps) => {
  const [previewState, setPreviewState] = useState<PreviewState>({ status: "idle" });
  useEffect(() => {
    let objectUrl: string | null = null;

    if (!file) {
      setPreviewState({ status: "idle" });
      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }

    if (!file.id) {
      setPreviewState({
        status: "error",
        message: "Не удалось определить идентификатор файла. Попробуйте скачать его.",
      });
      return () => {};
    }

    const controller = new AbortController();

    const fetchPreview = async () => {
      setPreviewState({ status: "loading" });
      try {
        const response = await fetch(`/api/files/${file.id}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Не удалось загрузить файл для предпросмотра");
        }

        const contentType = response.headers.get("Content-Type") ?? "";
        if (contentType.startsWith("text/plain")) {
          const text = await response.text();
          setPreviewState({ status: "text", content: text });
          return;
        }

        if (contentType.startsWith("image/")) {
          const blob = await response.blob();
          objectUrl = URL.createObjectURL(blob);
          setPreviewState({ status: "image", url: objectUrl, alt: file.label });
          return;
        }

        if (contentType.includes("pdf")) {
          const blob = await response.blob();
          objectUrl = URL.createObjectURL(blob);
          setPreviewState({ status: "pdf", url: objectUrl });
          return;
        }

        setPreviewState({
          status: "error",
          message: "Этот формат пока нельзя показать. Скачайте файл, чтобы посмотреть его.",
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        setPreviewState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Не удалось загрузить файл. Попробуйте ещё раз.",
        });
      }
    };

    fetchPreview();

    return () => {
      controller.abort();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  useEffect(() => {
    if (!file) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [file, onClose]);

  if (!file) {
    return null;
  }

  const fileId = file.id;
  const canDownload = Boolean(fileId);

  const handleDownload = () => {
    if (!fileId) {
      return;
    }

    const link = document.createElement("a");
    link.href = `/api/files/${fileId}`;
    link.download = file.label;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const renderPreviewContent = () => {
    switch (previewState.status) {
      case "idle":
        return (
          <p className={styles.previewMessage}>
            Выберите файл, чтобы открыть предпросмотр. Здесь появится содержимое.
          </p>
        );
      case "loading":
        return <p className={clsx(styles.previewMessage, styles.previewMessageMuted)}>Загружаем файл…</p>;
      case "error":
        return <p className={clsx(styles.previewMessage, styles.previewError)}>{previewState.message}</p>;
      case "text":
        return <pre className={styles.previewStub}>{previewState.content}</pre>;
      case "pdf":
        return (
          <iframe
            src={previewState.url}
            className={styles.pdfViewer}
            title={`Предпросмотр PDF ${file.label}`}
          />
        );
      case "image":
        return (
          <div className={styles.imagePreviewFrame}>
            <Image
              src={previewState.url}
              alt={previewState.alt}
              fill
              sizes="(max-width: 900px) 90vw, 860px"
              className={styles.imagePreview}
              unoptimized
            />
          </div>
        );
      default:
        return null;
    }
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onMouseDown={handleBackdropClick}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={`Файл ${file.label}`}
      >
        <header className={styles.header}>
          <div>
            <p className={styles.fileName}>{file.label}</p>
            {file.meta ? <span className={styles.fileMeta}>{file.meta}</span> : null}
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.utilityButton}
              onClick={handleDownload}
              disabled={!canDownload}
            >
              <Icon24DownloadOutline />
              Скачать
            </button>
            <button type="button" className={styles.utilityButton}>
              <Icon24ShareOutline />
              Поделиться
            </button>
            <button
              type="button"
              className={clsx(styles.utilityButton, styles.closeButton)}
              aria-label="Закрыть предпросмотр файла"
              onClick={onClose}
            >
              <Icon24Cancel />
            </button>
          </div>
        </header>
        <div className={styles.previewArea}>
          {renderPreviewContent()}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewDialog;
