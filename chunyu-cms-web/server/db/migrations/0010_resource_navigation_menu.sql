INSERT INTO `menu` (
  `menu_name`,
  `order_num`,
  `path`,
  `component`,
  `query`,
  `is_frame`,
  `is_cache`,
  `menu_type`,
  `visible`,
  `status`,
  `perms`,
  `icon`,
  `parent_menu_id`,
  `mpath`,
  `remark`,
  `create_by`,
  `create_time`,
  `update_by`,
  `update_time`
)
SELECT
  '资源导航管理',
  12,
  'resource-navigation',
  NULL,
  NULL,
  1,
  '0',
  'M',
  '0',
  '0',
  NULL,
  'guide',
  0,
  NULL,
  '资源导航菜单',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1
  FROM `menu`
  WHERE `path` = 'resource-navigation' AND IFNULL(`parent_menu_id`, 0) = 0
);
--> statement-breakpoint
SET @resource_navigation_parent_id := (
  SELECT `menu_id`
  FROM `menu`
  WHERE `path` = 'resource-navigation' AND IFNULL(`parent_menu_id`, 0) = 0
  ORDER BY `menu_id`
  LIMIT 1
);
--> statement-breakpoint
UPDATE `menu`
SET `mpath` = CONCAT(`menu_id`, '.')
WHERE `menu_id` = @resource_navigation_parent_id
  AND (IFNULL(`mpath`, '') = '');
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_name`,
  `order_num`,
  `path`,
  `component`,
  `query`,
  `is_frame`,
  `is_cache`,
  `menu_type`,
  `visible`,
  `status`,
  `perms`,
  `icon`,
  `parent_menu_id`,
  `mpath`,
  `remark`,
  `create_by`,
  `create_time`,
  `update_by`,
  `update_time`
)
SELECT
  '资源录入',
  1,
  'entry',
  'resource/navigation/entry/index',
  NULL,
  1,
  '0',
  'C',
  '0',
  '0',
  'resource:navigation:entry:list',
  'form',
  @resource_navigation_parent_id,
  NULL,
  '资源导航录入页面',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE @resource_navigation_parent_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM `menu`
    WHERE `path` = 'entry' AND IFNULL(`parent_menu_id`, 0) = @resource_navigation_parent_id
  );
--> statement-breakpoint
SET @resource_navigation_entry_id := (
  SELECT `menu_id`
  FROM `menu`
  WHERE `path` = 'entry' AND IFNULL(`parent_menu_id`, 0) = @resource_navigation_parent_id
  ORDER BY `menu_id`
  LIMIT 1
);
--> statement-breakpoint
UPDATE `menu`
SET `mpath` = CONCAT(
  (SELECT `mpath` FROM (
    SELECT `mpath`
    FROM `menu`
    WHERE `menu_id` = @resource_navigation_parent_id
    LIMIT 1
  ) AS `parent_mpath`),
  `menu_id`,
  '.'
)
WHERE `menu_id` = @resource_navigation_entry_id
  AND @resource_navigation_parent_id IS NOT NULL
  AND (
    IFNULL(`mpath`, '') = ''
    OR `mpath` <> CONCAT(
      (SELECT `mpath` FROM (
        SELECT `mpath`
        FROM `menu`
        WHERE `menu_id` = @resource_navigation_parent_id
        LIMIT 1
      ) AS `parent_mpath_check`),
      `menu_id`,
      '.'
    )
  );
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_name`,
  `order_num`,
  `path`,
  `component`,
  `query`,
  `is_frame`,
  `is_cache`,
  `menu_type`,
  `visible`,
  `status`,
  `perms`,
  `icon`,
  `parent_menu_id`,
  `mpath`,
  `remark`,
  `create_by`,
  `create_time`,
  `update_by`,
  `update_time`
)
SELECT
  '卡片管理',
  2,
  'card',
  'resource/navigation/card/index',
  NULL,
  1,
  '0',
  'C',
  '0',
  '0',
  'resource:navigation:card:list',
  'table',
  @resource_navigation_parent_id,
  NULL,
  '资源导航卡片管理页面',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE @resource_navigation_parent_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM `menu`
    WHERE `path` = 'card' AND IFNULL(`parent_menu_id`, 0) = @resource_navigation_parent_id
  );
--> statement-breakpoint
SET @resource_navigation_card_id := (
  SELECT `menu_id`
  FROM `menu`
  WHERE `path` = 'card' AND IFNULL(`parent_menu_id`, 0) = @resource_navigation_parent_id
  ORDER BY `menu_id`
  LIMIT 1
);
--> statement-breakpoint
UPDATE `menu`
SET `mpath` = CONCAT(
  (SELECT `mpath` FROM (
    SELECT `mpath`
    FROM `menu`
    WHERE `menu_id` = @resource_navigation_parent_id
    LIMIT 1
  ) AS `parent_mpath`),
  `menu_id`,
  '.'
)
WHERE `menu_id` = @resource_navigation_card_id
  AND @resource_navigation_parent_id IS NOT NULL
  AND (
    IFNULL(`mpath`, '') = ''
    OR `mpath` <> CONCAT(
      (SELECT `mpath` FROM (
        SELECT `mpath`
        FROM `menu`
        WHERE `menu_id` = @resource_navigation_parent_id
        LIMIT 1
      ) AS `parent_mpath_check`),
      `menu_id`,
      '.'
    )
  );
