import { ReactNode } from "react";
import Link from "next/link";
import { Sidebar } from "components/Sidebar/Sidebar";
import "./styles/layout.style.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav className="header__nav">
            <Sidebar />
            <Link href="/">Home</Link>
            <Link href="/categories">Categories</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
