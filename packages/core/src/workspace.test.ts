import { describe, expect, it } from "vitest";
import { abilitiesFor, newBrandSchema, seatsLeft } from "./workspace";
import { isSocialNetwork, SOCIAL_NETWORKS } from "./networks";

describe("abilitiesFor", () => {
  it("gives the owner everything", () => {
    expect(abilitiesFor("owner")).toEqual({
      manageBrands: true,
      deleteBrands: true,
      renameWorkspace: true,
      manageMembers: true,
    });
  });

  it("lets an editor manage brands but nothing destructive", () => {
    expect(abilitiesFor("editor")).toEqual({
      manageBrands: true,
      deleteBrands: false,
      renameWorkspace: false,
      manageMembers: false,
    });
  });
});

describe("seatsLeft", () => {
  it("counts remaining seats and never goes negative", () => {
    expect(seatsLeft({ seat_limit: 2 }, 1)).toBe(1);
    expect(seatsLeft({ seat_limit: 2 }, 2)).toBe(0);
    expect(seatsLeft({ seat_limit: 2 }, 5)).toBe(0);
  });
});

describe("newBrandSchema", () => {
  const ws = "8f14e45f-ceea-4e7a-9c2b-3b5a1d2e4f60";

  it("trims the name and accepts an optional hex color", () => {
    expect(newBrandSchema.parse({ workspace_id: ws, name: "  Cooking  " })).toEqual({ workspace_id: ws, name: "Cooking" });
    expect(newBrandSchema.parse({ workspace_id: ws, name: "Cooking", color: "#ff3366" }).color).toBe("#ff3366");
  });

  it("rejects blank names, long names and bad colors", () => {
    expect(newBrandSchema.safeParse({ workspace_id: ws, name: "   " }).success).toBe(false);
    expect(newBrandSchema.safeParse({ workspace_id: ws, name: "x".repeat(81) }).success).toBe(false);
    expect(newBrandSchema.safeParse({ workspace_id: ws, name: "Cooking", color: "red" }).success).toBe(false);
  });
});

describe("networks", () => {
  it("lists the five launch networks", () => {
    expect(SOCIAL_NETWORKS).toEqual(["tiktok", "youtube", "instagram", "facebook", "linkedin"]);
  });

  it("recognises network ids", () => {
    expect(isSocialNetwork("instagram")).toBe(true);
    expect(isSocialNetwork("x")).toBe(false);
    expect(isSocialNetwork(42)).toBe(false);
  });
});
