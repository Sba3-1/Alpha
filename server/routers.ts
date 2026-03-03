import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getAllBots, getBotById, createBot, updateBot, deleteBot, getBotsByUserId, updateBotStatus } from "./db";
import { promoteToAdmin, demoteFromAdmin, getAllAdmins, promoteByUsername, getAllUsers } from "./admin";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const isAdmin = ctx.user.role === 'admin' || ctx.user.discordUsername === '6uvu' || ctx.user.discordUsername === '5mcm';
  if (!isAdmin) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx: { ...ctx, user: { ...ctx.user, role: 'admin' as const } } });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => {
      if (opts.ctx.user && (opts.ctx.user.discordUsername === '6uvu' || opts.ctx.user.discordUsername === '5mcm')) {
        return { ...opts.ctx.user, role: 'admin' as const };
      }
      return opts.ctx.user;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Bots marketplace procedures
  bots: router({
    // Get all bots (public)
    list: publicProcedure.query(async () => {
      return await getAllBots();
    }),

    // Get single bot by ID (public)
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getBotById(input.id);
      }),

    // Create bot (admin only)
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1, "Bot name is required"),
        description: z.string().min(1, "Description is required"),
        type: z.string().min(1, "Type is required"),
        price: z.number().int().min(0, "Price must be positive"),
        purchaseLink: z.string().url("Invalid purchase link"),
        inviteLink: z.string().url().optional().or(z.literal("")),
        imageUrl: z.string().url().optional().or(z.literal("")),
        soldOut: z.number().int().min(0).max(1).default(0),
        token: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await createBot({
          ...input,
          adminId: ctx.user.id,
        });
      }),

    // Update bot (admin only)
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        type: z.string().min(1).optional(),
        price: z.number().int().min(0).optional(),
        purchaseLink: z.string().url().optional(),
        inviteLink: z.string().url().optional().or(z.literal("")),
        imageUrl: z.string().url().optional().or(z.literal("")),
        soldOut: z.number().int().min(0).max(1).optional(),
        token: z.string().optional(),
        userId: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const bot = await getBotById(input.id);
        if (!bot) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Bot not found' });
        }
        if (bot.adminId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only edit your own bots' });
        }

        const { id, ...updates } = input;
        return await updateBot(id, updates);
      }),

    // Get bots owned by the current user
    myBots: protectedProcedure.query(async ({ ctx }) => {
      return await getBotsByUserId(ctx.user.id);
    }),

    // Start/Stop bot
    toggleStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        action: z.enum(["start", "stop"]),
      }))
      .mutation(async ({ input, ctx }) => {
        const bot = await getBotById(input.id);
        if (!bot) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Bot not found' });
        }
        if (bot.userId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not own this bot' });
        }
        if (!bot.token) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bot token is missing' });
        }

        // Here you would normally call an external service or spawn a process
        // For now, we just update the status in the database
        const newStatus = input.action === "start" ? "running" : "stopped";
        await updateBotStatus(input.id, newStatus);
        
        return { success: true, status: newStatus };
      }),

    // Delete bot (admin only)
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const bot = await getBotById(input.id);
        if (!bot) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Bot not found' });
        }
        if (bot.adminId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only delete your own bots' });
        }

        return await deleteBot(input.id);
      }),
  }),

  // Admin management procedures
  admin: router({
    // Get all admins (public)
    listAdmins: publicProcedure.query(async () => {
      return await getAllAdmins();
    }),

    // Promote user to admin (owner only)
    promoteToAdmin: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        try {
          await promoteToAdmin(input.userId, ctx.user.id);
          return { success: true, message: "User promoted to admin" };
        } catch (error: any) {
          throw new TRPCError({ code: 'FORBIDDEN', message: error.message });
        }
      }),

    // Demote admin to user (owner only)
    promoteByUsername: adminProcedure
      .input(z.object({ username: z.string() }))
      .mutation(async ({ input, ctx }) => {
        try {
          await promoteByUsername(input.username, ctx.user.id);
          return { success: true, message: "User promoted to admin" };
        } catch (error: any) {
          throw new TRPCError({ code: "FORBIDDEN", message: error.message });
        }
      }),

    demoteFromAdmin: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        try {
          await demoteFromAdmin(input.userId, ctx.user.id);
          return { success: true, message: "Admin demoted to user" };
        } catch (error: any) {
          throw new TRPCError({ code: 'FORBIDDEN', message: error.message });
        }
      }),

    // Get all users (admin only)
    listUsers: adminProcedure.query(async () => {
      return await getAllUsers();
    }),
  }),

  // Payment procedures (Paylink.sa integration - placeholder)
  payment: router({
    // Initiate payment (protected - requires Discord auth)
    initiatePayment: protectedProcedure
      .input(z.object({
        botId: z.number(),
        amount: z.number().int().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        // TODO: Implement Paylink.sa payment integration
        // This is a placeholder for future Paylink.sa integration
        // When merchant account is ready, implement:
        // 1. Create payment session with Paylink.sa
        // 2. Return redirect URL to payment gateway
        // 3. Store payment record in database for verification

        return {
          success: false,
          message: "Payment integration not yet configured. Please add Paylink.sa merchant credentials.",
          // paymentUrl: "", // Will be populated when integration is active
        };
      }),

    // Verify payment (webhook handler - placeholder)
    verifyPayment: publicProcedure
      .input(z.object({
        paymentId: z.string(),
        status: z.string(),
      }))
      .mutation(async ({ input }) => {
        // TODO: Implement Paylink.sa webhook verification
        // This is a placeholder for future implementation
        // When merchant account is ready, implement:
        // 1. Verify webhook signature from Paylink.sa
        // 2. Update payment status in database
        // 3. Grant access to purchased bot

        return {
          success: false,
          message: "Payment verification not yet configured",
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
