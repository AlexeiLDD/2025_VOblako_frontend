"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import layoutStyles from "../page.module.css";
import { DropZone } from "./DropZone";
import { FoldersGrid, type Folder, type FileItem } from "./FoldersGrid";
import { FileUploadDialog, type UploadTask } from "./FileUploadDialog";
import type { FileMetadata } from "@/app/types/files";
import type { StorageResponse } from "@/app/types/storage";

type StorageInteractiveAreaProps = {
  folders: Folder[];
  files: FileItem[];
  dropZoneCopy: {
    highlightText: string;
    description: string;
  };
  storagePathParam?: string;
};

const generateTaskId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
};

const formatSize = (size: number) => {
  if (!size) {
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

const metadataToFileItem = (metadata: FileMetadata): FileItem => {
  const item: FileItem = {
    id: metadata.uuid,
    label: metadata.filename,
    meta: buildMeta(metadata),
  };

  if (metadata.content_type.startsWith("image/")) {
    item.preview = `/api/files/${metadata.uuid}`;
  }

  return item;
};

const getFileKey = (item: FileItem) => item.id ?? item.label;

const StorageInteractiveArea = ({
  folders,
  files: initialFiles,
  dropZoneCopy,
  storagePathParam,
}: StorageInteractiveAreaProps) => {
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileItems, setFileItems] = useState<FileItem[]>(initialFiles);

  useEffect(() => {
    setFileItems(initialFiles);
  }, [initialFiles]);

  const refreshFilesFromServer = useCallback(async () => {
    try {
      const query = storagePathParam ? `?path=${encodeURIComponent(storagePathParam)}` : "";
      const response = await fetch(`/api/storage${query}`, { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const payload = (await response.json()) as StorageResponse;
      const incoming = payload.files ?? [];
      setFileItems((prev) => {
        const serverKeys = new Set(incoming.map(getFileKey));
        const optimistic = prev.filter((item) => !serverKeys.has(getFileKey(item)));
        return [...optimistic, ...incoming];
      });
    } catch (error) {
      console.warn("Не удалось обновить список файлов:", error);
    }
  }, [storagePathParam]);

  const runUpload = useCallback(async (taskId: string, file: File) => {
    setUploadTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: "uploading", error: undefined } : task,
      ),
    );

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let message = "Не удалось загрузить файл. Попробуйте ещё раз.";
        try {
          const payload = await response.json();
          if (payload?.status) {
            message = payload.status;
          }
        } catch {
          // ignore parsing errors
        }
        throw new Error(message);
      }

      const metadata = (await response.json()) as FileMetadata;
      setUploadTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, status: "success" } : task)),
      );
      setFileItems((prev) => {
        const next = prev.filter((item) => item.id !== metadata.uuid);
        return [metadataToFileItem(metadata), ...next];
      });
      await refreshFilesFromServer();
    } catch (error) {
      setUploadTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: "error",
                error:
                  error instanceof Error
                    ? error.message
                    : "Неизвестная ошибка при загрузке файла",
              }
            : task,
        ),
      );
    }
  }, [refreshFilesFromServer]);

  const handleFilesSelected = useCallback(
    (filesToUpload: File[]) => {
      if (!filesToUpload.length) {
        return;
      }
      setIsDialogOpen(true);
      const tasks = filesToUpload.map<UploadTask>((file) => ({
        id: generateTaskId(),
        name: file.name || "Безымянный файл",
        size: file.size,
        status: "pending",
      }));
      setUploadTasks((prev) => [...prev, ...tasks]);
      tasks.forEach((task, index) => {
        void runUpload(task.id, filesToUpload[index]);
      });
    },
    [runUpload],
  );

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const filesList = event.target.files;
      if (!filesList) {
        return;
      }
      handleFilesSelected(Array.from(filesList));
      event.target.value = "";
    },
    [handleFilesSelected],
  );

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={handleInputChange}
      />
      <div className={layoutStyles.gridWrapper}>
        <FoldersGrid
          folders={folders}
          files={fileItems}
          onRequestUpload={openFileDialog}
        />
      </div>
      <div className={layoutStyles.stretchSection}>
        <DropZone
          highlightText={dropZoneCopy.highlightText}
          description={dropZoneCopy.description}
          onOpenFileDialog={openFileDialog}
          onFilesSelected={handleFilesSelected}
        />
      </div>
      <FileUploadDialog
        isOpen={isDialogOpen}
        tasks={uploadTasks}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default StorageInteractiveArea;
