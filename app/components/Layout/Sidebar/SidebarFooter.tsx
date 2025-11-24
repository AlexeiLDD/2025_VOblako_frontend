import clsx from "clsx";
import styles from "./Sidebar.module.css";
import type { SidebarItem } from "./types";

type SidebarFooterProps = {
  actions: SidebarItem[];
  onLogout?: () => void;
};

const SidebarFooter = ({ actions, onLogout }: SidebarFooterProps) => (
  <div className={styles.navFooter}>
    {actions.map(({ label, Icon }) => (
      <button key={label} type="button" className={styles.navFooterItem}>
        <Icon />
        {label}
      </button>
    ))}
    {onLogout && (
      <button
        type="button"
        className={clsx(styles.navFooterItem, styles.logoutButton)}
        onClick={onLogout}
      >
        Выйти
      </button>
    )}
  </div>
);

export default SidebarFooter;
