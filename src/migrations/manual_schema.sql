-- Disable foreign key checks to ensure tables create regardless of order
PRAGMA foreign_keys = OFF;

CREATE TABLE `users` (
    `id` integer PRIMARY KEY NOT NULL,
    `updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    `created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    `email` text NOT NULL,
    `reset_password_token` text,
    `reset_password_expiration` text,
    `salt` text,
    `hash` text,
    `login_attempts` numeric DEFAULT 0,
    `lock_until` text
);
CREATE INDEX `users_updated_at_idx` ON `users` (`updated_at`);
CREATE INDEX `users_created_at_idx` ON `users` (`created_at`);
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);

CREATE TABLE `users_sessions` (
    `_order` integer NOT NULL,
    `_parent_id` integer NOT NULL,
    `id` text PRIMARY KEY NOT NULL,
    `created_at` text,
    `expires_at` text NOT NULL,
    FOREIGN KEY (`_parent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `users_sessions_order_idx` ON `users_sessions` (`_order`);
CREATE INDEX `users_sessions_parent_id_idx` ON `users_sessions` (`_parent_id`);

CREATE TABLE `media` (
    `id` integer PRIMARY KEY NOT NULL,
    `alt` text NOT NULL,
    `updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    `created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    `url` text,
    `thumbnail_u_r_l` text,
    `filename` text,
    `mime_type` text,
    `filesize` numeric,
    `width` numeric,
    `height` numeric
);
CREATE INDEX `media_updated_at_idx` ON `media` (`updated_at`);
CREATE INDEX `media_created_at_idx` ON `media` (`created_at`);
CREATE UNIQUE INDEX `media_filename_idx` ON `media` (`filename`);

CREATE TABLE `payload_locked_documents` (
    `id` integer PRIMARY KEY NOT NULL,
    `global_slug` text,
    `updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    `created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);

CREATE TABLE `payload_locked_documents_rels` (
    `id` integer PRIMARY KEY NOT NULL,
    `order` integer,
    `parent_id` integer NOT NULL,
    `path` text NOT NULL,
    `users_id` integer,
    `media_id` integer,
    FOREIGN KEY (`parent_id`) REFERENCES `payload_locked_documents`(`id`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE TABLE `payload_preferences` (
    `id` integer PRIMARY KEY NOT NULL,
    `key` text,
    `value` text,
    `updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    `created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);

CREATE TABLE `payload_preferences_rels` (
    `id` integer PRIMARY KEY NOT NULL,
    `order` integer,
    `parent_id` integer NOT NULL,
    `path` text NOT NULL,
    `users_id` integer,
    FOREIGN KEY (`parent_id`) REFERENCES `payload_preferences`(`id`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE TABLE `payload_migrations` (
    `id` integer PRIMARY KEY NOT NULL,
    `name` text,
    `batch` numeric,
    `updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    `created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);

PRAGMA foreign_keys = ON;