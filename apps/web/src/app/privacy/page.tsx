import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import {
  googleLimitedUseStatement,
  googlePrivacyUrl,
  googleUserDataPolicyUrl,
  networkDataUses,
  youtubeTermsUrl,
} from "@/lib/legal/networks";
import { mailto, postalAddress, routes, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses, shares and protects your information, including data from TikTok, YouTube, Instagram, Facebook and LinkedIn.`,
  alternates: { canonical: routes.privacy },
};

const toc = [
  { id: "summary", label: "Summary" },
  { id: "who-we-are", label: "Who we are" },
  { id: "information-we-collect", label: "Information we collect" },
  { id: "social-accounts", label: "Connected social accounts" },
  { id: "google-youtube", label: "Google and YouTube data" },
  { id: "how-we-use", label: "How we use information" },
  { id: "ai", label: "AI features" },
  { id: "sharing", label: "How we share information" },
  { id: "cookies", label: "Cookies and similar technology" },
  { id: "retention", label: "How long we keep information" },
  { id: "security", label: "Security" },
  { id: "your-choices", label: "Your choices and rights" },
  { id: "us-state-rights", label: "US state privacy rights" },
  { id: "eea-uk", label: "EEA, UK and Swiss users" },
  { id: "children", label: "Children" },
  { id: "international", label: "International transfers" },
  { id: "changes", label: "Changes to this policy" },
  { id: "contact", label: "Contact us" },
] as const;

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      toc={toc}
      intro={
        <p>
          This policy explains what information {site.name} collects, why, who we share it with,
          and the choices you have. It covers the {site.name} website at amplivid.com, the{" "}
          {site.name} web app and the {site.name} mobile apps (together, the &quot;Service&quot;).
        </p>
      }
    >
      <h2 id="summary">1. Summary</h2>
      <ul>
        <li>
          {site.name} lets you connect your TikTok, YouTube, Instagram, Facebook and LinkedIn
          accounts so you can plan, create, schedule and publish posts and see how they perform.
        </li>
        <li>
          We access your social accounts only through each network&apos;s official login and API,
          and only for the permissions you approve on that network&apos;s consent screen. We never
          see your social media passwords.
        </li>
        <li>
          We publish only the content you create or approve, to the accounts you choose, at the
          time you choose.
        </li>
        <li>
          <strong>We do not sell your personal information</strong>, we do not share it for
          targeted advertising, and we do not use your content or social account data to train AI
          models.
        </li>
        <li>
          Access tokens for your social accounts are encrypted. You can disconnect an account or
          delete your {site.name} account at any time; see{" "}
          <Link href={routes.dataDeletion}>Data Deletion</Link>.
        </li>
        <li>
          {site.name} uses YouTube API Services. Google&apos;s handling of your data is described
          in the <a href={googlePrivacyUrl}>Google Privacy Policy</a>.
        </li>
      </ul>

      <h2 id="who-we-are">2. Who we are</h2>
      <p>
        {site.name} is operated by {site.company.legalName}, {site.company.kind} (&quot;we&quot;,
        &quot;us&quot;). We are the controller of the personal information described in this policy.
        Our address is {postalAddress()}. You can reach us about privacy at{" "}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>

      <h2 id="information-we-collect">3. Information we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li>
          <strong>Account information:</strong> your name, email address and password (stored only
          as a secure hash) or the sign-in provider you use, and your profile settings such as time
          zone and brand names.
        </li>
        <li>
          <strong>Your content:</strong> the videos, images, captions, hashtags, ideas, campaign
          plans, schedules and drafts you upload or create in {site.name}.
        </li>
        <li>
          <strong>Payment information:</strong> when paid plans are available, our payment
          processor, Stripe, collects your card details. We receive only your plan, billing status,
          the last four digits and expiry of your card, and your billing country and postal code.
        </li>
        <li>
          <strong>Communications:</strong> messages you send us, such as support requests, early
          access requests, feedback and privacy requests.
        </li>
      </ul>
      <h3>Information from your connected social accounts</h3>
      <p>
        When you connect a social account, the network shares the information described in{" "}
        <a href="#social-accounts">section 4</a> with us, plus an access token that lets{" "}
        {site.name} act on your behalf within the permissions you approved.
      </p>
      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <strong>Device and log data:</strong> IP address, browser and device type, operating
          system, app version, pages and screens viewed, the date and time of requests, and error
          reports. We use this to run, secure and fix the Service.
        </li>
        <li>
          <strong>Cookies and similar technology:</strong> see <a href="#cookies">section 9</a>.
        </li>
      </ul>
      <p>
        We do not knowingly collect sensitive personal information (such as health, biometric or
        precise location data), and we ask you not to include it in content you upload.
      </p>

      <h2 id="social-accounts">4. Connected social accounts</h2>
      <p>
        Connecting a social account is optional, and you choose which accounts to connect. For each
        network, the table below lists the permissions {site.name} requests, the data we receive,
        and what we use it for. We request a permission only when a feature you use needs it. We do
        not use social account data for advertising, and we do not sell it or share it with data
        brokers.
      </p>
      {networkDataUses.map((n) => (
        <div key={n.id}>
          <h3 id={`network-${n.id}`}>{n.name}</h3>
          <p>
            Connected through the {n.via}. Permissions requested:{" "}
            {n.scopes.map((s, i) => (
              <span key={s}>
                <code>{s}</code>
                {i < n.scopes.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
          <table>
            <thead>
              <tr>
                <th scope="col">Data we receive</th>
                <th scope="col">What we use it for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <ul>
                    {n.data.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {n.uses.map((u) => (
                      <li key={u}>{u}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            To remove {site.name}&apos;s access from the {n.name} side, use{" "}
            <a href={n.revokeUrl}>{n.revokeLabel}</a>. {n.name}&apos;s own handling of your data is
            covered by the <a href={n.privacyUrl}>{n.name} privacy policy</a>.
          </p>
        </div>
      ))}
      <p>
        Content you publish through {site.name} becomes subject to the publishing network&apos;s
        terms and privacy policy once it is posted. Deleting it from {site.name} does not delete it
        from the network; you can delete it there.
      </p>

      <h2 id="google-youtube">5. Google and YouTube data</h2>
      <p>
        {site.name} uses YouTube API Services to let you connect a YouTube channel, upload videos
        and see your channel and video statistics. By connecting YouTube you also agree to the{" "}
        <a href={youtubeTermsUrl}>YouTube Terms of Service</a>, and Google&apos;s use of your data
        is governed by the <a href={googlePrivacyUrl}>Google Privacy Policy</a>.
      </p>
      <p>
        <strong>{googleLimitedUseStatement}</strong> You can read that policy at{" "}
        <a href={googleUserDataPolicyUrl}>{googleUserDataPolicyUrl}</a>. In particular:
      </p>
      <ul>
        <li>
          We use Google user data only to provide and improve the user-facing features described in
          section 4, which you can see in the app.
        </li>
        <li>
          We do not use Google user data to serve advertising, and we do not sell it or transfer it
          to data brokers or information resellers.
        </li>
        <li>
          We do not use Google user data to develop, improve or train generalized or
          non-personalized AI or machine learning models.
        </li>
        <li>
          No person at {site.name} reads your Google user data unless you ask us to (for example,
          for support), it is needed for security or to comply with law, or it has been aggregated
          and anonymized for internal operations.
        </li>
        <li>
          We transfer Google user data to others only as needed to provide the Service (for example,
          to our hosting and database providers in section 8), to comply with law, or as part of a
          merger or acquisition with notice to you.
        </li>
      </ul>
      <p>
        <strong>Revoking access.</strong> You can disconnect YouTube in {site.name} at any time, or
        revoke {site.name}&apos;s access through the Google security settings page at{" "}
        <a href="https://security.google.com/settings/security/permissions">
          https://security.google.com/settings/security/permissions
        </a>
        . When you disconnect in {site.name}, we revoke the access token right away and delete the
        YouTube data we stored for you within 7 days. If you revoke access through Google, we delete
        it within 30 days. We refresh or delete stored YouTube statistics at least every 30 days.
      </p>
      <p>
        Questions or complaints about how we handle Google or YouTube data can be sent to{" "}
        <a href={mailto("YouTube data question")}>{site.contactEmail}</a>.
      </p>

      <h2 id="how-we-use">6. How we use information</h2>
      <p>We use the information above to:</p>
      <ul>
        <li>create and run your account, and sign you in securely;</li>
        <li>
          connect your social accounts, publish the posts you schedule, and show your post and
          account statistics;
        </li>
        <li>provide AI features you choose to use (see section 7);</li>
        <li>send service messages, such as a post that failed to publish or a security alert;</li>
        <li>
          send product news or early access invitations, only if you asked for them; you can opt out
          at any time with the link in each email;
        </li>
        <li>process payments when paid plans are available;</li>
        <li>answer your support and privacy requests;</li>
        <li>keep the Service secure, prevent fraud and abuse, and fix problems;</li>
        <li>understand how the Service is used, in aggregate, so we can improve it;</li>
        <li>comply with law and enforce our <Link href={routes.terms}>Terms of Service</Link>.</li>
      </ul>
      <p>
        We do not make decisions about you based solely on automated processing that have legal or
        similarly significant effects.
      </p>

      <h2 id="ai">7. AI features</h2>
      <p>
        When you use an AI feature, such as writing a caption, generating an image or clipping a
        video, we send the inputs needed for that request (for example, your prompt, draft text,
        brand settings, or the image or video you selected) to an AI model provider that processes
        it on our behalf and returns the result. Today our AI text provider is Anthropic, PBC. We
        will name any additional AI providers here before we start using them.
      </p>
      <ul>
        <li>Our AI providers process your inputs only to return results to you.</li>
        <li>
          Under our agreements, our AI providers may not use your inputs or results to train their
          models.
        </li>
        <li>We do not use your content or social account data to train AI models.</li>
        <li>
          AI output can be wrong or unexpected. Review it before you publish; you decide what gets
          posted.
        </li>
      </ul>

      <h2 id="sharing">8. How we share information</h2>
      <p>
        <strong>We do not sell personal information, and we do not share it for cross-context
        behavioral (targeted) advertising.</strong> We have not done so in the past 12 months. We
        share information only as follows:
      </p>
      <ul>
        <li>
          <strong>Social networks you connect,</strong> when you tell us to publish content or
          retrieve your statistics.
        </li>
        <li>
          <strong>Service providers</strong> who process information for us under contracts that
          limit their use of it to providing their services to us:
          <ul>
            <li>Supabase, Inc. (database, sign-in and file storage; United States);</li>
            <li>Vercel Inc. (website and app hosting; United States);</li>
            <li>Anthropic, PBC (AI text generation; United States);</li>
            <li>Stripe, Inc. (payments, when paid plans are available; United States);</li>
            <li>
              providers of email delivery, error monitoring and customer support tools, which we
              will name here when we add them.
            </li>
          </ul>
        </li>
        <li>
          <strong>Professional advisers,</strong> such as lawyers and accountants, under duties of
          confidentiality.
        </li>
        <li>
          <strong>Legal reasons,</strong> when we believe in good faith that disclosure is required
          by law or legal process, or needed to protect the rights, safety or property of our users,
          the public or us.
        </li>
        <li>
          <strong>Business transfers,</strong> as part of a merger, acquisition or sale of assets,
          subject to this policy, with notice to you.
        </li>
        <li>
          <strong>With your consent</strong> or at your direction.
        </li>
      </ul>

      <h2 id="cookies">9. Cookies and similar technology</h2>
      <p>
        {site.name} uses cookies and browser storage that are strictly necessary to run the Service:
        to keep you signed in, keep your session secure and remember your settings. The mobile apps
        store the same kind of information securely on your device. You can clear cookies in your
        browser, but you will be signed out.
      </p>
      <p>
        We do not use advertising cookies, retargeting pixels or social media tracking pixels. If we
        add analytics cookies, we will ask for your consent first where the law requires it, and we
        will update this policy. We honor Global Privacy Control (GPC) signals as a request to opt
        out of any sale or sharing of personal information and of non-essential cookies.
      </p>

      <h2 id="retention">10. How long we keep information</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Information</th>
            <th scope="col">How long</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Account information and your content</td>
            <td>While your account is open. Deleted within 30 days after you delete your account.</td>
          </tr>
          <tr>
            <td>Social account tokens</td>
            <td>Until you disconnect the account or delete your {site.name} account; then revoked and deleted right away.</td>
          </tr>
          <tr>
            <td>Social account data and statistics</td>
            <td>While the account is connected, refreshed regularly (YouTube data at least every 30 days). Deleted within 7 days after you disconnect it.</td>
          </tr>
          <tr>
            <td>Payment and tax records</td>
            <td>As long as tax and accounting law requires, usually 7 years.</td>
          </tr>
          <tr>
            <td>Support and privacy request records</td>
            <td>Up to 24 months after the request is closed.</td>
          </tr>
          <tr>
            <td>Server logs and security records</td>
            <td>Up to 90 days, longer only when needed to investigate a security incident.</td>
          </tr>
          <tr>
            <td>Backups</td>
            <td>Deleted data can remain in encrypted backups for up to 30 more days before it is overwritten.</td>
          </tr>
        </tbody>
      </table>
      <p>
        We may keep information longer when the law requires it or to resolve a dispute, and then
        only for that purpose.
      </p>

      <h2 id="security">11. Security</h2>
      <p>
        We protect information with encryption in transit (TLS) and at rest, encryption of social
        account access tokens, database access rules that keep each account&apos;s data separate,
        least-privilege staff access with multi-factor authentication, and regular review of our
        providers. No system is perfectly secure, so we cannot guarantee absolute security. If a
        breach affects your personal information, we will notify you and the authorities as the law
        requires.
      </p>

      <h2 id="your-choices">12. Your choices and rights</h2>
      <ul>
        <li>
          <strong>Disconnect a social account</strong> in {site.name} settings, or from the network
          (links in section 4).
        </li>
        <li>
          <strong>Delete your account and data:</strong> follow the steps on our{" "}
          <Link href={routes.dataDeletion}>Data Deletion</Link> page.
        </li>
        <li>
          <strong>Marketing emails:</strong> use the unsubscribe link in any email. We still send
          service messages about your account.
        </li>
        <li>
          <strong>Access, correct, download or delete your information,</strong> withdraw consent,
          or object to or restrict our processing: email{" "}
          <a href={mailto("Privacy Request")}>{site.contactEmail}</a> with the subject
          &quot;Privacy Request&quot;, or write to us at the address in section 18.
        </li>
      </ul>
      <p>
        We extend these rights to every user, wherever you live. We confirm receipt within 10
        business days and respond within 45 days (we may extend this once by 45 days and will tell
        you why). We will verify your request by confirming you control the email address on the
        account. You may use an authorized agent, who must show us your signed permission. We will
        not discriminate against you for exercising your rights. If we decline your request, you can
        appeal by replying to our decision within 60 days; we answer appeals within 45 days.
      </p>

      <h2 id="us-state-rights">13. US state privacy rights</h2>
      <p>
        Residents of California and of other states with comprehensive privacy laws (including
        Colorado, Connecticut, Delaware, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana,
        Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah and
        Virginia) have the rights described in section 12, including the right to know, access,
        correct, delete, and receive a portable copy of their personal information, and to opt out
        of its sale, sharing for targeted advertising, and profiling. We do not sell or share
        personal information, and we do not use or disclose sensitive personal information for
        purposes that would require a right to limit.
      </p>
      <p>
        <strong>California notice.</strong> In the past 12 months we collected these categories of
        personal information: identifiers (name, email, account IDs, IP address); customer records
        (billing details); commercial information (plan and payment history); internet or other
        electronic network activity (usage and log data); audio and visual information (videos and
        images you upload). We
        collected it from you, from your devices, and from the social networks you connected, for
        the purposes in section 6, and disclosed it to the service providers in section 8 for
        business purposes. We keep it for the periods in section 10. California residents may also
        ask, once a year, about disclosures to third parties for direct marketing (&quot;Shine the
        Light&quot;); we make no such disclosures. If you live in a state whose privacy law does
        not yet apply to a business of our size, we still honor these requests.
      </p>
      <p>
        If we deny your appeal, you can contact your state attorney general. Michigan residents can
        contact the Michigan Department of Attorney General, Consumer Protection Division.
      </p>

      <h2 id="eea-uk">14. EEA, UK and Swiss users</h2>
      <p>
        The Service is operated from the United States. If the GDPR or UK GDPR applies to you, we
        rely on these legal bases: performing our contract with you (running your account,
        connecting your social accounts and publishing your posts); your consent (marketing emails,
        optional cookies, and any AI feature or connection you choose to turn on, which you can
        withdraw at any time); our legitimate interests in securing, maintaining and improving the
        Service, balanced against your rights; and compliance with legal obligations. You also have
        the right to complain to your local data protection authority.
      </p>

      <h2 id="children">15. Children</h2>
      <p>
        The Service is not directed to children, and you must be at least 18 years old (or the age
        of majority where you live) to use it. We do not knowingly collect personal information
        from children under 13, or sell or share the personal information of anyone under 16. If you
        believe a child has given us personal information, contact us and we will delete it.
      </p>

      <h2 id="international">16. International transfers</h2>
      <p>
        We and our main service providers store and process information in the United States. When
        we transfer personal information from the EEA, UK or Switzerland, we rely on the EU-U.S.
        Data Privacy Framework (and its UK and Swiss extensions) where the recipient is certified,
        or on the European Commission&apos;s Standard Contractual Clauses and equivalent UK
        safeguards.
      </p>

      <h2 id="changes">17. Changes to this policy</h2>
      <p>
        We will post any change on this page and update the dates at the top. If a change is
        material, we will tell you by email or in the app before it takes effect and, where the law
        or a network&apos;s rules require it, ask you to accept the updated policy before you keep
        using the affected features.
      </p>

      <h2 id="contact">18. Contact us</h2>
      <p>
        {site.company.legalName}, Attn: Privacy
        <br />
        {site.company.street}, {site.company.city}, {site.company.region} {site.company.postalCode},{" "}
        {site.company.country}
        <br />
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
      </p>
    </LegalPage>
  );
}
