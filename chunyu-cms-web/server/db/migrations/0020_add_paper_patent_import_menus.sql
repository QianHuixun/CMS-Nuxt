UPDATE `menu`
SET
  `menu_name` = '论文导入',
  `path` = 'paper-import',
  `component` = 'paperAchievement/paperImport/index',
  `perms` = 'paperAchievement:paperImport:list',
  `remark` = '论文导入页面',
  `update_by` = 'codex',
  `update_time` = NOW()
WHERE `menu_id` = 129
  AND `parent_menu_id` = 127;
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_id`,
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
  136,
  '专利导入',
  3,
  'patent-import',
  'paperAchievement/patentImport/index',
  NULL,
  1,
  '0',
  'C',
  '0',
  '0',
  'paperAchievement:patentImport:list',
  'edit',
  127,
  '127.136.',
  '专利导入页面',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `menu` WHERE `menu_id` = 136);
