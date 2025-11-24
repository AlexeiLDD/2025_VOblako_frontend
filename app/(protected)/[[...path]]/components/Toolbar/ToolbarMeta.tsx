import styles from "./Toolbar.module.css";
import type { QuickAction } from "./types";
import ViewSwitchers from "./ViewSwitchers";

type ToolbarMetaProps = {
  folderCount: number;
  viewSwitchers: QuickAction[];
};

const ToolbarMeta = ({ folderCount, viewSwitchers }: ToolbarMetaProps) => (
  <div className={styles.toolbarMeta}>
    <span className={styles.folderCount}>{folderCount} папки</span>
    <ViewSwitchers options={viewSwitchers} />
  </div>
);

export default ToolbarMeta;
