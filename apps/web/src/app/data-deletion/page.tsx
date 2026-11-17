import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { networkDataUses } from "@/lib/legal/networks";
import { mailto, routes, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Data Deletion",
  description: `How to disconnect your social accounts from ${site.name} and delete your ${site.name} data.`,
  alternates: { canonical: routes.dataDeletion },
};

const toc = [
  { id: "delete-account", label: "Delete your account" },
  { id: "disconnect", label: "Disconnect one social account" },
  { id: "from-the-network", label: "Remove access from the network" },
  { id: "by-email", label: "Ask us by email" },
  { id: "what-happens", label: "What gets deleted, and when" },
] as const;

export default function DataDeletionPage() {
  return (
    <LegalPage
      title="Data Deletion"
      toc={toc}
      intro={
        <p>
          You can remove {site.name}&apos;s access to any social account, or delete your{" "}
          {site.name} account and all of its data, at any time. Here is how.
        </p>
      }
    >
      <h2 id="delete-account">1. Delete your Amplivid account</h2>
      <ol>
        <li>Sign in to {site.name} on the web or in the mobile app.</li>
        <li>Open <strong>Settings</strong>, then <strong>Account</strong>.</li>
        <li>Choose <strong>Delete account</strong> and confirm.</li>
      </ol>
      <p>
        This disconnects every social account, revokes {site.name}&apos;s access tokens, and deletes
        your profile, workspaces, drafts, schedules, uploaded media and statistics. Paid plans are
        cancelled.
      </p>

      <h2 id="disconnect">2. Disconnect one social account</h2>
      <ol>
        <li>In {site.name}, open <strong>Settings</strong>, then <strong>Connected accounts</strong>.</li>
        <li>Choose the account and select <strong>Disconnect</strong>.</li>
      </ol>
      <p>
        We revoke the access token right away and delete the data we received from that account
        within 7 days. Your {site.name} account and your other connections stay as they are.
      </p>

      <h2 id="from-the-network">3. Remove access from the social network</h2>
      <p>
        You can also remove {site.name} from inside each network. When you do, we can no longer
        reach that account, and we delete the data we received from it within 30 days (within 7 days
        once we receive the network&apos;s deletion notice, where the network sends one).
      </p>
      <ul>
        {networkDataUses.map((n) => (
          <li key={n.id}>
            <strong>{n.name}:</strong> <a href={n.revokeUrl}>{n.revokeLabel}</a>
          </li>
        ))}
      </ul>
      <p>
        If you remove {site.name} from Facebook or Instagram, Meta notifies us and we start
        deleting your data automatically. To confirm the status of a deletion, email us with the
        confirmation code Meta shows you.
      </p>

      <h2 id="by-email">4. Ask us by email</h2>
      <p>
        If you cannot sign in, or want us to do it for you, email{" "}
        <a href={mailto("Data deletion request")}>{site.contactEmail}</a> from the address on your{" "}
        {site.name} account with the subject &quot;Data deletion request&quot;. Tell us whether you
        want your whole account deleted or only the data from one social account. We confirm within
        10 business days and finish within 30 days, and we email you when it is done.
      </p>

      <h2 id="what-happens">5. What gets deleted, and when</h2>
      <ul>
        <li>Social account access tokens: revoked and deleted right away.</li>
        <li>Data from a disconnected social account: deleted within 7 days.</li>
        <li>Your account, content and media after you delete your account: deleted within 30 days.</li>
        <li>Encrypted backups: overwritten within a further 30 days.</li>
        <li>
          Records we must keep by law, such as payment and tax records, are kept only as long as
          required and then deleted.
        </li>
      </ul>
      <p>
        Deleting data from {site.name} does not delete posts you already published to a social
        network. Delete those on the network itself. For more, see our{" "}
        <Link href={routes.privacy}>Privacy Policy</Link>.
      </p>
    </LegalPage>
  );
}
