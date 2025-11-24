export type FolderItem = {
  id: string;
  label: string;
};

export type FileItem = {
  id?: string;
  label: string;
  meta?: string;
  preview?: string;
};

export type StorageBreadcrumb = {
  id: string;
  label: string;
};

export type StorageResponse = {
  id: string;
  label: string;
  breadcrumbs: StorageBreadcrumb[];
  folders: FolderItem[];
  files: FileItem[];
};
