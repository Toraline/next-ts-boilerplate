import { ReactNode } from "react";
import { Sidebar } from "components/Sidebar/Sidebar";
import "../styles/global.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <Sidebar />
        </header>

        <main className="main">{children}</main>
      </body>
    </html>
  );
}
