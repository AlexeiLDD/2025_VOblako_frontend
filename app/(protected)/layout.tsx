import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { type SidebarNavItem } from "@/app/(protected)/components/Layout/Sidebar";
import { authStore } from "@/app/api/auth/store";
import styles from "@/app/layout.module.css";
import ProtectedShell from "./ProtectedShell";

const PRIMARY_NAV: SidebarNavItem[] = [
  { label: "Все файлы", icon: "folder" },
  { label: "Галерея", icon: "gallery" },
  { label: "Альбомы", icon: "albums" },
  { label: "Личные документы", icon: "lock" },
];

const SECONDARY_NAV: SidebarNavItem[] = [
  { label: "Недавние", icon: "clock" },
  { label: "Совместные", icon: "users" },
  { label: "Избранные", icon: "favorite" },
  { label: "Корзина", icon: "trash" },
];

const FOOTER_ACTIONS: SidebarNavItem[] = [
  { label: "Документы", icon: "document" },
  { label: "Из почты", icon: "mail" },
];

const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
  const sessionId = (await cookies()).get("session_id")?.value;
  const user = authStore.resolveSessionUser(sessionId);

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <ProtectedShell
      primaryNav={PRIMARY_NAV}
      secondaryNav={SECONDARY_NAV}
      footerActions={FOOTER_ACTIONS}
      shellClassName={styles.shell}
      workspaceClassName={styles.workspace}
    >
      {children}
    </ProtectedShell>
  );
};

export default ProtectedLayout;
