CREATE TABLE IF NOT EXISTS `activity` (
  `activity_id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `thumbnail` varchar(500),
  `content_blocks` text,
  `content_html` text,
  `sort` int DEFAULT 0,
  `status` char(1) DEFAULT '0',
  `remark` varchar(500) DEFAULT '',
  `create_by` varchar(64) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` varchar(64) DEFAULT '',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `activity_activity_id` PRIMARY KEY(`activity_id`)
);
--> statement-breakpoint
INSERT INTO `activity` (
  `name`,
  `description`,
  `thumbnail`,
  `content_blocks`,
  `content_html`,
  `sort`,
  `status`,
  `remark`,
  `create_by`,
  `create_time`,
  `update_by`,
  `update_time`
)
SELECT
  '中医药文化展',
  '沉浸式体验中医药文化',
  'https://picsum.photos/480/320?random=21',
  NULL,
  '',
  1,
  '1',
  '',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `activity` WHERE `name` = '中医药文化展');
--> statement-breakpoint
INSERT INTO `activity` (
  `name`,
  `description`,
  `thumbnail`,
  `content_blocks`,
  `content_html`,
  `sort`,
  `status`,
  `remark`,
  `create_by`,
  `create_time`,
  `update_by`,
  `update_time`
)
SELECT
  '本草数字展台',
  '图文混排和视频讲解演示场景',
  'https://picsum.photos/480/320?random=22',
  NULL,
  '',
  2,
  '0',
  '',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `activity` WHERE `name` = '本草数字展台');
