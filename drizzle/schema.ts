import { integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

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
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: pgEnum("role", ["user", "admin"])("role").default("user").notNull(),
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
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 100 }).notNull(), // e.g., "moderation", "utility", "fun", "music"
  price: integer("price").notNull(), // Price in cents (e.g., 9999 = 99.99 SAR)
  purchaseLink: text("purchaseLink").notNull(), // Link to purchase/invite the bot
  inviteLink: text("inviteLink"), // Discord invite link for the bot
  imageUrl: text("imageUrl"), // Bot profile image URL
  soldOut: integer("soldOut").default(0).notNull(), // 0 = available, 1 = sold out
  adminId: integer("adminId").notNull(), // Reference to users table
  token: text("token"), // Bot token for starting/stopping
  userId: integer("userId"), // ID of the user who purchased the bot
  status: varchar("status", { length: 20 }).default("stopped").notNull(), // "running" or "stopped"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Bot = typeof bots.$inferSelect;
export type InsertBot = typeof bots.$inferInsert;
