-- Restores catch_returns_returns rows lost when migration 20261107_055608
-- rebuilt catch_returns. Source: prod-2026-11-07-064821.sql.
--
-- This is intentionally one INSERT statement: it either restores all 28 rows
-- or fails without partially applying them.
INSERT INTO "catch_returns_returns"
  ("_order", "_parent_id", "id", "species", "quantity", "length", "released")
VALUES
  (1, 3, '6a61d30824104800c8cd2178', 'rainbow', 2, 27, 1),
  (1, 5, '6a661a423b72a500c8cebaf8', 'rainbow', 1, 50, 1),
  (1, 8, '6a6e365f5d107e00c8e7e229', 'rainbow', 2, 25, 1),
  (1, 11, '6a71fbdad6bbb500c8f243d0', 'rainbow', 3, 50, 1),
  (1, 15, '6a785a2ded37b000c89592c4', 'rainbow', 1, 35, 1),
  (1, 20, '6a9465d185322300c872f636', 'rainbow', 2, 30, 1),
  (1, 31, '6aa51c53b4ab3400c80f1ef3', 'rainbow', 1, 41, 1),
  (1, 32, '6aa5a5ac97201500c877cb16', 'rainbow', 1, 53, 1),
  (1, 34, '6aa7b7640b088900c81532be', 'rainbow', 1, 55, 1),
  (1, 21, '6aa7b79fda584f00c84ca72c', 'rainbow', 1, 40, 1),
  (1, 6, '6aa7b7e60b088900c81532bf', 'rainbow', 3, 50, 1),
  (1, 35, '6aaa38046063f100c8822f7a', 'rainbow', 6, 35, 1),
  (1, 43, '6abb60cd0348c700c8204c96', 'rainbow', 3, 35, 1),
  (1, 49, '6abf97f97e5ed900c856f3cf', 'rainbow', 1, 40, 1),
  (2, 49, '6abf97f97e5ed900c856f3d0', 'rainbow', 1, 38, 1),
  (1, 52, '6ac35de1cd610900c8c5e96d', 'rainbow', 1, 35, 1),
  (1, 59, '6acb638bc710c000c8f8f833', 'rainbow', 2, 45, 1),
  (1, 58, '6acca6c7e047ad00c85d03c0', 'bass', 3, 15, 1),
  (1, 63, '6ad1e0497acdf000c89a6052', 'bass', 1, 12, 0),
  (1, 66, '6ad32e520416d400c8bfb5c7', 'rainbow', 2, 50, 1),
  (2, 66, '6ad32e520416d400c8bfb5c8', 'rainbow', 1, 40, 1),
  (1, 70, '6ad4907528c4ef00c86b903c', 'rainbow', 1, 41, 1),
  (2, 70, '6ad4907528c4ef00c86b903d', 'rainbow', 1, 22, 1),
  (3, 70, '6ad4907528c4ef00c86b903e', 'rainbow', 1, 38, 0),
  (1, 68, '6ad5ae0f67740e00c89f87f9', 'rainbow', 1, 51, 1),
  (2, 68, '6ad5ae0f67740e00c89f87fa', 'rainbow', 1, 55, 1),
  (3, 68, '6ad5ae0f67740e00c89f87fb', 'rainbow', 2, 60, 1),
  (1, 75, '6ad9e56691e8ad00c87ae1e2', 'rainbow', 3, 60, 1);

SELECT COUNT(*) AS restored_rows
FROM "catch_returns_returns"
WHERE "id" IN (
  '6a61d30824104800c8cd2178',
  '6a661a423b72a500c8cebaf8',
  '6a6e365f5d107e00c8e7e229',
  '6a71fbdad6bbb500c8f243d0',
  '6a785a2ded37b000c89592c4',
  '6a9465d185322300c872f636',
  '6aa51c53b4ab3400c80f1ef3',
  '6aa5a5ac97201500c877cb16',
  '6aa7b7640b088900c81532be',
  '6aa7b79fda584f00c84ca72c',
  '6aa7b7e60b088900c81532bf',
  '6aaa38046063f100c8822f7a',
  '6abb60cd0348c700c8204c96',
  '6abf97f97e5ed900c856f3cf',
  '6abf97f97e5ed900c856f3d0',
  '6ac35de1cd610900c8c5e96d',
  '6acb638bc710c000c8f8f833',
  '6acca6c7e047ad00c85d03c0',
  '6ad1e0497acdf000c89a6052',
  '6ad32e520416d400c8bfb5c7',
  '6ad32e520416d400c8bfb5c8',
  '6ad4907528c4ef00c86b903c',
  '6ad4907528c4ef00c86b903d',
  '6ad4907528c4ef00c86b903e',
  '6ad5ae0f67740e00c89f87f9',
  '6ad5ae0f67740e00c89f87fa',
  '6ad5ae0f67740e00c89f87fb',
  '6ad9e56691e8ad00c87ae1e2'
);

PRAGMA foreign_key_check("catch_returns_returns");