import { Buffer } from "node:buffer";
import type { AuthResponse, AuthUser } from "@/app/types/auth";

type StoredUser = AuthUser & {
  password: string;
};

const initialUsers: StoredUser[] = [
  {
    id: 1,
    email: "demo@voblako.ru",
    password: "password123",
  },
];

const storedUsers: StoredUser[] = [...initialUsers];

let userIdCounter = storedUsers.length + 1;

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 32;

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email: unknown): email is string => {
  if (typeof email !== "string") {
    return false;
  }

  return emailPattern.test(email.trim());
};

const toPublicUser = (user: StoredUser): AuthUser => ({
  id: user.id,
  email: user.email,
});

const resolveUserByEmail = (email: string) => {
  const normalized = normalizeEmail(email);
  return storedUsers.find((user) => user.email === normalized);
};

type SessionPayload = {
  user: AuthUser;
};

const encodeSessionToken = (user: AuthUser) =>
  Buffer.from(JSON.stringify({ user }), "utf8").toString("base64url");

const decodeSessionToken = (token: string) => {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf8")) as SessionPayload;
    if (payload.user && typeof payload.user.id === "number" && typeof payload.user.email === "string") {
      return payload.user;
    }
  } catch {
    //
  }

  return undefined;
};

const createSessionToken = (user: AuthUser) => encodeSessionToken(user);

const resolveSessionUser = (token?: string): AuthUser | undefined => {
  if (!token) {
    return undefined;
  }

  return decodeSessionToken(token);
};

const clearSession = (_token?: string) => {
  // Token is stored entirely in the cookie. Clearing cookies is enough for mock implementation.
};

const createUser = (email: string, password: string) => {
  const normalized = normalizeEmail(email);
  const user: StoredUser = {
    id: userIdCounter,
    email: normalized,
    password,
  };

  storedUsers.push(user);
  userIdCounter += 1;
  return user;
};

export const authStore = {
  normalizeEmail,
  resolveUserByEmail,
  resolveSessionUser,
  createSessionToken,
  clearSession,
  createUser,
  toPublicUser,
  isValidEmail,
};

export const buildAuthResponse = (user?: StoredUser | AuthUser): AuthResponse => ({
  is_auth: Boolean(user),
  user: user ? ("password" in user ? toPublicUser(user) : user) : undefined,
});

// Test-only helper to reset mock state
export const __resetAuthStore = () => {
  storedUsers.length = 0;
  storedUsers.push(...initialUsers);
  userIdCounter = storedUsers.length + 1;
};
