import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

export interface TocItem {
  id: string;
  label: string;
}

export function LegalPage({
  title,
  intro,
  toc,
  children,
}: {
  title: string;
  intro: ReactNode;
  toc: readonly TocItem[];
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-muted">
            Effective {site.legalEffectiveDate}. Last updated {site.legalEffectiveDate}.
          </p>
          <div className="mt-6 text-lg leading-8 text-body">{intro}</div>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-muted">ON THIS PAGE</p>
            <ol className="flex flex-col gap-2 text-sm">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-body hover:text-ink">
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="prose-legal max-w-3xl">{children}</article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
