import { ReactNode } from "react";
import { ReactQueryProvider } from "lib/client/react-query";
import { Sidebar } from "global/components/Sidebar/Sidebar";
import { Toaster } from "sonner";
import type { Metadata } from "next";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body className="bg-surface-1">
        <ReactQueryProvider>
          <Toaster />
          <header className="header">
            <Sidebar />
          </header>

          <main className="main">{children}</main>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
