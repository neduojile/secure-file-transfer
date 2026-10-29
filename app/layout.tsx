import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";

import Providers from "@/components/providers";

import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),

  title: {
    default: "SATIM â€” Secure Academic Transfer & Integrity Monitoring",
    template: "%s | SATIM",
  },

  description:
    "Secure academic document transfer with encryption, integrity verification, controlled MITM simulation, and security monitoring.",

  applicationName: "SATIM",

  keywords: [
    "Secure Academic Document Transfer",
    "Academic Security",
    "AES Encryption",
    "SHA-256",
    "MITM Simulation",
    "Document Integrity",
    "Cybersecurity",
  ],

  authors: [
    {
      name: "SATIM",
    },
  ],

  creator: "SATIM",

  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>
          {children}

          <Toaster
            position="top-right"
            richColors
            expand
            closeButton
            duration={3500}
            theme="light"
            toastOptions={{
              classNames: {
                toast:
                  "border border-black/[0.07] bg-white text-slate-950 shadow-2xl",
                title: "font-semibold text-slate-950",
                description: "text-slate-500",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
