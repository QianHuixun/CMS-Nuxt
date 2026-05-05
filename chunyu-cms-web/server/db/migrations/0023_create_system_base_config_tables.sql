CREATE TABLE IF NOT EXISTS `nav_config` (
  `nav_config_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `description` varchar(1000) DEFAULT '',
  `url` varchar(500) DEFAULT '',
  `icon` varchar(500) DEFAULT '',
  `sort` int DEFAULT '0',
  `status` varchar(20) DEFAULT 'active',
  `del_flag` char(1) DEFAULT '0',
  `remark` varchar(500) DEFAULT '',
  `create_by` varchar(64) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` varchar(64) DEFAULT '',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nav_config_id`),
  KEY `idx_nav_config_title` (`title`),
  KEY `idx_nav_config_status_sort` (`status`, `sort`),
  KEY `idx_nav_config_del_flag` (`del_flag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `screen_saver_config` (
  `screensaver_config_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `media_type` varchar(20) DEFAULT 'image',
  `media_url` varchar(500) DEFAULT '',
  `cover_url` varchar(500) DEFAULT '',
  `trigger_seconds` int DEFAULT '300',
  `sort` int DEFAULT '0',
  `status` varchar(20) DEFAULT 'active',
  `del_flag` char(1) DEFAULT '0',
  `remark` varchar(500) DEFAULT '',
  `create_by` varchar(64) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` varchar(64) DEFAULT '',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`screensaver_config_id`),
  KEY `idx_screen_saver_config_title` (`title`),
  KEY `idx_screen_saver_config_media_type` (`media_type`),
  KEY `idx_screen_saver_config_status_sort` (`status`, `sort`),
  KEY `idx_screen_saver_config_del_flag` (`del_flag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--> statement-breakpoint
SET @system_base_config_id := (
  SELECT `menu_id`
  FROM `menu`
  WHERE `menu_name` = '系统基础配置管理'
  ORDER BY `menu_id`
  LIMIT 1
);
--> statement-breakpoint
UPDATE `menu`
SET
  `mpath` = CONCAT(`menu_id`, '.'),
  `update_by` = 'codex',
  `update_time` = NOW()
WHERE `menu_id` = @system_base_config_id
  AND (IFNULL(`mpath`, '') = '');
--> statement-breakpoint
UPDATE `menu`
SET
  `parent_menu_id` = @system_base_config_id,
  `order_num` = 1,
  `icon` = 'guide',
  `mpath` = CONCAT(
    (SELECT IFNULL(NULLIF(`mpath`, ''), CONCAT(`menu_id`, '.')) FROM (
      SELECT `mpath`, `menu_id`
      FROM `menu`
      WHERE `menu_id` = @system_base_config_id
      LIMIT 1
    ) AS `system_base_config_mpath`),
    `menu_id`,
    '.'
  ),
  `update_by` = 'codex',
  `update_time` = NOW()
WHERE `menu_name` = '导航配置'
  AND `component` = 'systemBaseConfig/navConfig/index'
  AND @system_base_config_id IS NOT NULL;
--> statement-breakpoint
UPDATE `menu`
SET
  `parent_menu_id` = @system_base_config_id,
  `order_num` = 2,
  `icon` = 'theme',
  `mpath` = CONCAT(
    (SELECT IFNULL(NULLIF(`mpath`, ''), CONCAT(`menu_id`, '.')) FROM (
      SELECT `mpath`, `menu_id`
      FROM `menu`
      WHERE `menu_id` = @system_base_config_id
      LIMIT 1
    ) AS `system_base_config_mpath`),
    `menu_id`,
    '.'
  ),
  `update_by` = 'codex',
  `update_time` = NOW()
WHERE `menu_name` = '屏保配置'
  AND `component` = 'systemBaseConfig/screenSaverConfig/index'
  AND @system_base_config_id IS NOT NULL;
