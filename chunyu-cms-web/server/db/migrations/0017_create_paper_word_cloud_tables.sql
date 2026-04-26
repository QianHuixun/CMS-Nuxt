CREATE TABLE IF NOT EXISTS `paper` (
  `paper_id` int AUTO_INCREMENT NOT NULL,
  `title` varchar(500) NOT NULL,
  `abstract` text,
  `keywords` varchar(1000) DEFAULT '',
  `status` char(1) DEFAULT '0',
  `del_flag` char(1) DEFAULT '0',
  `remark` varchar(500) DEFAULT '',
  `create_by` varchar(64) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` varchar(64) DEFAULT '',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `paper_paper_id` PRIMARY KEY(`paper_id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `paper_keyword` (
  `paper_keyword_id` int AUTO_INCREMENT NOT NULL,
  `paper_id` int NOT NULL,
  `keyword` varchar(100) NOT NULL,
  `weight` int DEFAULT 1,
  `source` char(1) DEFAULT '0',
  `status` char(1) DEFAULT '0',
  `del_flag` char(1) DEFAULT '0',
  `remark` varchar(500) DEFAULT '',
  `create_by` varchar(64) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` varchar(64) DEFAULT '',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `paper_keyword_paper_keyword_id` PRIMARY KEY(`paper_keyword_id`),
  KEY `idx_paper_keyword_paper_id` (`paper_id`),
  KEY `idx_paper_keyword_keyword` (`keyword`)
);
--> statement-breakpoint
INSERT INTO `paper` (
  `title`,
  `abstract`,
  `keywords`,
  `status`,
  `del_flag`,
  `remark`,
  `create_by`,
  `create_time`,
  `update_by`,
  `update_time`
)
SELECT
  '天回医简整理与川派医学文献数字化研究',
  '围绕天回医简释文整理、知识标注与古籍数字化展开的基础研究。',
  '天回医简,释文整理,古籍数字化,川派医学',
  '0',
  '0',
  '',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `paper` WHERE `title` = '天回医简整理与川派医学文献数字化研究');
--> statement-breakpoint
INSERT INTO `paper` (
  `title`,
  `abstract`,
  `keywords`,
  `status`,
  `del_flag`,
  `remark`,
  `create_by`,
  `create_time`,
  `update_by`,
  `update_time`
)
SELECT
  '中医脉诊语义标注与智能分析方法研究',
  '聚焦中医脉诊文本语义标注、知识组织与智能分析的最小实验数据。',
  '脉诊,语义标注,智能分析,知识组织',
  '0',
  '0',
  '',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `paper` WHERE `title` = '中医脉诊语义标注与智能分析方法研究');
--> statement-breakpoint
INSERT INTO `paper` (
  `title`,
  `abstract`,
  `keywords`,
  `status`,
  `del_flag`,
  `remark`,
  `create_by`,
  `create_time`,
  `update_by`,
  `update_time`
)
SELECT
  '针灸古籍图像识别与术语抽取实验',
  '用于验证针灸古籍图像识别、术语抽取和人工权重维护的展示数据。',
  '针灸,图像识别,术语抽取,古籍数字化',
  '0',
  '0',
  '',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `paper` WHERE `title` = '针灸古籍图像识别与术语抽取实验');
--> statement-breakpoint
INSERT INTO `paper_keyword` (
  `paper_id`,
  `keyword`,
  `weight`,
  `source`,
  `status`,
  `del_flag`,
  `remark`,
  `create_by`,
  `create_time`,
  `update_by`,
  `update_time`
)
SELECT
  p.`paper_id`,
  '天回医简',
  12,
  '2',
  '0',
  '0',
  '',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM `paper` p
WHERE p.`title` = '天回医简整理与川派医学文献数字化研究'
  AND NOT EXISTS (
    SELECT 1
    FROM `paper_keyword` pk
    WHERE pk.`paper_id` = p.`paper_id`
      AND pk.`keyword` = '天回医简'
  );
--> statement-breakpoint
INSERT INTO `paper_keyword` (`paper_id`, `keyword`, `weight`, `source`, `status`, `del_flag`, `remark`, `create_by`, `create_time`, `update_by`, `update_time`)
SELECT p.`paper_id`, '释文整理', 9, '2', '0', '0', '', 'codex', NOW(), 'codex', NOW()
FROM `paper` p
WHERE p.`title` = '天回医简整理与川派医学文献数字化研究'
  AND NOT EXISTS (
    SELECT 1
    FROM `paper_keyword` pk
    WHERE pk.`paper_id` = p.`paper_id`
      AND pk.`keyword` = '释文整理'
  );
--> statement-breakpoint
INSERT INTO `paper_keyword` (`paper_id`, `keyword`, `weight`, `source`, `status`, `del_flag`, `remark`, `create_by`, `create_time`, `update_by`, `update_time`)
SELECT p.`paper_id`, '古籍数字化', 7, '2', '0', '0', '', 'codex', NOW(), 'codex', NOW()
FROM `paper` p
WHERE p.`title` = '天回医简整理与川派医学文献数字化研究'
  AND NOT EXISTS (
    SELECT 1
    FROM `paper_keyword` pk
    WHERE pk.`paper_id` = p.`paper_id`
      AND pk.`keyword` = '古籍数字化'
  );
--> statement-breakpoint
INSERT INTO `paper_keyword` (`paper_id`, `keyword`, `weight`, `source`, `status`, `del_flag`, `remark`, `create_by`, `create_time`, `update_by`, `update_time`)
SELECT p.`paper_id`, '脉诊', 10, '2', '0', '0', '', 'codex', NOW(), 'codex', NOW()
FROM `paper` p
WHERE p.`title` = '中医脉诊语义标注与智能分析方法研究'
  AND NOT EXISTS (
    SELECT 1
    FROM `paper_keyword` pk
    WHERE pk.`paper_id` = p.`paper_id`
      AND pk.`keyword` = '脉诊'
  );
--> statement-breakpoint
INSERT INTO `paper_keyword` (`paper_id`, `keyword`, `weight`, `source`, `status`, `del_flag`, `remark`, `create_by`, `create_time`, `update_by`, `update_time`)
SELECT p.`paper_id`, '语义标注', 8, '2', '0', '0', '', 'codex', NOW(), 'codex', NOW()
FROM `paper` p
WHERE p.`title` = '中医脉诊语义标注与智能分析方法研究'
  AND NOT EXISTS (
    SELECT 1
    FROM `paper_keyword` pk
    WHERE pk.`paper_id` = p.`paper_id`
      AND pk.`keyword` = '语义标注'
  );
--> statement-breakpoint
INSERT INTO `paper_keyword` (`paper_id`, `keyword`, `weight`, `source`, `status`, `del_flag`, `remark`, `create_by`, `create_time`, `update_by`, `update_time`)
SELECT p.`paper_id`, '知识组织', 6, '2', '0', '0', '', 'codex', NOW(), 'codex', NOW()
FROM `paper` p
WHERE p.`title` = '中医脉诊语义标注与智能分析方法研究'
  AND NOT EXISTS (
    SELECT 1
    FROM `paper_keyword` pk
    WHERE pk.`paper_id` = p.`paper_id`
      AND pk.`keyword` = '知识组织'
  );
--> statement-breakpoint
INSERT INTO `paper_keyword` (`paper_id`, `keyword`, `weight`, `source`, `status`, `del_flag`, `remark`, `create_by`, `create_time`, `update_by`, `update_time`)
SELECT p.`paper_id`, '针灸', 11, '2', '0', '0', '', 'codex', NOW(), 'codex', NOW()
FROM `paper` p
WHERE p.`title` = '针灸古籍图像识别与术语抽取实验'
  AND NOT EXISTS (
    SELECT 1
    FROM `paper_keyword` pk
    WHERE pk.`paper_id` = p.`paper_id`
      AND pk.`keyword` = '针灸'
  );
--> statement-breakpoint
INSERT INTO `paper_keyword` (`paper_id`, `keyword`, `weight`, `source`, `status`, `del_flag`, `remark`, `create_by`, `create_time`, `update_by`, `update_time`)
SELECT p.`paper_id`, '图像识别', 8, '2', '0', '0', '', 'codex', NOW(), 'codex', NOW()
FROM `paper` p
WHERE p.`title` = '针灸古籍图像识别与术语抽取实验'
  AND NOT EXISTS (
    SELECT 1
    FROM `paper_keyword` pk
    WHERE pk.`paper_id` = p.`paper_id`
      AND pk.`keyword` = '图像识别'
  );
--> statement-breakpoint
INSERT INTO `paper_keyword` (`paper_id`, `keyword`, `weight`, `source`, `status`, `del_flag`, `remark`, `create_by`, `create_time`, `update_by`, `update_time`)
SELECT p.`paper_id`, '术语抽取', 6, '2', '0', '0', '', 'codex', NOW(), 'codex', NOW()
FROM `paper` p
WHERE p.`title` = '针灸古籍图像识别与术语抽取实验'
  AND NOT EXISTS (
    SELECT 1
    FROM `paper_keyword` pk
    WHERE pk.`paper_id` = p.`paper_id`
      AND pk.`keyword` = '术语抽取'
  );
