import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { addEditor, anon, as, connect, createUser, type Db, user, workspaceOf } from "./support/db";

let db: Db;
let alice: string; // owner of workspace A
let bob: string; // owner of workspace B, a stranger to A
let erin: string; // editor invited to workspace A
let wsA: string;
let wsB: string;

beforeAll(async () => {
  db = await connect();
  alice = await createUser(db, "Alice");
  bob = await createUser(db, "Bob");
  erin = await createUser(db, "Erin");
  wsA = await workspaceOf(db, alice);
  wsB = await workspaceOf(db, bob);
  await addEditor(db, wsA, erin);
  await db.query("insert into public.brands (workspace_id, name) values ($1, 'Alice Cooks'), ($2, 'Bob Lifts')", [wsA, wsB]);
});

afterAll(async () => {
  await db.query("delete from auth.users where id = any($1)", [[alice, bob, erin]]);
  await db.end();
});

describe("sign-up", () => {
  it("creates a profile, a creator workspace and an owner membership", async () => {
    const id = await createUser(db, "Dana");
    try {
      const { rows } = await db.query(
        `select p.display_name, w.name, w.kind, w.seat_limit, m.role
           from public.profiles p
           join public.workspace_members m on m.user_id = p.id
           join public.workspaces w on w.id = m.workspace_id
          where p.id = $1`,
        [id],
      );
      expect(rows).toEqual([
        { display_name: "Dana", name: "Dana's workspace", kind: "creator", seat_limit: 2, role: "owner" },
      ]);
    } finally {
      await db.query("delete from auth.users where id = $1", [id]);
    }
  });
});

describe("isolation between creators", () => {
  it("a creator sees only their own workspace", async () => {
    const rows = await as(db, user(bob), async (q) => (await q.query("select id from public.workspaces")).rows);
    expect(rows).toEqual([{ id: wsB }]);
  });

  it("a creator cannot read another workspace's brands or members", async () => {
    await as(db, user(bob), async (q) => {
      const brands = await q.query("select name from public.brands");
      expect(brands.rows).toEqual([{ name: "Bob Lifts" }]);
      const members = await q.query("select user_id from public.workspace_members where workspace_id = $1", [wsA]);
      expect(members.rowCount).toBe(0);
    });
  });

  it("a creator cannot read a stranger's profile", async () => {
    const rows = await as(db, user(bob), async (q) => (await q.query("select id from public.profiles")).rows);
    expect(rows).toEqual([{ id: bob }]);
  });

  it("a creator cannot add a brand to another workspace", async () => {
    await as(db, user(bob), async (q) => {
      await expect(
        q.query("insert into public.brands (workspace_id, name) values ($1, 'Sneaky')", [wsA]),
      ).rejects.toThrow(/row-level security/);
    });
  });

  it("a creator cannot rename, edit or delete another workspace's data", async () => {
    await as(db, user(bob), async (q) => {
      expect((await q.query("update public.workspaces set name = 'pwned' where id = $1", [wsA])).rowCount).toBe(0);
      expect((await q.query("update public.brands set name = 'pwned' where workspace_id = $1", [wsA])).rowCount).toBe(0);
      expect((await q.query("delete from public.brands where workspace_id = $1", [wsA])).rowCount).toBe(0);
      expect((await q.query("update public.profiles set display_name = 'pwned' where id = $1", [alice])).rowCount).toBe(0);
    });
  });

  it("a creator cannot join someone else's workspace", async () => {
    await as(db, user(bob), async (q) => {
      await expect(
        q.query("insert into public.workspace_members (workspace_id, user_id, role) values ($1, $2, 'editor')", [wsA, bob]),
      ).rejects.toThrow(/permission denied/);
    });
  });
});

describe("signed-out visitors", () => {
  it.each(["profiles", "workspaces", "workspace_members", "brands"])("cannot read %s", async (table) => {
    await as(db, anon, async (q) => {
      await expect(q.query(`select * from public.${table}`)).rejects.toThrow(/permission denied/);
    });
  });
});

describe("the editor seat", () => {
  it("an editor reads the workspace, its brands and teammate profiles", async () => {
    await as(db, user(erin), async (q) => {
      expect((await q.query("select id from public.workspaces where id = $1", [wsA])).rowCount).toBe(1);
      expect((await q.query("select name from public.brands where workspace_id = $1", [wsA])).rows).toEqual([
        { name: "Alice Cooks" },
      ]);
      const profiles = (await q.query("select id from public.profiles order by id")).rows.map((r) => r.id);
      expect(profiles.sort()).toEqual([alice, erin].sort());
    });
  });

  it("an editor creates and edits brands but cannot delete them", async () => {
    await as(db, user(erin), async (q) => {
      const created = await q.query(
        "insert into public.brands (workspace_id, name, color) values ($1, 'Alice Travels', '#FF00AA') returning created_by",
        [wsA],
      );
      expect(created.rows[0]?.created_by).toBe(erin);
      expect((await q.query("update public.brands set color = '#000000' where workspace_id = $1", [wsA])).rowCount).toBe(2);
      expect((await q.query("delete from public.brands where workspace_id = $1", [wsA])).rowCount).toBe(0);
    });
  });

  it("an editor cannot rename the workspace", async () => {
    await as(db, user(erin), async (q) => {
      expect((await q.query("update public.workspaces set name = 'mine now' where id = $1", [wsA])).rowCount).toBe(0);
    });
  });

  it("an editor can leave but cannot remove the owner", async () => {
    await as(db, user(erin), async (q) => {
      expect((await q.query("delete from public.workspace_members where user_id = $1", [alice])).rowCount).toBe(0);
      const left = await q.query("delete from public.workspace_members where workspace_id = $1 and user_id = $2", [wsA, erin]);
      expect(left.rowCount).toBe(1);
    });
  });

  it("a creator workspace holds the owner plus one editor", async () => {
    const extra = await createUser(db, "Extra");
    try {
      await expect(addEditor(db, wsA, extra)).rejects.toThrow(/seat limit/);
    } finally {
      await db.query("delete from auth.users where id = $1", [extra]);
    }
  });
});

describe("the owner", () => {
  it("renames the workspace and deletes brands", async () => {
    await as(db, user(alice), async (q) => {
      expect((await q.query("update public.workspaces set name = 'Alice HQ' where id = $1", [wsA])).rowCount).toBe(1);
      expect((await q.query("delete from public.brands where workspace_id = $1", [wsA])).rowCount).toBe(1);
    });
  });

  it("cannot change protected workspace columns", async () => {
    await as(db, user(alice), async (q) => {
      await expect(q.query("update public.workspaces set seat_limit = 50 where id = $1", [wsA])).rejects.toThrow(
        /permission denied/,
      );
    });
  });

  it("removes the editor", async () => {
    await as(db, user(alice), async (q) => {
      expect((await q.query("delete from public.workspace_members where user_id = $1", [erin])).rowCount).toBe(1);
    });
  });

  it("an editor's own workspace stays theirs: leaving one never drops another's ownership", async () => {
    await as(db, user(erin), async (q) => {
      await expect(q.query("delete from public.workspace_members where user_id = $1", [erin])).rejects.toThrow(
        /owner cannot leave/,
      );
    });
  });

  it("cannot leave their own workspace", async () => {
    await as(db, user(alice), async (q) => {
      await expect(q.query("delete from public.workspace_members where user_id = $1", [alice])).rejects.toThrow(
        /owner cannot leave/,
      );
    });
  });
});

describe("account deletion", () => {
  it("removes the user's workspace and its brands", async () => {
    const id = await createUser(db, "Temp");
    const ws = await workspaceOf(db, id);
    await db.query("insert into public.brands (workspace_id, name) values ($1, 'Temp brand')", [ws]);
    await db.query("delete from auth.users where id = $1", [id]);
    const left = await db.query(
      "select (select count(*) from public.workspaces where id = $1)::int as ws, (select count(*) from public.brands where workspace_id = $1)::int as brands",
      [ws],
    );
    expect(left.rows[0]).toEqual({ ws: 0, brands: 0 });
  });
});

describe("schema guardrails", () => {
  it("every table in the public schema has row-level security on", async () => {
    const { rows } = await db.query(
      `select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
        where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity`,
    );
    expect(rows).toEqual([]);
  });
});
