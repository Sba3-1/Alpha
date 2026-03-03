import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: varchar("role", { length: 10 }).default("user").notNull(),
  // Discord profile fields
  discordId: varchar("discordId", { length: 64 }).unique(),
  discordUsername: varchar("discordUsername", { length: 255 }),
  discordAvatar: text("discordAvatar"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Bots table for the marketplace
 */
export const bots = pgTable("bots", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 100 }).notNull(), // e.g., "moderation", "utility", "fun", "music"
  price: integer("price").notNull(), // Price in cents (e.g., 9999 = 99.99 SAR)
  purchaseLink: text("purchaseLink").notNull(), // Link to purchase/invite the bot
  adminId: integer("adminId").notNull(), // Reference to users table
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Bot = typeof bots.$inferSelect;
export type InsertBot = typeof bots.$inferInsert;

/**
 * User-Bot relationship table for tracking bot ownership
 */
export const userBots = pgTable("user_bots", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(), // Reference to users table
  botId: integer("botId").notNull(), // Reference to bots table
  status: varchar("status", { length: 20 }).default("running").notNull(), // running, stopped
  purchaseDate: timestamp("purchaseDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type UserBot = typeof userBots.$inferSelect;
export type InsertUserBot = typeof userBots.$inferInsert;

/**
 * Bot tokens table for storing encrypted Discord bot tokens
 */
export const botTokens = pgTable("bot_tokens", {
  id: serial("id").primaryKey(),
  userBotId: integer("userBotId").notNull(), // Reference to user_bots table
  encryptedToken: text("encryptedToken").notNull(), // Encrypted Discord bot token
  discordBotId: varchar("discordBotId", { length: 64 }), // Discord bot ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type BotToken = typeof botTokens.$inferSelect;
export type InsertBotToken = typeof botTokens.$inferInsert;
