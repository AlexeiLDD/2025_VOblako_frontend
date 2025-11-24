"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import { ResponsiveShell, type ResponsiveShellProps } from "@/app/components/Layout/ResponsiveShell";

type ProtectedShellProps = Omit<ResponsiveShellProps, "children" | "onLogout"> & {
  children: ReactNode;
};

const ProtectedShell = ({ children, ...shellProps }: ProtectedShellProps) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/auth/login");
      router.refresh();
    }
  };

  return (
    <ResponsiveShell {...shellProps} onLogout={handleLogout}>
      {children}
    </ResponsiveShell>
  );
};

export default ProtectedShell;
