import { z } from "zod";

/**
 * Mirrors the database in supabase/migrations. Keep the two in step: the
 * database is the source of truth and enforces every rule here again.
 */
export const workspaceKindSchema = z.enum(["creator", "agency"]);
export const workspaceRoleSchema = z.enum(["owner", "editor"]);

export type WorkspaceKind = z.infer<typeof workspaceKindSchema>;
export type WorkspaceRole = z.infer<typeof workspaceRoleSchema>;

const name = z.string().trim().min(1, "Name is required").max(80, "Keep it under 80 characters");

export const workspaceSchema = z.object({
  id: z.uuid(),
  name,
  kind: workspaceKindSchema,
  seat_limit: z.number().int().min(1).max(100),
  created_by: z.uuid().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Workspace = z.infer<typeof workspaceSchema>;

export const brandSchema = z.object({
  id: z.uuid(),
  workspace_id: z.uuid(),
  name,
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Use a hex color like #FF3366")
    .nullable(),
  created_by: z.uuid().nullable(),
  archived_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Brand = z.infer<typeof brandSchema>;

/** What a client may send when creating a brand. */
export const newBrandSchema = brandSchema.pick({ workspace_id: true, name: true, color: true }).extend({
  color: brandSchema.shape.color.optional(),
});
export type NewBrand = z.infer<typeof newBrandSchema>;

export interface RoleAbilities {
  readonly manageBrands: boolean;
  readonly deleteBrands: boolean;
  readonly renameWorkspace: boolean;
  readonly manageMembers: boolean;
}

/** UI-side view of what the database policies allow each role to do. */
export function abilitiesFor(role: WorkspaceRole): RoleAbilities {
  const owner = role === "owner";
  return { manageBrands: true, deleteBrands: owner, renameWorkspace: owner, manageMembers: owner };
}

export function seatsLeft(workspace: Pick<Workspace, "seat_limit">, memberCount: number): number {
  return Math.max(0, workspace.seat_limit - memberCount);
}
