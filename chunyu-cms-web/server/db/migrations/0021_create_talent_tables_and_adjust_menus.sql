CREATE TABLE IF NOT EXISTS `talent` (
  `talent_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `title` varchar(100) DEFAULT '',
  `organization` varchar(200) DEFAULT '',
  `research_direction` varchar(500) DEFAULT '',
  `resume` text,
  `photo_url` varchar(500) DEFAULT '',
  `status` char(1) DEFAULT '0',
  `del_flag` char(1) DEFAULT '0',
  `remark` varchar(500) DEFAULT '',
  `create_by` varchar(64) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` varchar(64) DEFAULT '',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`talent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `talent_achievement_relation` (
  `talent_achievement_relation_id` int NOT NULL AUTO_INCREMENT,
  `talent_id` int NOT NULL,
  `achievement_type` varchar(20) NOT NULL,
  `achievement_id` int NOT NULL,
  `sort` int DEFAULT '0',
  `status` char(1) DEFAULT '0',
  `del_flag` char(1) DEFAULT '0',
  `remark` varchar(500) DEFAULT '',
  `create_by` varchar(64) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` varchar(64) DEFAULT '',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`talent_achievement_relation_id`),
  KEY `idx_talent_achievement_relation_talent_id` (`talent_id`),
  KEY `idx_talent_achievement_relation_achievement` (`achievement_type`, `achievement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

UPDATE `menu`
SET
  `menu_name` = '人才管理',
  `remark` = '人才管理页面',
  `update_by` = 'codex',
  `update_time` = NOW()
WHERE `menu_id` = 125;

UPDATE `menu`
SET
  `visible` = '1',
  `update_by` = 'codex',
  `update_time` = NOW()
WHERE `menu_id` = 126;
