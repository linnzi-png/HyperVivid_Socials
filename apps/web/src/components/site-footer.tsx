import Link from "next/link";
import { Lockup } from "@/components/brand-mark";
import { postalAddress, routes, site } from "@/lib/site";

/**
 * Legal links stay visible in the footer of every page, never behind a menu:
 * TikTok's app review requires the privacy policy and terms to be reachable
 * that way from the homepage.
 */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-sunken">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Lockup size={24} />
          <p className="max-w-sm text-sm leading-6 text-muted">
            {site.name} is a product of {site.company.legalName}, part of the HyperVivid app family.
          </p>
        </div>
        <nav aria-label="Legal" className="flex flex-col gap-3 text-sm">
          <p className="font-semibold text-ink">Legal</p>
          <Link href={routes.privacy} className="text-body hover:text-ink">Privacy Policy</Link>
          <Link href={routes.terms} className="text-body hover:text-ink">Terms of Service</Link>
          <Link href={routes.dataDeletion} className="text-body hover:text-ink">Data Deletion</Link>
        </nav>
        <div className="flex flex-col gap-3 text-sm">
          <p className="font-semibold text-ink">Contact</p>
          <a href={`mailto:${site.contactEmail}`} className="break-all text-cyan hover:underline">
            {site.contactEmail}
          </a>
          <p className="leading-6 text-muted">{postalAddress()}</p>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted sm:px-6">
          © 2026 {site.company.legalName}. TikTok, YouTube, Instagram, Facebook and LinkedIn are
          trademarks of their respective owners. Amplivid is not affiliated with or endorsed by them.
        </p>
      </div>
    </footer>
  );
}
