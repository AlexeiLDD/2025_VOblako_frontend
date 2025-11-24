import styles from "./Sidebar.module.css";
import type { SidebarItem } from "./types";

type SidebarFooterProps = {
  actions: SidebarItem[];
};

const SidebarFooter = ({ actions }: SidebarFooterProps) => (
  <div className={styles.navFooter}>
    {actions.map(({ label, Icon }) => (
      <button key={label} type="button" className={styles.navFooterItem}>
        <Icon />
        {label}
      </button>
    ))}
  </div>
);

export default SidebarFooter;
