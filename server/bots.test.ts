import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

function createMockContext(user?: Partial<User>): TrpcContext {
  const defaultUser: User = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    discordId: null,
    discordUsername: null,
    discordAvatar: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user: user ? { ...defaultUser, ...user } : defaultUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("bots router", () => {
  describe("list", () => {
    it("returns empty array when no bots exist", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.bots.list();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("create", () => {
    it("requires admin role", async () => {
      const ctx = createMockContext({ role: "user" });
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.bots.create({
          name: "Test Bot",
          description: "A test bot",
          type: "utility",
          price: 9999,
          purchaseLink: "https://example.com",
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("allows admin to create bot", async () => {
      const ctx = createMockContext({ role: "admin" });
      const caller = appRouter.createCaller(ctx);

      const result = await caller.bots.create({
        name: "Test Bot",
        description: "A test bot",
        type: "utility",
        price: 9999,
        purchaseLink: "https://example.com",
      });

      expect(result).toBeDefined();
    });

    it("validates required fields", async () => {
      const ctx = createMockContext({ role: "admin" });
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.bots.create({
          name: "",
          description: "A test bot",
          type: "utility",
          price: 9999,
          purchaseLink: "https://example.com",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("Bot name is required");
      }
    });

    it("validates price is non-negative", async () => {
      const ctx = createMockContext({ role: "admin" });
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.bots.create({
          name: "Test Bot",
          description: "A test bot",
          type: "utility",
          price: -100,
          purchaseLink: "https://example.com",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("Price must be positive");
      }
    });

    it("validates purchase link is valid URL", async () => {
      const ctx = createMockContext({ role: "admin" });
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.bots.create({
          name: "Test Bot",
          description: "A test bot",
          type: "utility",
          price: 9999,
          purchaseLink: "not-a-url",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("Invalid purchase link");
      }
    });
  });

  describe("update", () => {
    it("requires admin role", async () => {
      const ctx = createMockContext({ role: "user" });
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.bots.update({
          id: 1,
          name: "Updated Bot",
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("returns NOT_FOUND for non-existent bot", async () => {
      const ctx = createMockContext({ role: "admin" });
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.bots.update({
          id: 99999,
          name: "Updated Bot",
        });
        expect.fail("Should have thrown NOT_FOUND error");
      } catch (error: any) {
        expect(error.code).toBe("NOT_FOUND");
      }
    });
  });

  describe("delete", () => {
    it("requires admin role", async () => {
      const ctx = createMockContext({ role: "user" });
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.bots.delete({ id: 1 });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("returns NOT_FOUND for non-existent bot", async () => {
      const ctx = createMockContext({ role: "admin" });
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.bots.delete({ id: 99999 });
        expect.fail("Should have thrown NOT_FOUND error");
      } catch (error: any) {
        expect(error.code).toBe("NOT_FOUND");
      }
    });
  });
});
