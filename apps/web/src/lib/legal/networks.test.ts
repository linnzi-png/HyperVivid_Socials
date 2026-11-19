import { describe, expect, it } from "vitest";
import { mailto, postalAddress, routes, site } from "../site";
import { googleLimitedUseStatement, networkDataUses } from "./networks";

describe("network data uses shown in the privacy policy", () => {
  it("covers every launch network exactly once", () => {
    expect(networkDataUses.map((n) => n.id).sort()).toEqual(
      ["facebook", "instagram", "linkedin", "tiktok", "youtube"],
    );
  });

  it.each(networkDataUses)("$name lists scopes, data, uses and https links", (n) => {
    expect(n.scopes.length).toBeGreaterThan(0);
    expect(n.data.length).toBeGreaterThan(0);
    expect(n.uses.length).toBeGreaterThan(0);
    expect(new Set(n.scopes).size).toBe(n.scopes.length);
    expect(n.revokeUrl).toMatch(/^https:\/\//);
    expect(n.privacyUrl).toMatch(/^https:\/\//);
  });

  it("YouTube revocation points to the Google security settings page the YouTube policies name", () => {
    const youtube = networkDataUses.find((n) => n.id === "youtube");
    expect(youtube?.revokeUrl).toBe("https://security.google.com/settings/security/permissions");
  });

  it("keeps Google's Limited Use disclosure wording", () => {
    expect(googleLimitedUseStatement).toBe(
      "Amplivid's use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.",
    );
  });
});

describe("site facts", () => {
  it("names the app and the legal entity the developer consoles use", () => {
    expect(site.name).toBe("Amplivid");
    expect(site.company.legalName).toBe("HyperVivid Studios LLC");
    expect(postalAddress()).toContain("Huntington Woods, MI 48070");
    expect(site.contactEmail).toBe("amplivid@hypervividstudios.com");
  });

  it("serves the legal pages at stable paths", () => {
    expect(routes).toMatchObject({ privacy: "/privacy", terms: "/terms", dataDeletion: "/data-deletion" });
  });

  it("builds an encoded mailto link", () => {
    expect(mailto("Privacy Request")).toBe(`mailto:${site.contactEmail}?subject=Privacy%20Request`);
  });
});
