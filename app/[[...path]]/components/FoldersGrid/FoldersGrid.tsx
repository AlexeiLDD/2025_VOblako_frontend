import clsx from "clsx";
import type { FileItem, FolderItem } from "@/app/types/storage";
import styles from "./FoldersGrid.module.css";
import FolderCard from "./components/FolderCard";
import FileCard from "./components/FileCard";

export type Folder = FolderItem;
export type FileCardItem = FileItem;

type FoldersGridProps = {
  folders: Folder[];
  files?: FileCardItem[];
  buildFolderHref?: (folder: Folder) => string;
};

const FoldersGrid = ({ folders, files = [], buildFolderHref }: FoldersGridProps) => (
  <section className={styles.folders} aria-label="Ваши документы">
    <CreateCard />
    {folders.map((folder) => (
      <FolderCard
        key={`folder-${folder.id}`}
        folder={folder}
        href={buildFolderHref?.(folder)}
      />
    ))}
    {files.map(({ id, label, meta, preview }) => (
      <FileCard
        key={`file-${id ?? label}`}
        label={label}
        meta={meta}
        preview={preview}
      />
    ))}
  </section>
);

const CreateCard = () => (
  <div className={clsx(styles.folderCard, styles.createCard)}>
    <div className={styles.createIcon}>+</div>
    <p>Создать или загрузить</p>
  </div>
);

export default FoldersGrid;
