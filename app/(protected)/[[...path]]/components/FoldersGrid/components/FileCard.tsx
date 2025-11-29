"use client";

import Image from "next/image";
import clsx from "clsx";
import styles from "../FoldersGrid.module.css";

const DEFAULT_PREVIEW = "/file.svg";
const EXTENSION_ICON_MAP: Record<string, string> = {
  pdf: "/window.svg",
  ppt: "/window.svg",
  pptx: "/window.svg",
  doc: "/globe.svg",
  docx: "/globe.svg",
  xls: "/globe.svg",
  xlsx: "/globe.svg",
  txt: "/file.svg",
};

const getDefaultIcon = (label: string) => {
  const ext = label.split(".").pop()?.toLowerCase();
  if (!ext) {
    return DEFAULT_PREVIEW;
  }
  return EXTENSION_ICON_MAP[ext] ?? DEFAULT_PREVIEW;
};

type FileCardProps = {
  label: string;
  meta?: string;
  preview?: string;
  onPreview?: () => void;
};

const FileCard = ({ label, meta, preview, onPreview }: FileCardProps) => {
  const defaultIcon = getDefaultIcon(label);
  const isDynamicPreview = Boolean(preview && preview.startsWith("/api/"));
  const previewSrc = isDynamicPreview ? preview! : preview ?? defaultIcon;
  const shouldFillPreview = isDynamicPreview;

  return (
    <button
      type="button"
      onClick={onPreview}
      className={clsx(styles.folderCard, styles.fileCard, styles.fileButton)}
    >
      <div
        className={clsx(
          styles.filePreview,
          shouldFillPreview && styles.filePreviewWithImage,
        )}
      >
        {shouldFillPreview ? (
          <div className={styles.filePreviewFill}>
            <Image
              src={previewSrc}
              alt={`Превью файла ${label}`}
              fill
              sizes="72px"
              className={clsx(styles.filePreviewImage, styles.filePreviewImageFill)}
              unoptimized={isDynamicPreview}
            />
          </div>
        ) : (
          <Image
            src={previewSrc}
            alt={`Превью файла ${label}`}
            width={72}
            height={72}
            className={styles.filePreviewImage}
          />
        )}
      </div>
      <div className={styles.fileMeta}>
        <p>{label}</p>
        {meta ? <span className={styles.fileFormat}>{meta}</span> : null}
      </div>
    </button>
  );
};

export default FileCard;
