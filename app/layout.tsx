import clsx from "clsx";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import { ResponsiveShell } from "./components/Layout/ResponsiveShell";
import { type SidebarNavItem } from "./components/Layout/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VOblako — облачное хранилище",
  description: "Прототип интерфейса облачного хранилища VOblako.",
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={clsx(geistSans.variable, geistMono.variable)}>
        <div className={styles.page}>
          <ResponsiveShell
            primaryNav={PRIMARY_NAV}
            secondaryNav={SECONDARY_NAV}
            footerActions={FOOTER_ACTIONS}
            shellClassName={styles.shell}
            workspaceClassName={styles.workspace}
          >
            {children}
          </ResponsiveShell>
        </div>
      </body>
    </html>
  );
}
