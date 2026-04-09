DROP TEMPORARY TABLE IF EXISTS `tmp_movie_short_menu_ids`;
--> statement-breakpoint
CREATE TEMPORARY TABLE `tmp_movie_short_menu_ids` (
  `menu_id` int PRIMARY KEY
);
--> statement-breakpoint
INSERT INTO `tmp_movie_short_menu_ids` (`menu_id`)
WITH RECURSIVE `movie_short_tree` AS (
  SELECT `menu_id`
  FROM `menu`
  WHERE `menu_id` IN (106, 113)
  UNION DISTINCT
  SELECT `m`.`menu_id`
  FROM `menu` AS `m`
  INNER JOIN `movie_short_tree` AS `t` ON `m`.`parent_menu_id` = `t`.`menu_id`
)
SELECT `menu_id`
FROM `movie_short_tree`;
--> statement-breakpoint
DELETE FROM `role_to_menu`
WHERE `menu_id` IN (SELECT `menu_id` FROM `tmp_movie_short_menu_ids`);
--> statement-breakpoint
DELETE FROM `menu`
WHERE `menu_id` IN (SELECT `menu_id` FROM `tmp_movie_short_menu_ids`);
--> statement-breakpoint
DROP TEMPORARY TABLE IF EXISTS `tmp_movie_short_menu_ids`;
