"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LiveSync() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (
      !pathname.startsWith("/dashboard") &&
      !pathname.startsWith("/admin") &&
      !pathname.startsWith("/attacker")
    ) return;

    let active = true;
    let initialized = false;
    let busy = false;
    const seen = new Set<string>();

    async function sync() {
      if (!active || busy) return;
      busy = true;

      try {
        const response = await fetch("/api/notifications", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();
        if (!active || !data.success) return;

        const notifications = data.notifications ?? [];

        if (!initialized) {
          notifications.forEach((item: { id: string }) => seen.add(item.id));
          initialized = true;
          return;
        }

        let receivedNewNotification = false;

        for (const item of [...notifications].reverse()) {
          if (seen.has(item.id)) continue;
          seen.add(item.id);
          receivedNewNotification = true;

          toast(item.title || "New document notification", {
            description: item.message,
            duration: 8000,
            className: "border border-blue-500/30 shadow-xl",
          });
        }

        if (receivedNewNotification && active) {
          router.refresh();
        }
      } catch (error) {
        console.error("Live notification sync failed:", error);
      } finally {
        busy = false;
      }
    }

    void sync();
    const timer = window.setInterval(() => void sync(), 2000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [pathname, router]);

  return null;
}
