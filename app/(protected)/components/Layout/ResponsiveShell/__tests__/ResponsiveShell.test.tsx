import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, beforeEach, expect } from "vitest";
import { ResponsiveShell } from "..";

const primaryNav = [{ label: "Files", icon: "folder" as const }];
const secondaryNav = [{ label: "Shared", icon: "users" as const }];
const footerActions = [{ label: "Help", icon: "document" as const }];

const renderShell = (onLogout?: () => void) =>
  render(
    <ResponsiveShell
      primaryNav={primaryNav}
      secondaryNav={secondaryNav}
      footerActions={footerActions}
      shellClassName="shell"
      workspaceClassName="workspace"
      onLogout={onLogout}
    >
      <div>Workspace content</div>
    </ResponsiveShell>,
  );

const setupMatchMedia = () => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
};

describe("ResponsiveShell", () => {
  beforeEach(() => {
    setupMatchMedia();
  });

  it("renders navigation labels and workspace content", () => {
    renderShell();

    expect(screen.getByText("Files")).toBeInTheDocument();
    expect(screen.getByText("Shared")).toBeInTheDocument();
    expect(screen.getByText("Help")).toBeInTheDocument();
    expect(screen.getByText("Workspace content")).toBeInTheDocument();
  });

  it("toggles sidebar open/close via header button and close action", async () => {
    const { container } = renderShell();

    const toggle = container.querySelector('button[aria-label="Открыть меню"]') as HTMLButtonElement;
    expect(toggle).toBeTruthy();
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    const closeBtn = screen.getByRole("button", { name: "Закрыть", hidden: true });
    fireEvent.click(closeBtn);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("invokes logout handler when footer button is pressed", async () => {
    const user = userEvent.setup();
    const handleLogout = vi.fn();
    renderShell(handleLogout);

    const logoutBtn = screen.getByRole("button", { name: "Выйти" });
    await user.click(logoutBtn);

    expect(handleLogout).toHaveBeenCalledTimes(1);
  });
});
