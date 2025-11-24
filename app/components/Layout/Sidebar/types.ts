import type { IconComponent } from "@/app/types";

export type SidebarIconName =
  | "folder"
  | "gallery"
  | "albums"
  | "lock"
  | "clock"
  | "users"
  | "favorite"
  | "trash"
  | "document"
  | "mail";

export type SidebarNavItem = {
  label: string;
  icon: SidebarIconName;
};

export type SidebarItem = {
  label: string;
  Icon: IconComponent;
};
