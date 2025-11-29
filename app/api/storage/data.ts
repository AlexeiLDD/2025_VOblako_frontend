import { FILE_ALIAS_TO_ID } from "@/app/api/files/mockData";

export type StorageFileRef = {
  fileId: string;
  preview?: string;
};

type StorageNode = {
  id: string;
  label: string;
  folders?: StorageNode[];
  files?: StorageFileRef[];
};

const getFileId = (alias: keyof typeof FILE_ALIAS_TO_ID) => FILE_ALIAS_TO_ID[alias];

const STORAGE_TREE: StorageNode = {
  id: "root",
  label: "Главная",
  folders: [
    {
      id: "projects",
      label: "Проекты",
      folders: [
        {
          id: "design",
          label: "Дизайн",
          files: [
            { fileId: getFileId("moodboard") },
            { fileId: getFileId("ui-kit") },
          ],
        },
        {
          id: "marketing",
          label: "Маркетинг",
          files: [{ fileId: getFileId("marketing-deck"), preview: "/globe.svg" }],
        },
      ],
      files: [{ fileId: getFileId("roadmap") }],
    },
    {
      id: "documents",
      label: "Документы",
      folders: [
        {
          id: "contracts",
          label: "Договоры",
          files: [
            { fileId: getFileId("contracts-a") },
            { fileId: getFileId("contracts-b") },
          ],
        },
      ],
      files: [
        { fileId: getFileId("report-q1") },
        { fileId: getFileId("estimate") },
      ],
    },
    {
      id: "archive",
      label: "Архив",
      files: [
        { fileId: getFileId("archive-notes") },
        { fileId: getFileId("archive-photo") },
      ],
    },
    {
      id: "media",
      label: "Медиа",
      folders: [
        {
          id: "videos",
          label: "Видео",
          files: [
            { fileId: getFileId("promo-mov") },
            { fileId: getFileId("demo-mp4") },
          ],
        },
        {
          id: "photos",
          label: "Фото",
          files: [
            { fileId: getFileId("team-photo") },
            { fileId: getFileId("event-photo") },
          ],
        },
      ],
      files: [{ fileId: getFileId("cover-psd") }],
    },
    {
      id: "personal",
      label: "Личное",
      folders: [
        {
          id: "travels",
          label: "Путешествия",
          files: [
            { fileId: getFileId("ticket") },
            { fileId: getFileId("hotel-doc") },
          ],
        },
      ],
      files: [{ fileId: getFileId("passport") }],
    },
  ],
  files: [
    { fileId: getFileId("welcome-note") },
    { fileId: getFileId("instructions") },
    { fileId: getFileId("release-plan") },
    { fileId: getFileId("architecture-spec") },
    { fileId: getFileId("mock-pdf") },
    { fileId: getFileId("mock-photo") },
    { fileId: getFileId("mock-text") },
  ],
};

export type ResolvedNode = {
  node: StorageNode;
  breadcrumbs: Array<{ id: string; label: string }>;
};

export function resolveNode(pathIds: string[]): ResolvedNode | null {
  const breadcrumbs: Array<{ id: string; label: string }> = [
    { id: STORAGE_TREE.id, label: STORAGE_TREE.label },
  ];
  let current: StorageNode = STORAGE_TREE;

  for (const id of pathIds) {
    const next = current.folders?.find((folder) => folder.id === id);
    if (!next) {
      return null;
    }
    current = next;
    breadcrumbs.push({ id: current.id, label: current.label });
  }

  return { node: current, breadcrumbs };
}
