CREATE TABLE `match_keywords` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`resume_match_id` integer,
	`keywords` text NOT NULL,
	FOREIGN KEY (`resume_match_id`) REFERENCES `resume_matches`(`id`) ON UPDATE no action ON DELETE no action
);
