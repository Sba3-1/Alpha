import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { jwtVerify } from "jose";
import { COOKIE_NAME } from "@shared/const";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

/**
 * Extract and verify Discord JWT from cookies
 */
async function getUserFromToken(token: string): Promise<User | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as any;

    // Return minimal user object from token
    // In production, you'd fetch full user from database
    return {
      id: parseInt(payload.userId),
      openId: `discord_${payload.discordId}`,
      name: payload.discordUsername || null,
      email: null,
      loginMethod: "discord",
      discordId: payload.discordId,
      discordUsername: payload.discordUsername || null,
      discordAvatar: payload.discordAvatar || null,
      role: payload.role || "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };
  } catch (error) {
    return null;
  }
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Get JWT from cookies
    const cookies = opts.req.headers.cookie || "";
    const cookieArray = cookies.split(";");
    const sessionCookie = cookieArray.find((c) => c.trim().startsWith(`${COOKIE_NAME}=`));

    if (sessionCookie) {
      const token = sessionCookie.split("=")[1];
      if (token) {
        user = await getUserFromToken(token);
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
