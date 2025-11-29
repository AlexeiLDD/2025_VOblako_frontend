export const dynamic = "force-dynamic";

import {
  Icon24ChainOutline,
  Icon24CheckCircleOutline,
  Icon24ChevronDown,
  Icon24DeleteOutline,
  Icon24Filter,
  Icon24Grid4UnevenVerticalOutline,
  Icon24UsersOutline,
} from "@vkontakte/icons";
import axios from "axios";
import { notFound } from "next/navigation";
import type { QuickAction } from "./components/Toolbar";
import { Toolbar } from "./components/Toolbar";
import {
  WorkspaceFooter,
  type FooterLink,
} from "./components/WorkspaceFooter";
import StorageInteractiveArea from "./components/StorageInteractiveArea";
import type { StorageResponse } from "@/app/types/storage";
import { buildBaseUrl } from "@/app/utils/baseUrl";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{
    path?: string[];
  }>;
};

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Выделить все", Icon: Icon24CheckCircleOutline },
  { label: "Получить ссылку", Icon: Icon24ChainOutline },
  { label: "Настроить доступ", Icon: Icon24UsersOutline },
  { label: "Переместить в корзину", Icon: Icon24DeleteOutline },
];

const VIEW_SWITCHERS: QuickAction[] = [
  { label: "Плитка", Icon: Icon24Grid4UnevenVerticalOutline },
  { label: "Сортировка", Icon: Icon24Filter },
  { label: "Профиль", Icon: Icon24ChevronDown },
];

const DROP_ZONE_COPY = {
  highlightText: "Нажмите",
  description: "или перенесите файлы для загрузки",
};

const FOOTER_LINKS: FooterLink[] = [
  { label: "Лицензионное соглашение", href: "#" },
  { label: "Помощь", href: "#" },
];

export default async function StoragePage({ params }: PageProps) {
  const resolvedParams = await params;
  const pathSegments = resolvedParams.path ?? [];
  const pathParam = pathSegments.join("/");

  let data: StorageResponse;
  const baseUrl = await buildBaseUrl();

  try {
    ({ data } = await axios.get<StorageResponse>(
      `${baseUrl}/api/storage`,
      {
        params: pathParam ? { path: pathParam } : undefined,
      },
    ));
  } catch {
    notFound();
  }

  const breadcrumbs = data.breadcrumbs ?? [{ id: "root", label: "Главная" }];
  const folders = data.folders ?? [];
  const files = data.files ?? [];
  const currentPathIds = breadcrumbs.slice(1).map((crumb) => crumb.id);

  const tabs = breadcrumbs.map((crumb, index) => {
    const hrefSegments = breadcrumbs.slice(1, index + 1).map((item) => item.id);
    const href = hrefSegments.length ? `/${hrefSegments.join("/")}` : "/";
    return {
      label: crumb.label,
      href,
      current: index === breadcrumbs.length - 1,
    };
  });

  const buildFolderHref = (folderId: string) => {
    const segments = [...currentPathIds, folderId];
    return segments.length ? `/${segments.join("/")}` : "/";
  };

  const foldersWithHref = folders.map((folder) => ({
    ...folder,
    href: buildFolderHref(folder.id),
  }));

  return (
    <div className={styles.workspaceContent}>
      <Toolbar
        tabs={tabs}
        quickActions={QUICK_ACTIONS}
        viewSwitchers={VIEW_SWITCHERS}
        folderCount={folders.length}
      />
      <StorageInteractiveArea
        folders={foldersWithHref}
        files={files}
        dropZoneCopy={DROP_ZONE_COPY}
        storagePathParam={pathParam}
      />
      <WorkspaceFooter productName="VOblako" links={FOOTER_LINKS} />
    </div>
  );
}
