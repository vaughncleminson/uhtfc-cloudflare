PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE `users_sessions` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`created_at` text,
  	`expires_at` text NOT NULL,
  	FOREIGN KEY (`_parent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
  );
INSERT INTO "users_sessions" VALUES(1,1,'0f8b4b03-aeb6-4f74-a299-0f8b9148645a','2026-01-30T19:23:19.590Z','2026-01-30T21:23:19.590Z');
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
INSERT INTO "users" VALUES(1,'2026-01-30T19:23:18.589Z','2026-01-30T19:23:18.589Z','vaughn@pulsesoftware.co.za',NULL,NULL,'9394d7b44d5bff17dee301a4e4d9b12152348bc3ea0f10e793d57d8715173dcd','73b8545e69848273c6648d5490a0b184c0b8aa5fcaf826bf82cc018071a1cd0a19d3ec025c94a0f90cac275b75e07b76eced472fb458afb500b2014db33b83b447d29074445f0637cf9217ff73a08163c23c42fda2e017224a7f29f58c220d4f439a1fb19e578a7572ac23949ca0e887ed500bef7afa4111b656ade3888b70b940d73a22e29e971204ba53e55def46d73a18ef70fabc9407ba7e214ce553b535afb6f61f49f4010288ee029abc297add7a4165e30d741600192c68c8e5fbb43e43caae970e3a8228267265e1a83fa9f037bb90320b69a749851c5922b88fdeb5bb2c242fc87e45297e44b37608499056bc906047e884631984bda11e8d317b373ab56cab0fc3456cebe816857cee45d7f66a799173cfc57ce195adc5d6d4251169daa7cefb65a1f7ae17c6f6efd3d9f60f6590310e2c82a2c3c8f4ee8b0c2d94f5d150d2a9b47477d5ed24609c82039f69c0155ebaecfb9bce3f80b341911c0e8b128ae4152d2c6b2bf890854ecf7ebede16191a6a7629818144f0afc6dd8889eae8029a7e1888a3780e3201f02d2853588dc1ae4a155df3ed710238286480a1656f6bbd77508c82a83911d8e2bc98b4ba6bc7bf4df02e8d3102a72d1c3b11eeba37ec9280b245c9482786a1b04e24a2ef2f6df77e40082b847207de5df5d50c6fa950cdfed899aab3021657c7379b408cd994d5cee89b5032af0cea1c3813d2',0,NULL);
INSERT INTO "users" VALUES(2,'2026-01-30T19:29:01.913Z','2026-01-30T19:29:01.913Z','chris.trevor.green@gmail.com',NULL,NULL,'0d31a89fa14a6cad7f60db6a3a8997b58aff75fa70187d69aabd5115e76d18f3','55a171aa820d57b0c55f35d020b4a1c36a840d362113d11c935e4e7c3c5631a6ab096c507826290cab404e7f34c0d680b40799f85e3aba936020fe6a843b3737dccacc374cb80a590c45066f639db87906fd7eaddafcbca3da15a5d557fb11658609c9697774ead6613eabe55a4e83637c090086ec109c894916bc61b4766d537af68b030d94408edd79f514c556ea62e7f9ea67988d6f1a640d79bdbf5d9442f4110a3e0a7c9d0a49e0cbf3a385b0260f22a4c5b082749aeb2daec99fde7eb73b982e0a8b2523973de66e7a0d6ad71e564df1e0149a65067ffef5000923a682ba78a75f99b1950a2953403c8c5d87011e6e42f86a6724143830fea24601ef3736fb9bf94d3d0e47c70ea2e37d3fd47c536a652e1677b24466366fc57a40cab5d6cc13822dc451532df373c6fb34cc7ddac62a11d554394a66bf2b88e589a93937a8ec88ff58301f6d718dd1433e912d84607a1724e97b7f0f59293e592f4a16e924fb3e9946f5ee974b1215b7d1d632981e272303733a82ff94533bf957230fe2cf4f4f39fb71b08381429c3ded92336fd02ed4e5cf4547a51e639ca45f4ca376d69d61cbc299673ad4d978777d340165f807658559ef6b2060160bb31d9e5a5486b48a51fac541f8ed4ff66d72225ef7e14257ade6ee5b0d88731814d8a074b732a2060f4cc556c2abe4e9acb7d07f5588ef23925d628b20b809912cbf38f5',0,NULL);
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
INSERT INTO "payload_preferences" VALUES(1,'collection-users','{}','2026-01-30T19:23:32.451Z','2026-01-30T19:23:32.451Z');
CREATE TABLE `payload_preferences_rels` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order` integer,
  	`parent_id` integer NOT NULL,
  	`path` text NOT NULL,
  	`users_id` integer,
  	FOREIGN KEY (`parent_id`) REFERENCES `payload_preferences`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
  );
INSERT INTO "payload_preferences_rels" VALUES(1,NULL,1,'user',1);
CREATE TABLE `payload_migrations` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`name` text,
  	`batch` numeric,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
INSERT INTO "payload_migrations" VALUES(1,'20250929_111647',1,'2026-01-30T18:39:21.875Z','2026-01-30T18:39:21.874Z');
INSERT INTO "payload_migrations" VALUES(2,'20260130_175233',1,'2026-01-30T18:39:23.503Z','2026-01-30T18:39:23.503Z');
CREATE TABLE `payload_kv` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`key` text NOT NULL,
  	`data` text NOT NULL
  );
ANALYZE sqlite_schema;
INSERT INTO "sqlite_stat1" VALUES('payload_migrations','payload_migrations_created_at_idx','2 1');
INSERT INTO "sqlite_stat1" VALUES('payload_migrations','payload_migrations_updated_at_idx','2 1');
INSERT INTO "sqlite_stat1" VALUES('_cf_KV','_cf_KV','1 1');
CREATE INDEX `users_sessions_order_idx` ON `users_sessions` (`_order`);
CREATE INDEX `users_sessions_parent_id_idx` ON `users_sessions` (`_parent_id`);
CREATE INDEX `users_updated_at_idx` ON `users` (`updated_at`);
CREATE INDEX `users_created_at_idx` ON `users` (`created_at`);
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);
CREATE INDEX `media_updated_at_idx` ON `media` (`updated_at`);
CREATE INDEX `media_created_at_idx` ON `media` (`created_at`);
CREATE UNIQUE INDEX `media_filename_idx` ON `media` (`filename`);
CREATE INDEX `payload_locked_documents_global_slug_idx` ON `payload_locked_documents` (`global_slug`);
CREATE INDEX `payload_locked_documents_updated_at_idx` ON `payload_locked_documents` (`updated_at`);
CREATE INDEX `payload_locked_documents_created_at_idx` ON `payload_locked_documents` (`created_at`);
CREATE INDEX `payload_locked_documents_rels_order_idx` ON `payload_locked_documents_rels` (`order`);
CREATE INDEX `payload_locked_documents_rels_parent_idx` ON `payload_locked_documents_rels` (`parent_id`);
CREATE INDEX `payload_locked_documents_rels_path_idx` ON `payload_locked_documents_rels` (`path`);
CREATE INDEX `payload_locked_documents_rels_users_id_idx` ON `payload_locked_documents_rels` (`users_id`);
CREATE INDEX `payload_locked_documents_rels_media_id_idx` ON `payload_locked_documents_rels` (`media_id`);
CREATE INDEX `payload_preferences_key_idx` ON `payload_preferences` (`key`);
CREATE INDEX `payload_preferences_updated_at_idx` ON `payload_preferences` (`updated_at`);
CREATE INDEX `payload_preferences_created_at_idx` ON `payload_preferences` (`created_at`);
CREATE INDEX `payload_preferences_rels_order_idx` ON `payload_preferences_rels` (`order`);
CREATE INDEX `payload_preferences_rels_parent_idx` ON `payload_preferences_rels` (`parent_id`);
CREATE INDEX `payload_preferences_rels_path_idx` ON `payload_preferences_rels` (`path`);
CREATE INDEX `payload_preferences_rels_users_id_idx` ON `payload_preferences_rels` (`users_id`);
CREATE INDEX `payload_migrations_updated_at_idx` ON `payload_migrations` (`updated_at`);
CREATE INDEX `payload_migrations_created_at_idx` ON `payload_migrations` (`created_at`);
CREATE UNIQUE INDEX `payload_kv_key_idx` ON `payload_kv` (`key`);
