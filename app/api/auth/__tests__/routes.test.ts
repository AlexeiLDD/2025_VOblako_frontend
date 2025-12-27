/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  __resetAuthStore,
  authStore,
  buildAuthResponse,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from "../store";
import { GET as checkAuth } from "../check/route";
import { POST as login } from "../login/route";
import { POST as logout } from "../logout/route";
import { POST as signup } from "../signup/route";

vi.mock("@/app/config/apiTarget", () => ({
  isRemoteApiEnabled: () => false,
}));

vi.mock("@/app/api/utils/remoteProxy", () => ({
  forwardToRemoteApi: vi.fn(),
}));

const buildRequest = (url: string, init?: RequestInit) =>
  new NextRequest(url, init as RequestInit);

const parseJson = async (response: Response) => response.json() as Promise<unknown>;

describe("auth API mock routes", () => {
  beforeEach(() => {
    __resetAuthStore();
  });

  it("check: returns unauthenticated when no cookie", async () => {
    const response = await checkAuth(buildRequest("http://localhost/api/auth/check"));
    expect(response.status).toBe(200);
    const body = (await parseJson(response)) as ReturnType<typeof buildAuthResponse>;
    expect(body.is_auth).toBe(false);
    expect(body.user).toBeUndefined();
  });

  it("check: returns user when valid session cookie present", async () => {
    const user = authStore.resolveUserByEmail("demo@voblako.ru");
    const token = authStore.createSessionToken(authStore.toPublicUser(user!));
    const response = await checkAuth(
      buildRequest("http://localhost/api/auth/check", {
        headers: { cookie: `session_id=${token}` },
      }),
    );

    expect(response.status).toBe(200);
    const body = (await parseJson(response)) as ReturnType<typeof buildAuthResponse>;
    expect(body.is_auth).toBe(true);
    expect(body.user?.email).toBe("demo@voblako.ru");
  });

  it("login: rejects malformed JSON", async () => {
    const response = await login(
      buildRequest("http://localhost/api/auth/login", {
        method: "POST",
        body: "{oops",
        headers: { "content-type": "application/json" },
      }),
    );

    expect(response.status).toBe(400);
    const body = (await parseJson(response)) as { status: string };
    expect(body.status).toBe("Wrong JSON format");
  });

  it("login: rejects wrong credentials", async () => {
    const response = await login(
      buildRequest("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "demo@voblako.ru", password: "wrongpass1" }),
        headers: { "content-type": "application/json" },
      }),
    );

    expect(response.status).toBe(400);
    const body = (await parseJson(response)) as { status: string };
    expect(body.status).toBe("Wrong credentials");
  });

  it("login: enforces password length bounds", async () => {
    const tooShort = "a".repeat(MIN_PASSWORD_LENGTH - 1);
    const tooLong = "a".repeat(MAX_PASSWORD_LENGTH + 1);

    const shortResponse = await login(
      buildRequest("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "demo@voblako.ru", password: tooShort }),
        headers: { "content-type": "application/json" },
      }),
    );
    expect(shortResponse.status).toBe(400);

    const longResponse = await login(
      buildRequest("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "demo@voblako.ru", password: tooLong }),
        headers: { "content-type": "application/json" },
      }),
    );
    expect(longResponse.status).toBe(400);
  });

  it("login: sets session cookie on success", async () => {
    const response = await login(
      buildRequest("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "demo@voblako.ru", password: "password123" }),
        headers: { "content-type": "application/json" },
      }),
    );

    expect(response.status).toBe(200);
    expect(response.cookies.get("session_id")?.value).toBeTruthy();
    const body = (await parseJson(response)) as ReturnType<typeof buildAuthResponse>;
    expect(body.user?.email).toBe("demo@voblako.ru");
  });

  it("signup: rejects mismatched passwords", async () => {
    const response = await signup(
      buildRequest("http://localhost/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "new@user.ru",
          password: "password123",
          password_repeat: "other",
        }),
        headers: { "content-type": "application/json" },
      }),
    );

    expect(response.status).toBe(400);
    const body = (await parseJson(response)) as { status: string };
    expect(body.status).toBe("Passwords do not match");
  });

  it("signup: rejects duplicate email", async () => {
    const response = await signup(
      buildRequest("http://localhost/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "demo@voblako.ru",
          password: "password123",
          password_repeat: "password123",
        }),
        headers: { "content-type": "application/json" },
      }),
    );

    expect(response.status).toBe(400);
    const body = (await parseJson(response)) as { status: string };
    expect(body.status).toBe("User with this email already exists");
  });

  it("signup: creates user and sets cookie", async () => {
    const response = await signup(
      buildRequest("http://localhost/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "new@user.ru",
          password: "password123",
          password_repeat: "password123",
        }),
        headers: { "content-type": "application/json" },
      }),
    );

    expect(response.status).toBe(200);
    expect(response.cookies.get("session_id")?.value).toBeTruthy();
    const body = (await parseJson(response)) as ReturnType<typeof buildAuthResponse>;
    expect(body.user?.email).toBe("new@user.ru");
  });

  it("logout: requires active session", async () => {
    const unauthorized = await logout(
      buildRequest("http://localhost/api/auth/logout", { method: "POST" }),
    );
    expect(unauthorized.status).toBe(401);
    const body = (await parseJson(unauthorized)) as { status: string };
    expect(body.status).toBe("User not authorized");

    const user = authStore.resolveUserByEmail("demo@voblako.ru");
    const token = authStore.createSessionToken(authStore.toPublicUser(user!));

    const response = await logout(
      buildRequest("http://localhost/api/auth/logout", {
        method: "POST",
        headers: { cookie: `session_id=${token}` },
      }),
    );

    expect(response.status).toBe(200);
    expect(response.cookies.get("session_id")?.value).toBe("");
  });
});
