import { randomUUID } from "node:crypto";
import pg from "pg";

/** Supabase's local stack listens on 54322 with these credentials. */
export function databaseUrl(): string {
  return process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
}

export type Db = pg.Client;

export async function connect(): Promise<Db> {
  const client = new pg.Client({ connectionString: databaseUrl() });
  await client.connect();
  return client;
}

/** Creates a sign-up the way Supabase Auth does: a row in auth.users. */
export async function createUser(db: Db, displayName = "Test Creator"): Promise<string> {
  const id = randomUUID();
  await db.query(
    "insert into auth.users (id, email, raw_user_meta_data) values ($1, $2, $3)",
    [id, `${id}@example.test`, JSON.stringify({ display_name: displayName })],
  );
  return id;
}

/** The user's own creator workspace, read with superuser rights. */
export async function workspaceOf(db: Db, userId: string): Promise<string> {
  const { rows } = await db.query<{ workspace_id: string }>(
    "select workspace_id from public.workspace_members where user_id = $1 and role = 'owner'",
    [userId],
  );
  const id = rows[0]?.workspace_id;
  if (!id) throw new Error(`user ${userId} has no workspace`);
  return id;
}

/** Adds a member directly, as the server-side invitation flow will. */
export async function addEditor(db: Db, workspaceId: string, userId: string): Promise<void> {
  await db.query(
    "insert into public.workspace_members (workspace_id, user_id, role) values ($1, $2, 'editor')",
    [workspaceId, userId],
  );
}

type Role = { kind: "user"; id: string } | { kind: "anon" };

/**
 * Runs `fn` inside a transaction as the given API role, with the JWT claims
 * PostgREST would set, then rolls back so tests never leak writes.
 */
export async function as<T>(db: Db, role: Role, fn: (db: Db) => Promise<T>): Promise<T> {
  await db.query("begin");
  try {
    if (role.kind === "user") {
      await db.query("set local role authenticated");
      await db.query("select set_config('request.jwt.claims', $1, true)", [
        JSON.stringify({ sub: role.id, role: "authenticated" }),
      ]);
    } else {
      await db.query("set local role anon");
      await db.query("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ role: "anon" })]);
    }
    return await fn(db);
  } finally {
    await db.query("rollback");
  }
}

export const user = (id: string): Role => ({ kind: "user", id });
export const anon: Role = { kind: "anon" };
