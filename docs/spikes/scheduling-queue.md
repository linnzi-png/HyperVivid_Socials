# Spike: scheduling queue

Status: recommendation, 12 Nov 2026. Desk research plus design; the prototype is the next step (see the end).

## Question

Scheduled posts must go out on time, never twice, retry on failure, and alert the creator when they fail. Should we run this on **Supabase Queues + Supabase Cron**, or a **hosted workflow runner** (Vercel Workflow, Trigger.dev, Inngest)?

## What the work looks like

- A post is due at a minute-level time, often days ahead. Creators edit or cancel it right up to that time.
- Publishing calls one network API per target. Most of our five networks pull media from a URL we give them (TikTok `PULL_FROM_URL`, Instagram and Facebook video by URL). YouTube takes a resumable upload in chunks. So the publish step mostly makes API calls; it rarely holds a large file in memory.
- Heavy video work (trimming, captions, reframing) is a separate job type, covered by the phase 1 video spike.
- Network quotas apply (Instagram: 50 posts per account per 24 hours; YouTube daily quota), so the runner needs per-account rate limits.

## Options

| | Supabase Queues + Cron | Vercel Workflow | Trigger.dev |
| --- | --- | --- | --- |
| Delay until a date | `pg_cron` every minute enqueues due posts; `send(..., sleep_seconds)` also delays visibility | `sleep` with no max duration | `delay` option takes a date; runs can be rescheduled or cancelled |
| Retries | We write them: re-read after visibility timeout, count attempts, archive to a dead-letter queue | Built-in step retries | Built-in, with backoff |
| Exactly-once effect | Message delivered once per visibility window; we add an idempotency key on the publish attempt | Steps are durable; we still need our own key | `idempotencyKey` (30-day TTL by default) |
| Transactional with our data | Yes: scheduling a post and enqueuing it are one Postgres transaction | No: two systems to keep in sync | No: two systems to keep in sync |
| Worker runtime | Edge Function (400 s wall clock, 2 s CPU, 256 MB on paid plans) or a Vercel Function | Vercel Functions | Their machines, no hard timeout |
| Extra cost | None beyond the Supabase plan (Edge Functions: 2M invocations included on Pro) | Usage-based on the existing Vercel plan ($0.02 per 1K events) | New vendor: $0 to $50 a month plus compute; needs Linnzi's approval |
| Lock-in | Postgres; pgmq is open source | Workflow SDK is open source, with a Postgres "World" adapter | Open source, self-hostable |

Sources: [Supabase Queues API](https://supabase.com/docs/guides/queues/api), [Edge Function limits](https://supabase.com/docs/guides/functions/limits), [Edge Function pricing](https://supabase.com/docs/guides/functions/pricing), [Vercel Workflow](https://vercel.com/docs/workflows), [Vercel Workflow pricing](https://vercel.com/docs/workflows/pricing), [Trigger.dev pricing](https://trigger.dev/pricing), [Trigger.dev idempotency](https://trigger.dev/docs/idempotency).

## Recommendation

**Use Supabase Queues + Supabase Cron for scheduling, with the database as the single source of truth.** Reasons:

1. **Never twice and never lost come from Postgres, not the runner.** A `scheduled_posts` row moves through `scheduled -> queued -> publishing -> published | failed | cancelled`. Every transition is a conditional `update ... where status = <expected>`, so a duplicate message finds nothing to claim. Each publish attempt carries an idempotency key stored with a unique constraint, which also guards the network call where the API supports it. A hosted runner would still need all of this, because the post lives in our database.
2. **Edits and cancels are trivial.** Cancelling is one row update in the same transaction as the creator's edit. With a hosted runner we would also have to find and cancel the remote delayed run, and handle the race when it fires during the edit.
3. **No new vendor and no new spend.** It runs inside the Supabase plan we are already paying for.
4. **Our publish step is short.** URL-pull publishing and chunked YouTube uploads fit the Edge Function limits; anything longer goes to a Vercel Function.

Where a hosted runner wins: long-running compute with built-in retries. That is the video pipeline, not scheduling, so the phase 1 video spike should consider Trigger.dev or Vercel Workflow for video jobs specifically.

## Design sketch

- `scheduled_posts` (one row per post per network target) with `publish_at`, `status`, `attempts`, `last_error`, `idempotency_key`.
- `pg_cron` job every minute: `select private.enqueue_due_posts()`, which moves rows with `publish_at <= now()` from `scheduled` to `queued` and `pgmq.send`s their ids in the same transaction.
- A second `pg_cron` job calls the `publish-worker` Edge Function with `pg_net`. The worker reads a batch with a visibility timeout longer than its own deadline, claims each post (`queued -> publishing`), calls the publisher adapter from `packages/publishers`, then marks `published` and deletes the message, or records the error.
- Retries: if the worker dies, the message reappears after the visibility timeout. After 3 attempts the post goes to `failed`, the message is archived (dead-letter), and the creator gets a push and email alert.
- Rate limits: the worker checks a per-account counter before publishing and re-sends the message with a delay when the network's quota is used up.
- A watchdog cron flags any post still `queued` or `publishing` 10 minutes after `publish_at`.

## Next step: prototype (phase 1, before the scheduler ships)

1. Migration with `pgmq` and `pg_cron` enabled, `scheduled_posts`, and the enqueue and claim functions.
2. Tests: a due post is published exactly once with two workers racing; a cancelled post is never published; a crashing worker leads to a retry, then `failed` after 3 attempts; a post edited at the last second publishes the edited version or nothing.
3. Measure enqueue-to-publish latency with a fake adapter; the target is under 60 seconds.

If the prototype shows a problem (latency, `pg_net` reliability), the fallback is to keep the same table and state machine and swap only the trigger to Vercel Workflow, which needs no new vendor.
