import styles from "./Sidebar.module.css";
import type { SidebarItem } from "./types";

type NavSectionProps = {
  items: SidebarItem[];
};

const NavSection = ({ items }: NavSectionProps) => (
  <ul className={styles.navGroup}>
    {items.map(({ label, Icon }) => (
      <li key={label}>
        <button type="button" className={styles.navItem}>
          <Icon />
          {label}
        </button>
      </li>
    ))}
  </ul>
);

export default NavSection;
