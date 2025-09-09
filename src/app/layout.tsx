import { ReactNode } from "react";
import Link from "next/link";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/categories">Categories</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
