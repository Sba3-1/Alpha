import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, bots, InsertBot } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "discordId", "discordUsername", "discordAvatar"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Bot management functions
export async function getAllBots() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get bots: database not available");
    return [];
  }

  return await db.select().from(bots);
}

export async function getBotById(botId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get bot: database not available");
    return undefined;
  }

  const result = await db.select().from(bots).where(eq(bots.id, botId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createBot(bot: InsertBot) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create bot: database not available");
    return undefined;
  }

  const result = await db.insert(bots).values(bot);
  return result;
}

export async function updateBot(botId: number, updates: Partial<InsertBot>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update bot: database not available");
    return undefined;
  }

  return await db.update(bots).set(updates).where(eq(bots.id, botId));
}

export async function deleteBot(botId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete bot: database not available");
    return undefined;
  }

  return await db.delete(bots).where(eq(bots.id, botId));
}

// Discord user management
export async function upsertDiscordUser(data: {
  discordId: string;
  discordUsername: string;
  discordEmail: string | null;
  discordAvatar: string | null;
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: Date;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert Discord user: database not available");
    return undefined;
  }

  try {
    const values: InsertUser = {
      openId: `discord_${data.discordId}`,
      name: data.discordUsername,
      email: data.discordEmail,
      loginMethod: "discord",
      discordId: data.discordId,
      discordUsername: data.discordUsername,
      discordAvatar: data.discordAvatar,
      lastSignedIn: new Date(),
    };

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: {
        discordUsername: data.discordUsername,
        discordAvatar: data.discordAvatar,
        email: data.discordEmail,
        lastSignedIn: new Date(),
      },
    });

    // Get the user back
    const user = await db.select().from(users).where(eq(users.discordId, data.discordId)).limit(1);
    return user.length > 0 ? user[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to upsert Discord user:", error);
    throw error;
  }
}
