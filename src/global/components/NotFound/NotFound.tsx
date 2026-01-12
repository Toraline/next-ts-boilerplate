import Link from "next/link";

export function NotFound() {
  return (
    <div>
      <h2>404 - Page not found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
