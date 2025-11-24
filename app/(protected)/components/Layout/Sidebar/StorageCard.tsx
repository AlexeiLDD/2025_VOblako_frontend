import styles from "./Sidebar.module.css";

const StorageCard = () => (
  <div className={styles.storageCard}>
    <p className={styles.storageLabel}>Занято 0 байт из 4 ГБ</p>
    <div className={styles.progressTrack}>
      <div className={styles.progressValue} />
    </div>
    <div className={styles.storageLegend}>
      <span className={styles.legendDot} />
      <span>Облако</span>
      <span className={styles.legendValue}>0 байт</span>
    </div>
    <button type="button" className={styles.upgradeButton}>
      Увеличить место
    </button>
  </div>
);

export default StorageCard;
