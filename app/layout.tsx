import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";

import Providers from "@/components/providers";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),

  title: {
    default: "Secure Transfer",
    template: "%s | Secure Transfer",
  },

  description:
    "A modern secure file transfer platform featuring AES-256 encryption, SHA-256 integrity verification, attack simulation, and secure communication.",

  applicationName: "Secure Transfer",

  keywords: [
    "Secure File Transfer",
    "AES-256",
    "SHA-256",
    "Cybersecurity",
    "Network Security",
    "Secure Communication",
    "File Encryption",
    "Next.js",
    "Final Year Project",
  ],

  authors: [
    {
      name: "Secure Transfer",
    },
  ],

  creator: "Secure Transfer",

  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geist.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className="
          min-h-screen
          bg-background
          text-foreground
          font-sans
          antialiased
          selection:bg-indigo-600
          selection:text-white
        "
      >
        <Providers>
          {children}

          <Toaster
            position="top-right"
            richColors
            expand
            closeButton
            duration={3500}
            theme="dark"
            toastOptions={{
              classNames: {
                toast:
                  "bg-slate-900 border border-slate-700 text-slate-100 shadow-2xl",
                title: "font-semibold",
                description: "text-slate-400",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}