import { ReactNode } from "react";
import { ReactQueryProvider } from "lib/client/react-query";
import { Sidebar } from "global/components/Sidebar/Sidebar";
import "global/styles/global.css";
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
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
