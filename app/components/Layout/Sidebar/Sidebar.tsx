import BrandCard from "./BrandCard";
import NavSection from "./NavSection";
import SidebarFooter from "./SidebarFooter";
import StorageCard from "./StorageCard";
import styles from "./Sidebar.module.css";
import type { SidebarItem } from "./types";

type SidebarProps = {
  primaryNav: SidebarItem[];
  secondaryNav: SidebarItem[];
  footerActions: SidebarItem[];
  onLogout?: () => void;
};

const Sidebar = ({ primaryNav, secondaryNav, footerActions, onLogout }: SidebarProps) => (
  <aside className={styles.sidebar}>
    <div className={styles.sidebarBrandDesktop}>
      <BrandCard />
    </div>
    <StorageCard />
    <nav className={styles.nav} aria-label="Основная навигация">
      <NavSection items={primaryNav} />
      <div className={styles.navDivider} />
      <NavSection items={secondaryNav} />
    </nav>
    <SidebarFooter actions={footerActions} onLogout={onLogout} />
  </aside>
);

export default Sidebar;
