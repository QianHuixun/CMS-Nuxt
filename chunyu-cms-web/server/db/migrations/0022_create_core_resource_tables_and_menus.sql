CREATE TABLE IF NOT EXISTS `resource_database` (
  `database_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `info` varchar(1000) DEFAULT '',
  `url` varchar(500) DEFAULT '',
  `icon` varchar(500) DEFAULT '',
  `cover_url` varchar(500) DEFAULT '',
  `status` varchar(20) DEFAULT 'active',
  `sort` int DEFAULT '0',
  `del_flag` char(1) DEFAULT '0',
  `remark` varchar(500) DEFAULT '',
  `create_by` varchar(64) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` varchar(64) DEFAULT '',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`database_id`),
  KEY `idx_resource_database_title` (`title`),
  KEY `idx_resource_database_status_sort` (`status`, `sort`),
  KEY `idx_resource_database_del_flag` (`del_flag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `research_tool` (
  `tool_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `description` varchar(1000) DEFAULT '',
  `url` varchar(500) DEFAULT '',
  `icon` varchar(500) DEFAULT '',
  `status` varchar(20) DEFAULT 'active',
  `sort` int DEFAULT '0',
  `del_flag` char(1) DEFAULT '0',
  `remark` varchar(500) DEFAULT '',
  `create_by` varchar(64) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` varchar(64) DEFAULT '',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`tool_id`),
  KEY `idx_research_tool_title` (`title`),
  KEY `idx_research_tool_status_sort` (`status`, `sort`),
  KEY `idx_research_tool_del_flag` (`del_flag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  '核心资源库管理',
  6,
  'core-resource',
  NULL,
  NULL,
  1,
  '0',
  'M',
  '0',
  '0',
  NULL,
  'database',
  0,
  NULL,
  '核心资源库管理目录',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1
  FROM `menu`
  WHERE `menu_name` = '核心资源库管理'
    AND `path` = 'core-resource'
    AND IFNULL(`parent_menu_id`, 0) = 0
);
--> statement-breakpoint
SET @core_resource_parent_id := (
  SELECT `menu_id`
  FROM `menu`
  WHERE `menu_name` = '核心资源库管理'
    AND `path` = 'core-resource'
    AND IFNULL(`parent_menu_id`, 0) = 0
  ORDER BY `menu_id`
  LIMIT 1
);
--> statement-breakpoint
UPDATE `menu`
SET
  `mpath` = CONCAT(`menu_id`, '.'),
  `update_by` = 'codex',
  `update_time` = NOW()
WHERE `menu_id` = @core_resource_parent_id
  AND (IFNULL(`mpath`, '') = '' OR `mpath` <> CONCAT(`menu_id`, '.'));
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_name`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`,
  `menu_type`, `visible`, `status`, `perms`, `icon`, `parent_menu_id`, `mpath`, `remark`,
  `create_by`, `create_time`, `update_by`, `update_time`
)
SELECT
  '数据库管理',
  1,
  'database',
  'coreResource/database/index',
  NULL,
  1,
  '0',
  'C',
  '0',
  '0',
  'coreResource:database:list',
  'database',
  @core_resource_parent_id,
  NULL,
  '数据库管理页面',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE @core_resource_parent_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM `menu`
    WHERE `menu_name` = '数据库管理'
      AND `path` = 'database'
      AND `component` = 'coreResource/database/index'
      AND IFNULL(`parent_menu_id`, 0) = @core_resource_parent_id
  );
--> statement-breakpoint
SET @core_resource_database_id := (
  SELECT `menu_id`
  FROM `menu`
  WHERE `menu_name` = '数据库管理'
    AND `path` = 'database'
    AND `component` = 'coreResource/database/index'
    AND IFNULL(`parent_menu_id`, 0) = @core_resource_parent_id
  ORDER BY `menu_id`
  LIMIT 1
);
--> statement-breakpoint
UPDATE `menu`
SET
  `mpath` = CONCAT(
    (SELECT `mpath` FROM (
      SELECT `mpath`
      FROM `menu`
      WHERE `menu_id` = @core_resource_parent_id
      LIMIT 1
    ) AS `parent_mpath`),
    `menu_id`,
    '.'
  ),
  `update_by` = 'codex',
  `update_time` = NOW()
WHERE `menu_id` = @core_resource_database_id
  AND @core_resource_parent_id IS NOT NULL
  AND (
    IFNULL(`mpath`, '') = ''
    OR `mpath` <> CONCAT(
      (SELECT `mpath` FROM (
        SELECT `mpath`
        FROM `menu`
        WHERE `menu_id` = @core_resource_parent_id
        LIMIT 1
      ) AS `parent_mpath_check`),
      `menu_id`,
      '.'
    )
  );
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_name`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`,
  `menu_type`, `visible`, `status`, `perms`, `icon`, `parent_menu_id`, `mpath`, `remark`,
  `create_by`, `create_time`, `update_by`, `update_time`
)
SELECT
  '自研工具管理',
  2,
  'tool',
  'coreResource/tool/index',
  NULL,
  1,
  '0',
  'C',
  '0',
  '0',
  'coreResource:tool:list',
  'tool',
  @core_resource_parent_id,
  NULL,
  '自研工具管理页面',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE @core_resource_parent_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM `menu`
    WHERE `menu_name` = '自研工具管理'
      AND `path` = 'tool'
      AND `component` = 'coreResource/tool/index'
      AND IFNULL(`parent_menu_id`, 0) = @core_resource_parent_id
  );
--> statement-breakpoint
SET @core_resource_tool_id := (
  SELECT `menu_id`
  FROM `menu`
  WHERE `menu_name` = '自研工具管理'
    AND `path` = 'tool'
    AND `component` = 'coreResource/tool/index'
    AND IFNULL(`parent_menu_id`, 0) = @core_resource_parent_id
  ORDER BY `menu_id`
  LIMIT 1
);
--> statement-breakpoint
UPDATE `menu`
SET
  `mpath` = CONCAT(
    (SELECT `mpath` FROM (
      SELECT `mpath`
      FROM `menu`
      WHERE `menu_id` = @core_resource_parent_id
      LIMIT 1
    ) AS `parent_mpath`),
    `menu_id`,
    '.'
  ),
  `update_by` = 'codex',
  `update_time` = NOW()
WHERE `menu_id` = @core_resource_tool_id
  AND @core_resource_parent_id IS NOT NULL
  AND (
    IFNULL(`mpath`, '') = ''
    OR `mpath` <> CONCAT(
      (SELECT `mpath` FROM (
        SELECT `mpath`
        FROM `menu`
        WHERE `menu_id` = @core_resource_parent_id
        LIMIT 1
      ) AS `parent_mpath_check`),
      `menu_id`,
      '.'
    )
  );
