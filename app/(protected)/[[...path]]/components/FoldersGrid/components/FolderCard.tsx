import Link from "next/link";
import type { FolderItem } from "@/app/types/storage";
import styles from "../FoldersGrid.module.css";

type FolderCardProps = {
  folder: FolderItem;
  href?: string;
};

const FolderCard = ({ folder, href }: FolderCardProps) => {
  const content = (
    <div className={styles.folderButton}>
      <div className={styles.folderIcon} />
      <p>{folder.label}</p>
    </div>
  );

  return (
    <article className={styles.folderCard}>
      {href ? <Link href={href}>{content}</Link> : content}
    </article>
  );
};

export default FolderCard;
