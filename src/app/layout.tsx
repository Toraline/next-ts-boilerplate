import { ReactNode } from "react";
import Link from "next/link";
import { Sidebar } from "components/Sidebar/Sidebar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="body">
        <header>
          <nav>
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
