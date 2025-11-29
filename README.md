This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Режимы API

Приложение может общаться либо с встроенным мок‑API (по умолчанию), либо с внешним шлюзом, который реализует спецификации `api/auth.openapi.yaml` и `api/files.openapi.yaml`.

| Режим  | Что делает | Как включить |
|--------|------------|--------------|
| `mock` | Использует встроенные обработчики Next.js из `app/api/**`, данные хранятся в памяти процесса. | Ничего делать не нужно, это режим по умолчанию. |
| `remote` | Проксирует все обращения к `/api` на внешний шлюз и полагается на его cookie/ответы. | Добавьте в `.env.local`:<br>`VOBLAKO_API_TARGET=remote`<br>`VOBLAKO_REMOTE_API_BASE_URL=http://localhost:8080/api` (замените URL, если ваш шлюз доступен по другому адресу). |

В режиме `remote` серверные компоненты (например, защищённый layout) автоматически проверяют сессии через шлюз, при этом мок‑логика остаётся доступной для локальной разработки.

### Моки файлового API

Обработчики в `app/api/files/**` реализуют основные сценарии из `api/files.openapi.yaml`:

- `POST /api/files` — примет multipart‑форму с `file` и вернёт метаданные загруженного файла.
- `POST /api/files/list` — вернёт список файлов с пагинацией (`limit`, `offset`) и флагом `with_deleted`.
- `GET/POST/DELETE /api/files/{id}` — скачивание, перезапись и удаление файлов (удаление мягкое, но скачивание удалённых запрещено).
- `GET /api/files/{id}/meta` и `POST /api/files/{id}/name` — чтение и переименование метаданных.

Все данные хранятся в памяти процесса Node.js, поэтому перезапуск `npm run dev` сбрасывает состояние. Для проверки работы можно использовать `curl`:

```bash
curl -F "file=@README.md" http://localhost:3000/api/files
curl -X POST -H "Content-Type: application/json" \
  -d '{"limit":10,"offset":0}' \
  http://localhost:3000/api/files/list
```

API папок (`GET /api/storage`) использует ту же in-memory базу файлов: структура каталога описана в `app/api/storage/data.ts`, а сами метаданные берутся из мок‑хранилища `app/api/files/mockStore.ts`. Благодаря этому, карточки в рабочем пространстве показывают актуальные имена/типы/размеры, а эндпойнты `/api/files/**` отвечают за реальные байты и операции с файлами.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
