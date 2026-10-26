"use client";

import { SessionProvider } from "next-auth/react";
import LiveSync from "@/components/live-sync";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <LiveSync />
      {children}
    </SessionProvider>
  );
}
