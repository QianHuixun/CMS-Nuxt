CREATE TABLE IF NOT EXISTS `talent` (
  `talent_id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(100) NOT NULL,
  `name_en` varchar(150) DEFAULT '',
  `gender` char(1) DEFAULT '3',
  `avatar` varchar(500) DEFAULT '',
  `card_background` varchar(500) DEFAULT '',
  `organization` varchar(200) DEFAULT '',
  `department` varchar(200) DEFAULT '',
  `title` varchar(100) DEFAULT '',
  `position` varchar(100) DEFAULT '',
  `research_direction` varchar(500) DEFAULT '',
  `profile` text,
  `email` varchar(150) DEFAULT '',
  `phone` varchar(50) DEFAULT '',
  `sort` int DEFAULT 0,
  `status` char(1) DEFAULT '0',
  `del_flag` char(1) DEFAULT '0',
  `remark` varchar(500) DEFAULT '',
  `create_by` varchar(64) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` varchar(64) DEFAULT '',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `talent_talent_id` PRIMARY KEY(`talent_id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `talent_paper` (
  `talent_paper_id` int AUTO_INCREMENT NOT NULL,
  `talent_id` int NOT NULL,
  `paper_id` int NOT NULL,
  `relation_role` varchar(100) DEFAULT '',
  `sort` int DEFAULT 0,
  `remark` varchar(500) DEFAULT '',
  `create_by` varchar(64) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` varchar(64) DEFAULT '',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `talent_paper_talent_paper_id` PRIMARY KEY(`talent_paper_id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `talent_topic` (
  `talent_topic_id` int AUTO_INCREMENT NOT NULL,
  `talent_id` int NOT NULL,
  `topic_id` int NOT NULL,
  `relation_role` varchar(100) DEFAULT '',
  `sort` int DEFAULT 0,
  `remark` varchar(500) DEFAULT '',
  `create_by` varchar(64) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` varchar(64) DEFAULT '',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `talent_topic_talent_topic_id` PRIMARY KEY(`talent_topic_id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `talent_patent` (
  `talent_patent_id` int AUTO_INCREMENT NOT NULL,
  `talent_id` int NOT NULL,
  `patent_id` int NOT NULL,
  `relation_role` varchar(100) DEFAULT '',
  `sort` int DEFAULT 0,
  `remark` varchar(500) DEFAULT '',
  `create_by` varchar(64) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` varchar(64) DEFAULT '',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `talent_patent_talent_patent_id` PRIMARY KEY(`talent_patent_id`)
);
--> statement-breakpoint
CREATE INDEX `talent_name_idx` ON `talent` (`name`);
--> statement-breakpoint
CREATE INDEX `talent_status_idx` ON `talent` (`status`);
--> statement-breakpoint
CREATE INDEX `talent_paper_talent_id_idx` ON `talent_paper` (`talent_id`);
--> statement-breakpoint
CREATE INDEX `talent_topic_talent_id_idx` ON `talent_topic` (`talent_id`);
--> statement-breakpoint
CREATE INDEX `talent_patent_talent_id_idx` ON `talent_patent` (`talent_id`);
