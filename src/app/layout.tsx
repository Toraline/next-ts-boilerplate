import { ReactNode } from "react";
import { ReactQueryProvider } from "lib/client/react-query";
import { Sidebar } from "global/components/Sidebar/Sidebar";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import "global/styles/index.css";

export const metadata: Metadata = {
  title: "Boilerplate Next.js",
  description: "Boilerplate Next.js description",
};

const THEME_BOOT = `
(function () {
  try {
    const KEY='theme'; // 'light'|'dark'|'system'
    let t = localStorage.getItem(KEY);
    if (!t || t === 'system') {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', t);
  } catch {}
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="min-h-full bg-surface-1 text-fg">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body className="flex min-h-full">
        <ReactQueryProvider>
          <Toaster />
          <header className="h-lvh shrink-0 overflow-y-auto">
            <Sidebar />
          </header>

          <main className="grow overflow-y-auto h-lvh">{children}</main>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
