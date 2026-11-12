import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import pg from "pg";
import { databaseUrl } from "./db";

/**
 * With DB_TEST_BOOTSTRAP=1 the target database is treated as plain Postgres:
 * the auth shim and every migration are applied before the tests. Without it
 * (CI, `supabase start`), the stack has already applied the migrations.
 */
export default async function setup(): Promise<void> {
  if (process.env.DB_TEST_BOOTSTRAP !== "1") return;

  const client = new pg.Client({ connectionString: databaseUrl() });
  await client.connect();
  try {
    const { rows } = await client.query<{ exists: boolean }>(
      "select exists (select 1 from pg_namespace where nspname = 'auth') as exists",
    );
    if (rows[0]?.exists) {
      throw new Error("DB_TEST_BOOTSTRAP=1 needs an empty database, but schema auth already exists");
    }
    const here = import.meta.dirname;
    await client.query(await readFile(join(here, "auth-shim.sql"), "utf8"));
    const dir = join(here, "..", "..", "migrations");
    for (const file of (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort()) {
      await client.query(await readFile(join(dir, file), "utf8"));
    }
  } finally {
    await client.end();
  }
}
