CREATE TABLE `bots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`type` varchar(100) NOT NULL,
	`price` int NOT NULL,
	`purchaseLink` text NOT NULL,
	`adminId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `discordId` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `discordUsername` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `discordAvatar` text;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_discordId_unique` UNIQUE(`discordId`);