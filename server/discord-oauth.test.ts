import { describe, expect, it } from "vitest";

describe("Discord OAuth Credentials", () => {
  it("should have valid Discord credentials in environment", async () => {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;

    expect(clientId).toBeDefined();
    expect(clientSecret).toBeDefined();
    expect(clientId).toMatch(/^\d+$/); // Discord IDs are numeric strings
    expect(clientSecret?.length).toBeGreaterThan(0);
    expect(clientSecret).toContain("_"); // Discord secrets contain underscores
  });

  it("should have properly formatted Discord credentials", async () => {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;

    // Client ID should be a long number
    expect(clientId?.length).toBeGreaterThan(15);
    
    // Client Secret should be a string with special characters
    expect(clientSecret?.length).toBeGreaterThan(20);
    expect(/[a-zA-Z0-9_\-]/.test(clientSecret || "")).toBe(true);
  });
});
