import type { FileItem } from "@/app/types/storage";

type StorageNode = {
  id: string;
  label: string;
  folders?: StorageNode[];
  files?: FileItem[];
};

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
            { label: "Moodboard.png", meta: "PNG • 5.2 МБ", preview: "/window.svg" },
            { label: "UI-kit.fig", meta: "FIG • 12.6 МБ" },
          ],
        },
        {
          id: "marketing",
          label: "Маркетинг",
          files: [
            { label: "Презентация.pptx", meta: "PPTX • 14 МБ", preview: "/globe.svg" },
          ],
        },
      ],
      files: [{ label: "Roadmap.pdf", meta: "PDF • 1.9 МБ" }],
    },
    {
      id: "documents",
      label: "Документы",
      folders: [
        {
          id: "contracts",
          label: "Договоры",
          files: [
            { label: "Договор_А.pdf", meta: "PDF • 780 КБ" },
            { label: "Договор_Б.pdf", meta: "PDF • 820 КБ" },
          ],
        },
      ],
      files: [
        { label: "Отчет Q1.pdf", meta: "PDF • 2.3 МБ" },
        { label: "Смета.xlsx", meta: "XLSX • 860 КБ" },
      ],
    },
    {
      id: "archive",
      label: "Архив",
      files: [
        { label: "Заметки.txt", meta: "TXT • 8 КБ" },
        { label: "Фото.png", meta: "PNG • 4.2 МБ" },
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
            { label: "Promo.mov", meta: "MOV • 230 МБ" },
            { label: "Demo.mp4", meta: "MP4 • 120 МБ" },
          ],
        },
        {
          id: "photos",
          label: "Фото",
          files: [
            { label: "Team.jpg", meta: "JPG • 8 МБ" },
            { label: "Event.jpg", meta: "JPG • 6.5 МБ" },
          ],
        },
      ],
      files: [
        { label: "Обложка.psd", meta: "PSD • 45 МБ" },
      ],
    },
    {
      id: "personal",
      label: "Личное",
      folders: [
        {
          id: "travels",
          label: "Путешествия",
          files: [
            { label: "Ticket.pdf", meta: "PDF • 180 КБ" },
            { label: "Hotel.docx", meta: "DOCX • 240 КБ" },
          ],
        },
      ],
      files: [
        { label: "Паспорт.png", meta: "PNG • 2.5 МБ" },
      ],
    },
  ],
  files: [
    { label: "Добро пожаловать.txt", meta: "TXT • 1 КБ" },
    { label: "Инструкция.pdf", meta: "PDF • 600 КБ" },
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
