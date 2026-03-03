import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import { userBots, botTokens, InsertUserBot, InsertBotToken, UserBot, BotToken } from "../drizzle/schema";

/**
 * User Bot Management Functions
 */

export async function getUserBots(userId: number): Promise<UserBot[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user bots: database not available");
    return [];
  }

  try {
    return await db.select().from(userBots).where(eq(userBots.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get user bots:", error);
    return [];
  }
}

export async function getUserBotById(userBotId: number, userId: number): Promise<UserBot | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user bot: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(userBots)
      .where(and(eq(userBots.id, userBotId), eq(userBots.userId, userId)))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get user bot:", error);
    return undefined;
  }
}

export async function createUserBot(data: InsertUserBot): Promise<UserBot | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create user bot: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(userBots).values(data).returning();
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to create user bot:", error);
    throw error;
  }
}

export async function updateUserBotStatus(userBotId: number, status: "running" | "stopped"): Promise<UserBot | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update user bot status: database not available");
    return undefined;
  }

  try {
    const result = await db
      .update(userBots)
      .set({ status, updatedAt: new Date() })
      .where(eq(userBots.id, userBotId))
      .returning();

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to update user bot status:", error);
    throw error;
  }
}

/**
 * Bot Token Management Functions
 */

export async function createBotToken(data: InsertBotToken): Promise<BotToken | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create bot token: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(botTokens).values(data).returning();
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to create bot token:", error);
    throw error;
  }
}

export async function getBotToken(userBotId: number): Promise<BotToken | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get bot token: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(botTokens).where(eq(botTokens.userBotId, userBotId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get bot token:", error);
    return undefined;
  }
}

export async function updateBotToken(userBotId: number, encryptedToken: string, discordBotId: string): Promise<BotToken | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update bot token: database not available");
    return undefined;
  }

  try {
    const result = await db
      .update(botTokens)
      .set({ encryptedToken, discordBotId, updatedAt: new Date() })
      .where(eq(botTokens.userBotId, userBotId))
      .returning();

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to update bot token:", error);
    throw error;
  }
}

export async function deleteBotToken(userBotId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete bot token: database not available");
    return;
  }

  try {
    await db.delete(botTokens).where(eq(botTokens.userBotId, userBotId));
  } catch (error) {
    console.error("[Database] Failed to delete bot token:", error);
    throw error;
  }
}
