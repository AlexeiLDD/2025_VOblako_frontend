"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { useCallback, useEffect, useId, useState } from "react";
import {
  Icon24ClockOutline,
  Icon24DocumentOutline,
  Icon24FavoriteOutline,
  Icon24FolderOutline,
  Icon24Gallery,
  Icon24MenuOutline,
  Icon24LockOutline,
  Icon24MailOutline,
  Icon24PlayCards2Outline,
  Icon24TrashSimpleOutline,
  Icon24Users3Outline,
} from "@vkontakte/icons";
import type { IconComponent } from "@/app/types";
import BrandCard from "../Sidebar/BrandCard";
import {
  Sidebar,
  type SidebarItem,
  type SidebarNavItem,
  type SidebarIconName,
} from "../Sidebar";
import styles from "./ResponsiveShell.module.css";

type ResponsiveShellProps = {
  primaryNav: SidebarNavItem[];
  secondaryNav: SidebarNavItem[];
  footerActions: SidebarNavItem[];
  shellClassName: string;
  workspaceClassName: string;
  children: ReactNode;
};

const ICON_MAP: Record<SidebarIconName, IconComponent> = {
  folder: Icon24FolderOutline,
  gallery: Icon24Gallery,
  albums: Icon24PlayCards2Outline,
  lock: Icon24LockOutline,
  clock: Icon24ClockOutline,
  users: Icon24Users3Outline,
  favorite: Icon24FavoriteOutline,
  trash: Icon24TrashSimpleOutline,
  document: Icon24DocumentOutline,
  mail: Icon24MailOutline,
};

const resolveNavItems = (items: SidebarNavItem[]): SidebarItem[] =>
  items.map(({ label, icon }) => ({
    label,
    Icon: ICON_MAP[icon],
  }));

const ResponsiveShell = ({
  primaryNav,
  secondaryNav,
  footerActions,
  shellClassName,
  workspaceClassName,
  children,
}: ResponsiveShellProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarId = useId();

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1100px)");

    const handleChange = () => {
      if (!mediaQuery.matches) {
        setIsSidebarOpen(false);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeSidebar, isSidebarOpen]);

  const shellClasses = clsx(shellClassName, styles.shell);
  const sidebarWrapperClasses = clsx(styles.sidebarWrapper, {
    [styles.sidebarOpen]: isSidebarOpen,
  });
  const overlayClasses = clsx(styles.mobileOverlay, {
    [styles.overlayVisible]: isSidebarOpen,
  });
  const resolvedPrimaryNav = resolveNavItems(primaryNav);
  const resolvedSecondaryNav = resolveNavItems(secondaryNav);
  const resolvedFooterActions = resolveNavItems(footerActions);

  return (
    <div className={shellClasses}>
      <div className={styles.brandHeader}>
        <button
          type="button"
          className={styles.headerMenuButton}
          aria-label="Открыть меню"
          aria-controls={sidebarId}
          aria-expanded={isSidebarOpen}
          onClick={() => setIsSidebarOpen(true)}
        >
          <Icon24MenuOutline />
        </button>
        <BrandCard variant="header" className={styles.brandHeaderCard} />
        <span className={styles.brandHeaderSpacer} aria-hidden />
      </div>
      <div className={sidebarWrapperClasses} id={sidebarId}>
        <div className={styles.sidebarHeader}>
          <span>Навигация</span>
          <button type="button" className={styles.mobileClose} onClick={closeSidebar}>
            Закрыть
          </button>
        </div>
        <Sidebar
          primaryNav={resolvedPrimaryNav}
          secondaryNav={resolvedSecondaryNav}
          footerActions={resolvedFooterActions}
        />
      </div>
      <div className={overlayClasses} onClick={closeSidebar} />
      <main className={workspaceClassName}>{children}</main>
    </div>
  );
};

export default ResponsiveShell;
