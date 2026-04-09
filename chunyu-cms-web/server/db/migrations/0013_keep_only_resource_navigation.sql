DELETE FROM `role_to_menu`
WHERE `menu_id` NOT IN (118, 119, 120);
--> statement-breakpoint
DELETE FROM `menu`
WHERE `menu_id` NOT IN (118, 119, 120);
