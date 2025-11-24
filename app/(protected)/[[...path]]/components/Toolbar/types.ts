import type { IconComponent } from "@/app/types";

export type Tab = {
  label: string;
  href?: string;
  current?: boolean;
};

export type QuickAction = {
  label: string;
  Icon: IconComponent;
};

export type ToolbarProps = {
  tabs: Tab[];
  quickActions: QuickAction[];
  viewSwitchers: QuickAction[];
  folderCount: number;
};
