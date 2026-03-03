CREATE TABLE "bot_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"userBotId" integer NOT NULL,
	"encryptedToken" text NOT NULL,
	"discordBotId" varchar(64),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bots" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(100) NOT NULL,
	"price" integer NOT NULL,
	"purchaseLink" text NOT NULL,
	"adminId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_bots" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"botId" integer NOT NULL,
	"status" varchar(20) DEFAULT 'running' NOT NULL,
	"purchaseDate" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" varchar(10) DEFAULT 'user' NOT NULL,
	"discordId" varchar(64),
	"discordUsername" varchar(255),
	"discordAvatar" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId"),
	CONSTRAINT "users_discordId_unique" UNIQUE("discordId")
);
