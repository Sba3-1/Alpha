import { z } from "zod";
import { publicProcedure, protectedProcedure } from "../_core/trpc";
import { getUserBots, createUserBot, updateUserBotStatus, getBotToken, createBotToken, updateBotToken } from "../db-bots";
import { encryptToken, decryptToken, maskToken } from "../encryption";
import { getAllBots, getBotById } from "../db";

export const botsRouter = {
  /**
   * Get all marketplace bots
   */
  getAll: publicProcedure.query(async () => {
    return await getAllBots();
  }),

  /**
   * Get bot by ID
   */
  getById: publicProcedure.input(z.object({ botId: z.number() })).query(async ({ input }) => {
    return await getBotById(input.botId);
  }),

  /**
   * Get user's owned bots
   */
  getUserBots: protectedProcedure.query(async ({ ctx }) => {
    const bots = await getUserBots(ctx.user.id);
    return bots;
  }),

  /**
   * Purchase a bot (create user-bot relationship)
   */
  purchaseBot: protectedProcedure
    .input(
      z.object({
        botId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const bot = await getBotById(input.botId);
        if (!bot) {
          throw new Error("Bot not found");
        }

        // Check if user already owns this bot
        const userBots = await getUserBots(ctx.user.id);
        const alreadyOwns = userBots.some((ub) => ub.botId === input.botId);
        if (alreadyOwns) {
          throw new Error("You already own this bot");
        }

        const newUserBot = await createUserBot({
          userId: ctx.user.id,
          botId: input.botId,
          status: "running",
        });

        return newUserBot;
      } catch (error) {
        console.error("[Bots] Failed to purchase bot:", error);
        throw error;
      }
    }),

  /**
   * Add or update bot token
   */
  setToken: protectedProcedure
    .input(
      z.object({
        userBotId: z.number(),
        token: z.string().min(1),
        discordBotId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify user owns this bot
        const userBot = await getUserBots(ctx.user.id);
        const ownedBot = userBot.find((ub) => ub.id === input.userBotId);
        if (!ownedBot) {
          throw new Error("Bot not found or not owned by user");
        }

        // Encrypt token
        const encryptedToken = encryptToken(input.token);

        // Check if token already exists
        const existingToken = await getBotToken(input.userBotId);
        let result;

        if (existingToken) {
          result = await updateBotToken(input.userBotId, encryptedToken, input.discordBotId);
        } else {
          result = await createBotToken({
            userBotId: input.userBotId,
            encryptedToken,
            discordBotId: input.discordBotId,
          });
        }

        return {
          success: true,
          message: "Token saved successfully",
          maskedToken: maskToken(input.token),
        };
      } catch (error) {
        console.error("[Bots] Failed to set token:", error);
        throw error;
      }
    }),

  /**
   * Get bot token (for admin/owner only)
   */
  getToken: protectedProcedure
    .input(z.object({ userBotId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        // Verify user owns this bot
        const userBot = await getUserBots(ctx.user.id);
        const ownedBot = userBot.find((ub) => ub.id === input.userBotId);
        if (!ownedBot) {
          throw new Error("Bot not found or not owned by user");
        }

        const token = await getBotToken(input.userBotId);
        if (!token) {
          return null;
        }

        // Decrypt token for display
        const decryptedToken = decryptToken(token.encryptedToken);
        return {
          ...token,
          decryptedToken,
          maskedToken: maskToken(decryptedToken),
        };
      } catch (error) {
        console.error("[Bots] Failed to get token:", error);
        throw error;
      }
    }),

  /**
   * Update bot status (running/stopped)
   */
  updateStatus: protectedProcedure
    .input(
      z.object({
        userBotId: z.number(),
        status: z.enum(["running", "stopped"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify user owns this bot
        const userBot = await getUserBots(ctx.user.id);
        const ownedBot = userBot.find((ub) => ub.id === input.userBotId);
        if (!ownedBot) {
          throw new Error("Bot not found or not owned by user");
        }

        const updated = await updateUserBotStatus(input.userBotId, input.status);
        return updated;
      } catch (error) {
        console.error("[Bots] Failed to update status:", error);
        throw error;
      }
    }),
};
