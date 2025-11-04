import { ReactNode } from "react";
import { ReactQueryProvider } from "lib/client/react-query";
import { Sidebar } from "global/components/Sidebar/Sidebar";
import "global/styles/index.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="p-[16px]">
        <ReactQueryProvider>
          <header className="header">
            <Sidebar />
          </header>

          <main className="main">{children}</main>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
