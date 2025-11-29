export type FileMetadata = {
  uuid: string;
  owner_id: number;
  filename: string;
  content_type: string;
  size: number;
  is_deleted: boolean;
  upload_time: string;
  update_time: string;
  deleted_time?: string | null;
};

export type FilesListOptions = {
  limit?: number;
  offset?: number;
  with_deleted?: boolean;
};

export type UpdateFilenameRequest = {
  filename: string;
};

export type ErrorResponseStatus =
  | "Server error"
  | "User not authorized"
  | "User have no access to this content"
  | "Filename must have length between 1 and 50"
  | "Wrong form format"
  | "Wrong JSON format"
  | "Invalid ID format"
  | "Invalid URL params";

export type ErrorResponse = {
  status: ErrorResponseStatus;
};
