import { vi } from "vitest";
import "@testing-library/jest-dom";

// Minimal mock for next/image to behave like a regular img in tests
vi.mock("next/image", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: (props: any) => {
      const { priority: _priority, ...rest } = props ?? {};
      return React.createElement("img", rest);
    },
  };
});

vi.mock("next/link", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: React.forwardRef(
      (
        { href, children, ...rest }: { href: string; children: React.ReactNode },
        ref: React.ForwardedRef<HTMLAnchorElement>,
      ) => React.createElement("a", { href, ref, ...rest }, children),
    ),
  };
});
