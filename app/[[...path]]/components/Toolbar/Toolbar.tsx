import QuickActions from "./QuickActions";
import TabsList from "./TabsList";
import ToolbarMeta from "./ToolbarMeta";
import styles from "./Toolbar.module.css";
import type { ToolbarProps } from "./types";

const Toolbar = ({
  tabs,
  quickActions,
  viewSwitchers,
  folderCount,
}: ToolbarProps) => (
  <section className={styles.toolbar} aria-label="Панель инструментов">
    <QuickActions actions={quickActions} />
    <TabsList tabs={tabs} />
    <ToolbarMeta folderCount={folderCount} viewSwitchers={viewSwitchers} />
  </section>
);

export default Toolbar;
