import type { Express, Request, Response } from "express";
import { initializeDiscordOAuth } from "./discord-auth";
import * as db from "./db";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { SignJWT } from "jose";
import { ENV } from "./_core/env";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

/**
 * Create a simple JWT session token for Discord auth
 */
async function createSessionToken(userId: string, discordId: string): Promise<string> {
  const token = await new SignJWT({
    userId,
    discordId,
    iat: Math.floor(Date.now() / 1000),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1y")
    .sign(JWT_SECRET);

  return token;
}

export function registerDiscordRoutes(app: Express) {
  // Get redirect URI - use environment variable or construct from request
  const getRedirectUri = (req: Request): string => {
    const redirectUri = process.env.DISCORD_REDIRECT_URI;
    if (redirectUri) {
      return redirectUri;
    }
    const protocol = req.protocol || "https";
    const host = req.get("host") || "localhost:3000";
    return `${protocol}://${host}/api/discord/callback`;
  };

  // Initialize Discord OAuth
  app.get("/api/discord/login", (req: Request, res: Response) => {
    try {
      const redirectUri = getRedirectUri(req);
      const discordOAuth = initializeDiscordOAuth(redirectUri);

      // Generate state for CSRF protection
      const state = Buffer.from(JSON.stringify({ redirect: "/" })).toString("base64");

      const loginUrl = discordOAuth.getLoginUrl(state);
      res.redirect(loginUrl);
    } catch (error: any) {
      console.error("[Discord Login] Error:", error);
      res.status(500).json({ error: "Failed to initiate Discord login" });
    }
  });

  // Discord OAuth callback
  app.get("/api/discord/callback", async (req: Request, res: Response) => {
    try {
      const code = req.query.code as string;
      const state = req.query.state as string;

      if (!code) {
        return res.status(400).json({ error: "Missing authorization code" });
      }

      const redirectUri = getRedirectUri(req);
      const discordOAuth = initializeDiscordOAuth(redirectUri);

      // Exchange code for token
      const tokenData = await discordOAuth.exchangeCodeForToken(code);

      // Get user info
      const discordUser = await discordOAuth.getUserInfo(tokenData.access_token);

      // Upsert user in database
      const user = await db.upsertDiscordUser({
        discordId: discordUser.id,
        discordUsername: discordUser.username,
        discordEmail: discordUser.email || null,
        discordAvatar: discordUser.avatar || null,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
      });

      if (!user) {
        return res.status(500).json({ error: "Failed to create user session" });
      }

      // Create session token
      const sessionToken = await createSessionToken(user.id.toString(), discordUser.id);

      // Set cookie
      res.cookie(COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: ONE_YEAR_MS,
        path: "/",
      });

      // Redirect to home or specified redirect URL
      const redirectPath = state ? JSON.parse(Buffer.from(state, "base64").toString()).redirect : "/";
      res.redirect(302, redirectPath);
    } catch (error: any) {
      console.error("[Discord Callback] Error:", error);
      res.status(500).json({ error: "Discord authentication failed" });
    }
  });

  // Logout endpoint
  app.post("/api/discord/logout", (req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.json({ success: true });
  });
}
