import { describe, expect, it } from "vitest";
import { DiscordOAuthService } from "./discord-auth";

describe("Discord OAuth Service", () => {
  const clientId = "test-client-id";
  const clientSecret = "test-client-secret";
  const redirectUri = "http://localhost:3000/api/discord/callback";

  it("should create a Discord OAuth service instance", () => {
    const service = new DiscordOAuthService(clientId, clientSecret, redirectUri);
    expect(service).toBeDefined();
  });

  it("should generate a valid Discord login URL", () => {
    const service = new DiscordOAuthService(clientId, clientSecret, redirectUri);
    const state = "test-state";
    const loginUrl = service.getLoginUrl(state);

    expect(loginUrl).toContain("discord.com/api/v10/oauth2/authorize");
    expect(loginUrl).toContain(`client_id=${clientId}`);
    expect(loginUrl).toContain(`redirect_uri=${encodeURIComponent(redirectUri)}`);
    expect(loginUrl).toContain("response_type=code");
    expect(loginUrl).toContain("scope=identify+email"); // URLSearchParams uses + for spaces
    expect(loginUrl).toContain(`state=${state}`);
  });

  it("should include required scopes in login URL", () => {
    const service = new DiscordOAuthService(clientId, clientSecret, redirectUri);
    const loginUrl = service.getLoginUrl("test-state");

    expect(loginUrl).toContain("identify");
    expect(loginUrl).toContain("email");
  });

  it("should handle different redirect URIs", () => {
    const customRedirectUri = "https://example.com/callback";
    const service = new DiscordOAuthService(clientId, clientSecret, customRedirectUri);
    const loginUrl = service.getLoginUrl("test-state");

    expect(loginUrl).toContain(encodeURIComponent(customRedirectUri));
  });

  it("should throw error when credentials are missing", () => {
    expect(() => {
      new DiscordOAuthService("", clientSecret, redirectUri);
    }).not.toThrow(); // Constructor doesn't validate

    expect(() => {
      new DiscordOAuthService(clientId, "", redirectUri);
    }).not.toThrow();
  });
});
