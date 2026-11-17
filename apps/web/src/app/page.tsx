import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { networkDataUses } from "@/lib/legal/networks";
import { mailto, routes, site } from "@/lib/site";

const features = [
  {
    title: "Create with AI",
    body: "Draft captions, hooks and hashtags in your own voice, turn one idea into posts for every network, generate graphics, and cut long videos into short clips.",
    accent: "bg-spectrum-orange",
  },
  {
    title: "Schedule and publish",
    body: "Pick the accounts, the time and the settings for each network. Amplivid publishes for you and tells you the moment each post is live, or why it was not.",
    accent: "bg-cyan",
  },
  {
    title: "Growth planner",
    body: "Plan campaigns on a calendar, keep your ideas organized by campaign, set a posting goal for the week and keep your streak going.",
    accent: "bg-spectrum-green",
  },
  {
    title: "Stats in one place",
    body: "See views, likes, comments, shares and follower growth from every connected account side by side, and learn which posts are working.",
    accent: "bg-spectrum-magenta",
  },
] as const;

const steps = [
  {
    title: "Connect your accounts",
    body: "Sign in to TikTok, YouTube, Instagram, Facebook or LinkedIn through each network's own login screen. You choose what Amplivid may do, and you can disconnect at any time.",
  },
  {
    title: "Create your post",
    body: "Upload your video or images, or start from an idea. Write the caption yourself or let AI suggest one, then adjust it for each network.",
  },
  {
    title: "Schedule or post now",
    body: "Publish right away or pick a time. Amplivid only posts what you approve, to the accounts you pick, when you say.",
  },
] as const;

const faqs = [
  {
    q: "Who is Amplivid for?",
    a: "Solo creators who post to more than one network and want to plan, create and publish without juggling five apps. Support for agencies and teams comes later.",
  },
  {
    q: "Does Amplivid ever post without me?",
    a: "No. Amplivid publishes only the posts you create or approve, to the accounts you choose, at the time you set. It never posts, comments, follows or sends messages on its own.",
  },
  {
    q: "What does Amplivid do with my social accounts?",
    a: "Only what you see on each network's permission screen: show which account is connected, publish what you schedule, and read stats for your posts. Our Privacy Policy lists every permission and why we need it.",
  },
  {
    q: "Can I disconnect an account or delete my data?",
    a: "Yes. Disconnect any account from Amplivid's settings or from the network itself, and delete your Amplivid account whenever you like. See our Data Deletion page for the steps.",
  },
  {
    q: "Is my data sold or used to train AI?",
    a: "No. We never sell your data, and we do not use your posts, videos or account data to train AI models.",
  },
] as const;

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-line">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-indigo/20 blur-3xl"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1.2fr_1fr] md:py-28">
            <div className="flex flex-col gap-6">
              <p className="text-xs font-semibold tracking-[0.32em] text-muted">A HYPERVIVID PRODUCT</p>
              <h1 className="font-display text-4xl font-extrabold leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
                {site.tagline}
              </h1>
              <p className="max-w-xl text-lg leading-8 text-body">
                Amplivid is the all-in-one studio for solo creators. Plan your content, create it
                with AI, and schedule and publish it to TikTok, YouTube, Instagram, Facebook and
                LinkedIn from one place.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={mailto("Amplivid early access")}
                  className="inline-flex min-h-12 items-center rounded-xl bg-indigo px-6 font-semibold text-white hover:bg-indigo-hover"
                >
                  Get early access
                </a>
                <Link
                  href="/#how-it-works"
                  className="inline-flex min-h-12 items-center rounded-xl border border-line-strong bg-card px-6 font-semibold text-ink hover:bg-raised"
                >
                  See how it works
                </Link>
              </div>
              <p className="text-sm text-muted">
                Amplivid is in early access on the web, with iOS and Android apps to follow.
              </p>
            </div>
            <PlannerPreview />
          </div>
        </section>

        {/* Networks */}
        <section id="networks" className="scroll-mt-20 border-b border-line bg-sunken">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6">
            <h2 className="text-center text-sm font-semibold tracking-[0.12em] text-muted">
              PUBLISH TO THE NETWORKS YOU USE
            </h2>
            <ul className="flex flex-wrap justify-center gap-3">
              {networkDataUses.map((n) => (
                <li
                  key={n.id}
                  className="rounded-full border border-line-strong bg-card px-5 py-2.5 font-semibold text-ink"
                >
                  {n.name}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              Everything from idea to posted
            </h2>
            <p className="mt-4 text-lg leading-8 text-body">
              One workspace for the whole loop: plan it, make it, post it and see how it did.
            </p>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2">
            {features.map((f) => (
              <li key={f.title} className="flex flex-col gap-3 rounded-2xl border border-line bg-sunken p-7">
                <span aria-hidden="true" className={`h-1.5 w-10 rounded-full ${f.accent}`} />
                <h3 className="font-display text-xl font-semibold text-ink">{f.title}</h3>
                <p className="leading-7 text-body">{f.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-20 border-y border-line bg-sunken">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              How it works
            </h2>
            <ol className="mt-12 grid gap-5 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-7">
                  <span className="font-display text-3xl font-extrabold text-indigo">{i + 1}</span>
                  <h3 className="text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="leading-7 text-body">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Trust */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
                Your accounts stay yours
              </h2>
              <p className="mt-4 text-lg leading-8 text-body">
                Amplivid connects through each network&apos;s official login and API. We never see or
                store your social media passwords.
              </p>
            </div>
            <ul className="flex flex-col gap-4">
              {[
                "We ask only for the permissions a feature needs, and explain each one.",
                "Access tokens are encrypted, and we never sell your data.",
                "Disconnect any account, or delete everything, whenever you want.",
                "Your posts and videos are never used to train AI models.",
              ].map((point) => (
                <li key={point} className="flex gap-3 rounded-xl border border-line bg-sunken p-4 leading-7">
                  <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-spectrum-green" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-8 text-body">
            Read the details in our <Link href={routes.privacy} className="text-cyan underline underline-offset-2">Privacy Policy</Link>,{" "}
            <Link href={routes.terms} className="text-cyan underline underline-offset-2">Terms of Service</Link> and{" "}
            <Link href={routes.dataDeletion} className="text-cyan underline underline-offset-2">Data Deletion</Link> instructions.
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 border-t border-line bg-sunken">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <h2 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              Questions
            </h2>
            <div className="mt-10 flex flex-col gap-3">
              {faqs.map((f) => (
                <details key={f.q} className="group rounded-xl border border-line bg-card p-5">
                  <summary className="cursor-pointer list-none font-semibold text-ink marker:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {f.q}
                      <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 leading-7 text-body">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-line bg-card px-6 py-14 text-center">
            <BrandMark size={64} />
            <h2 className="font-display text-3xl font-extrabold leading-tight text-ink">
              Be first in line
            </h2>
            <p className="max-w-xl text-lg leading-8 text-body">
              Amplivid is opening to creators in small groups. Email us and we&apos;ll send your
              invite as soon as a spot opens.
            </p>
            <a
              href={mailto("Amplivid early access")}
              className="inline-flex min-h-12 items-center rounded-xl bg-indigo px-6 font-semibold text-white hover:bg-indigo-hover"
            >
              Get early access
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

/** A static picture of the planner week view, drawn in markup. */
function PlannerPreview() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
  const posts: Record<(typeof days)[number], { label: string; tone: string }[]> = {
    Mon: [{ label: "TikTok · 6 PM", tone: "border-spectrum-red" }],
    Tue: [
      { label: "YouTube · 9 AM", tone: "border-spectrum-orange" },
      { label: "Instagram · 7 PM", tone: "border-spectrum-magenta" },
    ],
    Wed: [{ label: "LinkedIn · 8 AM", tone: "border-cyan" }],
    Thu: [{ label: "TikTok · 6 PM", tone: "border-spectrum-red" }],
    Fri: [
      { label: "Facebook · 12 PM", tone: "border-indigo" },
      { label: "Instagram · 7 PM", tone: "border-spectrum-magenta" },
    ],
  };
  return (
    <figure className="rounded-2xl border border-line bg-sunken p-5 shadow-2xl shadow-indigo/10">
      <figcaption className="mb-4 flex items-center justify-between">
        <span className="font-semibold text-ink">This week</span>
        <span className="rounded-full bg-spectrum-green/15 px-3 py-1 text-xs font-semibold text-spectrum-green">
          4 day streak
        </span>
      </figcaption>
      <div className="grid grid-cols-5 gap-2">
        {days.map((d) => (
          <div key={d} className="flex min-h-40 flex-col gap-2 rounded-xl bg-card p-2">
            <span className="text-xs font-semibold text-muted">{d}</span>
            {posts[d].map((p) => (
              <span
                key={p.label}
                className={`rounded-md border-l-2 ${p.tone} bg-raised px-1.5 py-1 text-[11px] leading-tight text-ink`}
              >
                {p.label}
              </span>
            ))}
          </div>
        ))}
      </div>
    </figure>
  );
}
