import styles from "./DropZone.module.css";

type DropZoneProps = {
  highlightText: string;
  description: string;
};

const DropZone = ({ highlightText, description }: DropZoneProps) => {
  return (
    <div className={styles.dropZone}>
      <p>
        <span>{highlightText}</span> {description}
      </p>
    </div>
  );
};

export default DropZone;
