"use client";

import { useCallback, useState } from "react";
import clsx from "clsx";
import type { FileItem, FolderItem } from "@/app/types/storage";
import styles from "./FoldersGrid.module.css";
import FolderCard from "./components/FolderCard";
import FileCard from "./components/FileCard";
import FilePreviewDialog from "./components/FilePreviewDialog";

export type Folder = FolderItem & { href?: string };
export type FileCardItem = FileItem;

type FoldersGridProps = {
  folders: Folder[];
  files?: FileCardItem[];
  onRequestUpload?: () => void;
};

const FoldersGrid = ({ folders, files = [], onRequestUpload }: FoldersGridProps) => {
  const [selectedFile, setSelectedFile] = useState<FileCardItem | null>(null);

  const handlePreview = useCallback((file: FileCardItem) => {
    setSelectedFile(file);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <>
      <section className={styles.folders} aria-label="Ваши документы">
        <CreateCard onRequestUpload={onRequestUpload} />
        {folders.map((folder) => (
          <FolderCard
            key={`folder-${folder.id}`}
            folder={folder}
            href={folder.href}
          />
        ))}
        {files.map((file) => (
          <FileCard
            key={`file-${file.id ?? file.label}`}
            label={file.label}
            meta={file.meta}
            preview={file.preview}
            onPreview={() => handlePreview(file)}
          />
        ))}
      </section>
      <FilePreviewDialog file={selectedFile} onClose={handleCloseDialog} />
    </>
  );
};

type CreateCardProps = {
  onRequestUpload?: () => void;
};

const CreateCard = ({ onRequestUpload }: CreateCardProps) => (
  <button
    type="button"
    onClick={onRequestUpload}
    className={clsx(styles.folderCard, styles.createCard, styles.createCardButton)}
  >
    <div className={styles.createIcon}>+</div>
    <p>Загрузить документы</p>
  </button>
);

export default FoldersGrid;
