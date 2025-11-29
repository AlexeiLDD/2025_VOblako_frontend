const RAW_TARGET = process.env.VOBLAKO_API_TARGET?.toLowerCase() ?? "mock";
const NORMALIZED_TARGET = RAW_TARGET === "remote" ? "remote" : "mock";

const RAW_REMOTE_BASE_URL = process.env.VOBLAKO_REMOTE_API_BASE_URL ?? "http://localhost:8080/api";
const NORMALIZED_REMOTE_BASE_URL = RAW_REMOTE_BASE_URL.replace(/\/$/, "");

export type ApiTarget = "mock" | "remote";

export const apiConfig = {
  target: NORMALIZED_TARGET as ApiTarget,
  remoteBaseUrl: NORMALIZED_REMOTE_BASE_URL,
} as const;

export const isRemoteApiEnabled = () => apiConfig.target === "remote";

export const buildRemoteApiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiConfig.remoteBaseUrl}${normalizedPath}`;
};
