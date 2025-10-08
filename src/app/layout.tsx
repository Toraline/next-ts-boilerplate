import { ReactNode } from "react";
import { Sidebar } from "components/Sidebar/Sidebar";
import { Button } from "ui/Button/Button";
import "../styles/global.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <Button href="/">Home</Button>
            <Sidebar />
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
