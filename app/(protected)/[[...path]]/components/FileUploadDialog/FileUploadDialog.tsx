"use client";

import { useEffect, type MouseEvent } from "react";
import clsx from "clsx";
import {
  Icon24Cancel,
  Icon24CheckCircleOutline,
  Icon24CloudArrowUpOutline,
  Icon24ErrorCircleOutline,
} from "@vkontakte/icons";
import styles from "./FileUploadDialog.module.css";

export type UploadTaskStatus = "pending" | "uploading" | "success" | "error";

export type UploadTask = {
  id: string;
  name: string;
  size: number;
  status: UploadTaskStatus;
  error?: string;
};

type FileUploadDialogProps = {
  isOpen: boolean;
  tasks: UploadTask[];
  onClose: () => void;
};

const STATUS_LABELS: Record<UploadTaskStatus, string> = {
  pending: "В очереди",
  uploading: "Загружается…",
  success: "Готово",
  error: "Ошибка",
};

const STATUS_CLASSNAME: Record<UploadTaskStatus, string> = {
  pending: styles.statusPending,
  uploading: styles.statusUploading,
  success: styles.statusSuccess,
  error: styles.statusError,
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

const renderStatusIcon = (status: UploadTaskStatus) => {
  switch (status) {
    case "pending":
      return <Icon24CloudArrowUpOutline />;
    case "uploading":
      return <Icon24CloudArrowUpOutline />;
    case "success":
      return <Icon24CheckCircleOutline />;
    case "error":
      return <Icon24ErrorCircleOutline />;
    default:
      return null;
  }
};

const FileUploadDialog = ({ isOpen, tasks, onClose }: FileUploadDialogProps) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

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
        aria-label="Состояние загрузки файлов"
      >
        <header className={styles.header}>
          <p className={styles.title}>Загрузка файлов</p>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрыть окно загрузки"
          >
            <Icon24Cancel />
          </button>
        </header>
        <ul className={styles.taskList}>
          {tasks.map((task) => (
            <li key={task.id} className={styles.taskItem}>
              <div className={styles.taskHeader}>
                <p className={styles.taskName}>{task.name}</p>
                <span className={styles.taskMeta}>{formatSize(task.size)}</span>
              </div>
              <div className={clsx(styles.taskStatus, STATUS_CLASSNAME[task.status])}>
                {renderStatusIcon(task.status)}
                <span>{STATUS_LABELS[task.status]}</span>
              </div>
              {task.error ? <p className={styles.errorMessage}>{task.error}</p> : null}
            </li>
          ))}
        </ul>
        <p className={styles.footerHint}>
          Вы можете продолжить работу — файлы загружаются в фоне.
        </p>
      </div>
    </div>
  );
};

export default FileUploadDialog;
