import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-faint">
        <span className="font-mono">© 2026 PLACTUM</span>
        <Link href="/reviews" className="font-mono hover:text-muted">
          Reviews
        </Link>
        <span className="font-mono">plactum.com</span>
      </div>
    </footer>
  );
}
