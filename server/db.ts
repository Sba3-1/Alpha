import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { InsertUser, users, bots, InsertBot } from "../drizzle/schema";
import { ENV } from './_core/env';
import { sql } from "drizzle-orm";

let _pool: pg.Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

// Create a connection pool to handle timeouts and reconnections better
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      console.log("[Database] Initializing Postgres connection pool...");
      _pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 20000,
      });
      _db = drizzle(_pool);
      console.log("[Database] Postgres connection pool initialized successfully.");
      
      // Ensure tables exist
      await ensureTablesExist(_db);
    } catch (error) {
      console.error("[Database] Failed to initialize connection pool:", error);
      _db = null;
    }
  }
  return _db;
}

async function ensureTablesExist(db: any) {
  try {
    console.log("[Database] Ensuring tables exist...");
    
    // Create users table if not exists
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "openId" VARCHAR(64) NOT NULL UNIQUE,
        "name" TEXT,
        "email" VARCHAR(320),
        "loginMethod" VARCHAR(64),
        "role" TEXT DEFAULT 'user' NOT NULL,
        "discordId" VARCHAR(64) UNIQUE,
        "discordUsername" VARCHAR(255),
        "discordAvatar" TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
        "lastSignedIn" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    // Create bots table if not exists
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "bots" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "type" VARCHAR(100) NOT NULL,
        "price" INTEGER NOT NULL,
        "purchaseLink" TEXT,
        "inviteLink" TEXT,
        "imageUrl" TEXT,
        "soldOut" INTEGER DEFAULT 0 NOT NULL,
        "adminId" INTEGER NOT NULL,
        "token" TEXT,
        "userId" INTEGER,
        "status" VARCHAR(20) DEFAULT 'stopped' NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    // Add columns if they don't exist (for existing tables)
    try {
      await db.execute(sql`ALTER TABLE "bots" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;`);
      await db.execute(sql`ALTER TABLE "bots" ADD COLUMN IF NOT EXISTS "soldOut" INTEGER DEFAULT 0 NOT NULL;`);
      await db.execute(sql`ALTER TABLE "bots" ADD COLUMN IF NOT EXISTS "token" TEXT;`);
      await db.execute(sql`ALTER TABLE "bots" ADD COLUMN IF NOT EXISTS "userId" INTEGER;`);
      await db.execute(sql`ALTER TABLE "bots" ADD COLUMN IF NOT EXISTS "status" VARCHAR(20) DEFAULT 'stopped' NOT NULL;`);
      await db.execute(sql`ALTER TABLE "bots" ADD COLUMN IF NOT EXISTS "inviteLink" TEXT;`);
      // Make purchaseLink nullable if it isn't already
      await db.execute(sql`ALTER TABLE "bots" ALTER COLUMN "purchaseLink" DROP NOT NULL;`);
    } catch (e) {
      console.log("[Database] Columns already exist or error adding them.");
    }
    
    console.log("[Database] Tables checked/created successfully.");
  } catch (error) {
    console.error("[Database] Error ensuring tables exist:", error);
  }
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
    const updateSet: any = {};
    if (user.name !== undefined) updateSet.name = user.name;
    if (user.email !== undefined) updateSet.email = user.email;
    if (user.loginMethod !== undefined) updateSet.loginMethod = user.loginMethod;
    if (user.discordId !== undefined) updateSet.discordId = user.discordId;
    if (user.discordUsername !== undefined) updateSet.discordUsername = user.discordUsername;
    if (user.discordAvatar !== undefined) updateSet.discordAvatar = user.discordAvatar;
    if (user.lastSignedIn !== undefined) updateSet.lastSignedIn = user.lastSignedIn;
    
    if (user.role !== undefined) {
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      updateSet.role = 'admin';
    }

    await db.insert(users)
      .values(user)
      .onConflictDoUpdate({
        target: users.openId,
        set: updateSet
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

  const result = await db.insert(bots).values(bot).returning();
  return result[0];
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

export async function getBotsByUserId(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user bots: database not available");
    return [];
  }

  return await db.select().from(bots).where(eq(bots.userId, userId));
}

export async function updateBotStatus(botId: number, status: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update bot status: database not available");
    return undefined;
  }

  return await db.update(bots).set({ status }).where(eq(bots.id, botId));
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

    console.log("[Database] Upserting Discord user (Postgres):", values.openId);
    
    await db.insert(users)
      .values(values)
      .onConflictDoUpdate({
        target: users.openId,
        set: {
          discordUsername: data.discordUsername,
          discordAvatar: data.discordAvatar,
          email: data.discordEmail,
          lastSignedIn: new Date(),
        }
      });

    const userResult = await db.select().from(users).where(eq(users.openId, values.openId)).limit(1);
    
    if (userResult.length === 0) {
      console.warn("[Database] User not found after upsert for openId:", values.openId);
      return undefined;
    }
    
    console.log("[Database] Successfully upserted and retrieved user:", userResult[0].id);
    return userResult[0];
  } catch (error) {
    console.error("[Database] Failed to upsert Discord user:", error);
    throw error;
  }
}
