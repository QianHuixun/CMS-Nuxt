DROP TEMPORARY TABLE IF EXISTS `tmp_monitor_menu_ids`;
--> statement-breakpoint
CREATE TEMPORARY TABLE `tmp_monitor_menu_ids` (
  `menu_id` int PRIMARY KEY
);
--> statement-breakpoint
INSERT INTO `tmp_monitor_menu_ids` (`menu_id`)
WITH RECURSIVE `monitor_tree` AS (
  SELECT `menu_id`
  FROM `menu`
  WHERE (`path` = 'monitor' AND IFNULL(`parent_menu_id`, 0) = 0)
    OR (`menu_id` = 12)
    OR (`component` LIKE 'monitor/%')
  UNION DISTINCT
  SELECT `m`.`menu_id`
  FROM `menu` AS `m`
  INNER JOIN `monitor_tree` AS `t` ON `m`.`parent_menu_id` = `t`.`menu_id`
)
SELECT `menu_id`
FROM `monitor_tree`;
--> statement-breakpoint
DELETE FROM `role_to_menu`
WHERE `menu_id` IN (SELECT `menu_id` FROM `tmp_monitor_menu_ids`);
--> statement-breakpoint
DELETE FROM `menu`
WHERE `menu_id` IN (SELECT `menu_id` FROM `tmp_monitor_menu_ids`);
--> statement-breakpoint
DROP TEMPORARY TABLE IF EXISTS `tmp_monitor_menu_ids`;
