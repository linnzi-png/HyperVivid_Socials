import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { networkDataUses, youtubeTermsUrl } from "@/lib/legal/networks";
import { mailto, postalAddress, routes, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that apply when you use ${site.name}.`,
  alternates: { canonical: routes.terms },
};

const networkTerms = [
  { name: "TikTok", url: "https://www.tiktok.com/legal/page/us/terms-of-service/en" },
  { name: "YouTube", url: youtubeTermsUrl },
  { name: "Instagram", url: "https://help.instagram.com/581066165581870" },
  { name: "Facebook", url: "https://www.facebook.com/terms.php" },
  { name: "LinkedIn", url: "https://www.linkedin.com/legal/user-agreement" },
] as const;

const toc = [
  { id: "agreement", label: "Agreement" },
  { id: "eligibility", label: "Eligibility and accounts" },
  { id: "service", label: "The Service" },
  { id: "social-networks", label: "Social networks" },
  { id: "your-content", label: "Your content" },
  { id: "ai", label: "AI features" },
  { id: "acceptable-use", label: "Acceptable use" },
  { id: "plans", label: "Plans, billing and cancellation" },
  { id: "mobile", label: "Mobile apps" },
  { id: "our-ip", label: "Our intellectual property" },
  { id: "copyright", label: "Copyright complaints" },
  { id: "termination", label: "Suspension and termination" },
  { id: "disclaimers", label: "Disclaimers" },
  { id: "liability", label: "Limitation of liability" },
  { id: "indemnity", label: "Indemnity" },
  { id: "disputes", label: "Governing law and disputes" },
  { id: "changes", label: "Changes to these terms" },
  { id: "general", label: "General" },
  { id: "contact", label: "Contact" },
] as const;

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      toc={toc}
      intro={
        <p>
          These terms are a contract between you and {site.company.legalName} about your use of{" "}
          {site.name}. Please read them, together with our{" "}
          <Link href={routes.privacy} className="text-cyan underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      }
    >
      <h2 id="agreement">1. Agreement</h2>
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your use of the {site.name} website at
        amplivid.com, the {site.name} web app and the {site.name} mobile apps (together, the
        &quot;Service&quot;), provided by {site.company.legalName}, {site.company.kind}{" "}
        (&quot;we&quot;, &quot;us&quot;). By creating an account or using the Service, you agree to
        these Terms and our <Link href={routes.privacy}>Privacy Policy</Link>. If you do not agree,
        do not use the Service. If you use the Service for a business, you agree to these Terms on
        its behalf and confirm you have authority to do so.
      </p>

      <h2 id="eligibility">2. Eligibility and accounts</h2>
      <ul>
        <li>
          You must be at least 18 years old, or the age of majority where you live if that is older,
          and able to form a binding contract.
        </li>
        <li>
          You must meet the eligibility rules of every social network you connect to the Service.
        </li>
        <li>
          Give us accurate account information and keep it up to date. Keep your password secure and
          tell us right away at <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> if
          you think someone has accessed your account. You are responsible for activity under your
          account.
        </li>
        <li>
          A creator workspace may include you as owner and the people you invite. You are
          responsible for the people you invite and the permissions you give them.
        </li>
      </ul>

      <h2 id="service">3. The Service</h2>
      <p>
        {site.name} helps you plan, create, schedule and publish content to social networks and see
        how it performs. We are improving the Service all the time, so features may be added,
        changed or removed. Some features are labeled early access or beta; they may be incomplete
        and change without notice. We will give you reasonable notice before removing a major paid
        feature.
      </p>

      <h2 id="social-networks">4. Social networks</h2>
      <p>
        When you connect a social account, you authorize {site.name} to access that account and act
        on your behalf within the permissions you approve on the network&apos;s consent screen,
        including publishing the content you schedule and reading statistics for your account and
        posts. You can withdraw that authorization at any time by disconnecting the account.
      </p>
      <p>
        Your use of each network remains subject to that network&apos;s own terms and policies, and
        you agree to comply with them, including:
      </p>
      <ul>
        {networkTerms.map((t) => (
          <li key={t.name}>
            <a href={t.url}>{t.name} terms</a>
          </li>
        ))}
      </ul>
      <p>
        <strong>
          {site.name} uses YouTube API Services. By using {site.name}&apos;s YouTube features, you
          agree to be bound by the <a href={youtubeTermsUrl}>YouTube Terms of Service</a>.
        </strong>
      </p>
      <p>
        The networks are independent companies. We do not control them and are not responsible for
        their services, availability, rules, content moderation, account decisions or changes to
        their APIs. A network may reject, limit, delay or remove a post, or limit what{" "}
        {site.name} can do, and we cannot always prevent that. {site.name} is not affiliated with or
        endorsed by {networkDataUses.map((n) => n.name).join(", ")}.
      </p>

      <h2 id="your-content">5. Your content</h2>
      <p>
        &quot;Your content&quot; means the videos, images, audio, text, ideas and other material
        you upload, create or publish with the Service, including AI output generated for you.{" "}
        <strong>You own your content.</strong>
      </p>
      <p>
        You give us a worldwide, non-exclusive, royalty-free license to host, store, copy, process,
        adapt (for example, resize or transcode for a network&apos;s format), display and transmit
        your content only as needed to provide the Service to you, including publishing it to the
        networks you choose. This license ends when you delete the content or your account, except
        for copies in backups that are overwritten on a regular schedule and content already
        published to a network. We do not use your content to train AI models and we do not sell it.
      </p>
      <p>
        You are responsible for your content and confirm that you have all rights needed to publish
        it, including rights to music, footage, images, trademarks and the likeness of anyone who
        appears in it, and that publishing it does not break the law or any network&apos;s rules.
      </p>

      <h2 id="ai">6. AI features</h2>
      <ul>
        <li>
          AI features generate suggestions, such as captions, hashtags, images and video clips, from
          the inputs you provide. Output may be inaccurate, offensive, similar to other people&apos;s
          output, or protected by someone else&apos;s rights.
        </li>
        <li>
          Review AI output before you publish it. You decide what gets posted, and you are
          responsible for it, including labeling AI-generated or altered content where a network or
          the law requires it.
        </li>
        <li>
          As between you and us, you own the output generated for you, to the extent the law allows
          it to be owned.
        </li>
        <li>
          Do not use AI features to create content that is illegal, deceptive, sexual content
          involving minors, harassing, or that impersonates a real person without permission.
        </li>
      </ul>

      <h2 id="acceptable-use">7. Acceptable use</h2>
      <p>You agree not to use the Service to:</p>
      <ul>
        <li>break any law or anyone else&apos;s rights, including intellectual property and privacy rights;</li>
        <li>post spam, artificially inflate engagement, or run fake, automated or coordinated inauthentic accounts;</li>
        <li>connect a social account you are not authorized to manage;</li>
        <li>publish content that is illegal, hateful, harassing, violent, sexually exploitative, or that misleads people about who you are;</li>
        <li>violate any social network&apos;s terms, community guidelines or API rules;</li>
        <li>upload malware, or probe, scan, overload or interfere with the Service or its security;</li>
        <li>scrape the Service, access it by automated means other than features we provide, or get around usage limits;</li>
        <li>copy, resell or reverse engineer the Service, or use it to build a competing product;</li>
        <li>help or encourage anyone else to do any of these things.</li>
      </ul>

      <h2 id="plans">8. Plans, billing and cancellation</h2>
      <p>
        {site.name} is free during early access. When paid plans are available, we will show the
        price, what is included and the billing period before you buy, and these terms apply:
      </p>
      <ul>
        <li>
          <strong>Automatic renewal.</strong> Paid plans renew automatically at the end of each
          billing period (monthly or yearly) at the then-current price, and we charge your payment
          method through our payment processor, Stripe, until you cancel.
        </li>
        <li>
          <strong>Cancel anytime.</strong> You can cancel online in your account settings. Your plan
          stays active until the end of the period you paid for and does not renew.
        </li>
        <li>
          <strong>Free trials.</strong> If a plan starts with a free trial, we will tell you when the
          trial ends and the price that will be charged. Cancel before it ends to avoid being charged.
        </li>
        <li>
          <strong>Price changes.</strong> We will email you at least 30 days before a price increase
          takes effect for your plan. You can cancel before then.
        </li>
        <li>
          <strong>Refunds.</strong> Payments are non-refundable and we do not give credit for
          partial periods, except where the law requires a refund or we decide to give one.
        </li>
        <li>
          <strong>Taxes.</strong> Prices do not include taxes unless stated; you pay applicable taxes.
        </li>
        <li>
          <strong>Failed payments.</strong> If a payment fails, we may limit paid features until it
          is resolved.
        </li>
      </ul>
      <p>
        Purchases made through the Apple App Store or Google Play are billed, renewed, cancelled
        and refunded by Apple or Google under their terms.
      </p>

      <h2 id="mobile">9. Mobile apps</h2>
      <p>
        We grant you a personal, non-transferable, non-exclusive license to install and use the{" "}
        {site.name} mobile apps on devices you own or control, under these Terms. If you download an
        app from the Apple App Store, you also agree that: these Terms are between you and us, not
        Apple; Apple has no obligation to provide maintenance or support for the app; to the extent
        allowed by law, Apple has no warranty obligation for the app, and if the app fails to meet
        an applicable warranty you may notify Apple, which may refund the purchase price; Apple is
        not responsible for any claims relating to the app, including product liability, legal or
        regulatory compliance, consumer protection, privacy or intellectual property claims; you
        are not in a country subject to a U.S. Government embargo or listed on a U.S. Government
        list of prohibited or restricted parties; you will comply with applicable third-party terms
        when using the app; and Apple and its subsidiaries are third-party beneficiaries of these
        Terms and may enforce them against you.
      </p>

      <h2 id="our-ip">10. Our intellectual property</h2>
      <p>
        The Service, including its software, design, text and graphics, and the {site.name} and
        HyperVivid names and logos, belong to {site.company.legalName} or its licensors and are
        protected by law. Except for the rights these Terms give you, we keep all rights. If you send
        us feedback or ideas, we may use them without any obligation to you.
      </p>

      <h2 id="copyright">11. Copyright complaints</h2>
      <p>
        We respect intellectual property rights. If you believe content stored on the Service
        infringes your copyright, send a notice to{" "}
        <a href={mailto("Copyright notice")}>{site.contactEmail}</a> or to our address below that
        includes: your signature; identification of the work you claim is infringed; identification
        of the material and where it is on the Service; your contact details; a statement that you
        believe in good faith the use is not authorized by the owner, its agent or the law; and a
        statement, under penalty of perjury, that your notice is accurate and that you are the owner
        or authorized to act for the owner. We may remove material and will terminate the accounts of
        repeat infringers in appropriate cases. Content already published to a social network must
        be reported to that network.
      </p>

      <h2 id="termination">12. Suspension and termination</h2>
      <p>
        You can stop using the Service and delete your account at any time; see{" "}
        <Link href={routes.dataDeletion}>Data Deletion</Link>. We may suspend or end your access if
        you seriously or repeatedly break these Terms, if a social network or the law requires it,
        or to protect the Service, other users or the public. Where it is reasonable, we will tell
        you in advance and give you a chance to fix the problem and to export your content. If we
        end a paid plan without cause, we will refund the unused part of your prepaid fees. Sections
        5 (license limits), 6, 10, and 13 through 18 survive termination.
      </p>

      <h2 id="disclaimers">13. Disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;. TO THE FULLEST
        EXTENT THE LAW ALLOWS, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. WE DO NOT
        PROMISE THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE, THAT EVERY POST WILL PUBLISH ON
        TIME OR AT ALL, THAT AI OUTPUT WILL BE ACCURATE, OR THAT USING THE SERVICE WILL GROW YOUR
        AUDIENCE OR INCOME. Some jurisdictions do not allow these exclusions, so some may not apply
        to you.
      </p>

      <h2 id="liability">14. Limitation of liability</h2>
      <p>
        TO THE FULLEST EXTENT THE LAW ALLOWS, {site.company.legalName.toUpperCase()} AND ITS
        MEMBERS, EMPLOYEES AND SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
        CONSEQUENTIAL OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, REVENUE, DATA, FOLLOWERS OR GOODWILL,
        ARISING FROM THE SERVICE OR THESE TERMS, EVEN IF ADVISED OF THEIR POSSIBILITY. OUR TOTAL
        LIABILITY FOR ALL CLAIMS RELATING TO THE SERVICE OR THESE TERMS IS LIMITED TO THE GREATER
        OF US $100 OR THE AMOUNT YOU PAID US FOR THE SERVICE IN THE 12 MONTHS BEFORE THE EVENT GIVING
        RISE TO THE CLAIM. These limits do not apply to liability that cannot be limited by law,
        such as for fraud or for death or personal injury caused by negligence.
      </p>

      <h2 id="indemnity">15. Indemnity</h2>
      <p>
        To the extent the law allows, you will defend and indemnify {site.company.legalName}{" "}
        against third-party claims, and related losses and reasonable legal fees, arising from your
        content, your use of the Service, or your breach of these Terms, a social network&apos;s
        terms or the law. We will tell you about any such claim and may take part in the defense
        with our own lawyers.
      </p>

      <h2 id="disputes">16. Governing law and disputes</h2>
      <p>
        These Terms are governed by the laws of the State of Michigan and applicable U.S. federal
        law, without regard to conflict of law rules. Before filing a claim, you and we agree to try
        to resolve the dispute informally for 30 days, starting when one side emails the other a
        description of the dispute. If it is not resolved, any claim must be brought only in the
        state or federal courts located in Oakland County, Michigan, and you and we consent to
        their jurisdiction. TO THE EXTENT THE LAW ALLOWS, CLAIMS MUST BE BROUGHT INDIVIDUALLY AND
        NOT AS A CLASS OR REPRESENTATIVE ACTION, AND YOU AND WE WAIVE THE RIGHT TO A JURY TRIAL.
        Nothing here limits rights you have under the mandatory consumer protection laws of the
        place you live.
      </p>

      <h2 id="changes">17. Changes to these terms</h2>
      <p>
        We may update these Terms. We will post the new version here and update the dates at the
        top. For material changes, we will notify you by email or in the app at least 14 days
        before they take effect, unless a change is required sooner by law or for security. If you
        keep using the Service after a change takes effect, you accept the updated Terms; if you do
        not agree, stop using the Service and you may delete your account.
      </p>

      <h2 id="general">18. General</h2>
      <p>
        These Terms and the Privacy Policy are the entire agreement between you and us about the
        Service. If any part is found unenforceable, the rest stays in effect. If we do not enforce
        a right, we have not waived it. You may not transfer these Terms without our consent; we may
        transfer them as part of a merger, acquisition or sale of assets. There are no third-party
        beneficiaries except as stated in section 9. We are not liable for delays caused by events
        beyond our reasonable control, including outages or API changes at a social network. We may
        send you notices by email or in the app.
      </p>

      <h2 id="contact">19. Contact</h2>
      <p>
        {postalAddress()}
        <br />
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
      </p>
    </LegalPage>
  );
}
