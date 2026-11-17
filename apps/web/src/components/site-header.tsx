import Link from "next/link";
import { Lockup } from "@/components/brand-mark";
import { mailto, routes } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={routes.home} aria-label="Amplivid home" className="shrink-0">
          <Lockup size={28} />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 text-sm font-semibold md:flex">
          <Link href="/#features" className="text-body hover:text-ink">Features</Link>
          <Link href="/#how-it-works" className="text-body hover:text-ink">How it works</Link>
          <Link href="/#networks" className="text-body hover:text-ink">Networks</Link>
          <Link href="/#faq" className="text-body hover:text-ink">FAQ</Link>
        </nav>
        <a
          href={mailto("Amplivid early access")}
          className="inline-flex min-h-11 items-center rounded-xl bg-indigo px-4 text-sm font-semibold text-white hover:bg-indigo-hover"
        >
          Get early access
        </a>
      </div>
    </header>
  );
}
