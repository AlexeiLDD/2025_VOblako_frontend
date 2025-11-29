export type FileSeed = {
  uuid: string;
  alias: string;
  filename: string;
  contentType: string;
  content?: string;
  filePath?: string;
};

export const FILE_SEEDS: FileSeed[] = [
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000001",
    alias: "welcome-note",
    filename: "Добро пожаловать.txt",
    contentType: "text/plain",
    content: "Это ваш новый рабочий стол в VOblako. Загрузите сюда свои любимые проекты!",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000002",
    alias: "instructions",
    filename: "Инструкция.pdf",
    contentType: "application/pdf",
    content: "PDF-содержимое инструкции (заглушка)",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000003",
    alias: "roadmap",
    filename: "Roadmap.pdf",
    contentType: "application/pdf",
    content: "Дорожная карта проекта (заглушка)",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000004",
    alias: "moodboard",
    filename: "Moodboard.png",
    contentType: "image/png",
    content: "PNG bytes placeholder",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000005",
    alias: "ui-kit",
    filename: "UI-kit.fig",
    contentType: "application/octet-stream",
    content: "FIG файл (заглушка)",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000006",
    alias: "marketing-deck",
    filename: "Презентация.pptx",
    contentType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    content: "PPTX файл (заглушка)",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000007",
    alias: "contracts-a",
    filename: "Договор_А.pdf",
    contentType: "application/pdf",
    content: "Договор А (заглушка)",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000008",
    alias: "contracts-b",
    filename: "Договор_Б.pdf",
    contentType: "application/pdf",
    content: "Договор Б (заглушка)",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000009",
    alias: "report-q1",
    filename: "Отчет Q1.pdf",
    contentType: "application/pdf",
    content: "Отчет Q1 (заглушка)",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000010",
    alias: "estimate",
    filename: "Смета.xlsx",
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    content: "XLSX файл (заглушка)",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000011",
    alias: "archive-notes",
    filename: "Заметки.txt",
    contentType: "text/plain",
    content: "Архивные заметки",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000012",
    alias: "archive-photo",
    filename: "Фото.png",
    contentType: "image/png",
    content: "Фото (заглушка)",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000013",
    alias: "promo-mov",
    filename: "Promo.mov",
    contentType: "video/quicktime",
    content: "Видео PROMO (заглушка)",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000014",
    alias: "demo-mp4",
    filename: "Demo.mp4",
    contentType: "video/mp4",
    content: "Видео DEMO (заглушка)",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000015",
    alias: "team-photo",
    filename: "Team.jpg",
    contentType: "image/jpeg",
    content: "Фото команды",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000016",
    alias: "event-photo",
    filename: "Event.jpg",
    contentType: "image/jpeg",
    content: "Фото мероприятия",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000017",
    alias: "cover-psd",
    filename: "Обложка.psd",
    contentType: "image/vnd.adobe.photoshop",
    content: "PSD макет обложки",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000018",
    alias: "ticket",
    filename: "Ticket.pdf",
    contentType: "application/pdf",
    content: "Билет на самолёт",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000019",
    alias: "hotel-doc",
    filename: "Hotel.docx",
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    content: "Подтверждение брони",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000020",
    alias: "passport",
    filename: "Паспорт.png",
    contentType: "image/png",
    content: "Скан паспорта",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000021",
    alias: "release-plan",
    filename: "Release Plan.txt",
    contentType: "text/plain",
    content: `VOblako Release Plan:

- Спортировать предпросмотр файлов (PDF/Text)
- Подключить синхронизацию с внешним API
- Подготовить демо-аккаунты для презентации`,
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000022",
    alias: "architecture-spec",
    filename: "Architecture Overview.pdf",
    contentType: "application/pdf",
    content: "Документ с описанием архитектуры сервиса (заглушка)",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000023",
    alias: "mock-pdf",
    filename: "Скан договора.pdf",
    contentType: "application/pdf",
    filePath: "DOC061061388.pdf",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000024",
    alias: "mock-photo",
    filename: "Концепт обложки.jpg",
    contentType: "image/jpeg",
    filePath: "pexels-photo-18885592.jpeg",
  },
  {
    uuid: "11111111-aaaa-4a1a-9b11-000000000025",
    alias: "mock-text",
    filename: "PDF Tips.txt",
    contentType: "text/plain",
    filePath: "text.txt",
  },
];

export const FILE_ALIAS_TO_ID = FILE_SEEDS.reduce<Record<string, string>>((acc, seed) => {
  acc[seed.alias] = seed.uuid;
  return acc;
}, {});
