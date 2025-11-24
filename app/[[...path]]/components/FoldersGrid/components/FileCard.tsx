import Image from "next/image";
import clsx from "clsx";
import styles from "../FoldersGrid.module.css";

const DEFAULT_PREVIEW = "/file.svg";

type FileCardProps = {
  label: string;
  meta?: string;
  preview?: string;
};

const FileCard = ({ label, meta, preview }: FileCardProps) => {
  const previewSrc = preview ?? DEFAULT_PREVIEW;
  const hasCustomPreview = Boolean(preview);

  return (
    <article className={clsx(styles.folderCard, styles.fileCard)}>
      <div
        className={clsx(
          styles.filePreview,
          hasCustomPreview && styles.filePreviewWithImage,
        )}
      >
        <Image
          src={previewSrc}
          alt={`Превью файла ${label}`}
          width={72}
          height={72}
          className={styles.filePreviewImage}
        />
      </div>
      <div className={styles.fileMeta}>
        <p>{label}</p>
        {meta ? <span className={styles.fileFormat}>{meta}</span> : null}
      </div>
    </article>
  );
};

export default FileCard;
