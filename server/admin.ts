import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Promote a user to admin (only owner can do this)
 */
export async function promoteToAdmin(userId: number, ownerUserId: number): Promise<boolean> {
  // Check if requester is owner
  const db = await getDb();
  if (!db) return false;

  const owner = await db.select().from(users).where(eq(users.id, ownerUserId)).limit(1);
  if (!owner[0] || owner[0].role !== "admin") {
    throw new Error("Only owner can promote users to admin");
  }

  // Promote user
  try {
    await db
      .update(users)
      .set({ role: "admin" })
      .where(eq(users.id, userId));
    return true;
  } catch (error) {
    console.error("[Admin] Failed to promote user:", error);
    return false;
  }
}

/**
 * Demote an admin to regular user (only owner can do this)
 */
export async function demoteFromAdmin(userId: number, ownerUserId: number): Promise<boolean> {
  // Check if requester is owner
  const db = await getDb();
  if (!db) return false;

  const owner = await db.select().from(users).where(eq(users.id, ownerUserId)).limit(1);
  if (!owner[0] || owner[0].role !== "admin") {
    throw new Error("Only owner can demote admins");
  }

  // Prevent demoting owner
  if (userId === ownerUserId) {
    throw new Error("Cannot demote the owner");
  }

  // Demote user
  try {
    await db
      .update(users)
      .set({ role: "user" })
      .where(eq(users.id, userId));
    return true;
  } catch (error) {
    console.error("[Admin] Failed to demote user:", error);
    return false;
  }
}

/**
 * Get all admins
 */
export async function getAllAdmins() {
  const db = await getDb();
  if (!db) return [];

  try {
    const admins = await db.select().from(users).where(eq(users.role, "admin"));
    return admins;
  } catch (error) {
    console.error("[Admin] Failed to get admins:", error);
    return [];
  }
}
