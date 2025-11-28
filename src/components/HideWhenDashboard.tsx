"use client";

import React from "react";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function HideWhenDashboard({ children }: Props) {
  const pathname = usePathname() || "";

  // If the current path contains `/dashboard` (covers `/dashboard` and
  // localized paths like `/en/dashboard`), don't render the wrapped UI.
  const isDashboard = pathname.includes("/dashboard");

  if (isDashboard) return <>{/* intentionally render nothing on dashboard */}</>;

  return <>{children}</>;
}
