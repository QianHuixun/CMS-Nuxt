CREATE TABLE IF NOT EXISTS `topic` (
  `topic_id` int AUTO_INCREMENT NOT NULL,
  `title` varchar(300) NOT NULL,
  `topic_no` varchar(100) DEFAULT '',
  `level` varchar(100) DEFAULT '',
  `source` varchar(200) DEFAULT '',
  `leader` varchar(100) DEFAULT '',
  `research_status` varchar(50) DEFAULT 'preparing',
  `progress` int DEFAULT 0,
  `start_year` int,
  `end_year` int,
  `start_date` date,
  `end_date` date,
  `summary` text,
  `sort` int DEFAULT 0,
  `status` char(1) DEFAULT '0',
  `del_flag` char(1) DEFAULT '0',
  `remark` varchar(500) DEFAULT '',
  `create_by` varchar(64) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` varchar(64) DEFAULT '',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `topic_topic_id` PRIMARY KEY(`topic_id`)
);
--> statement-breakpoint
CREATE INDEX `topic_title_idx` ON `topic` (`title`);
--> statement-breakpoint
CREATE INDEX `topic_topic_no_idx` ON `topic` (`topic_no`);
--> statement-breakpoint
CREATE INDEX `topic_level_idx` ON `topic` (`level`);
--> statement-breakpoint
CREATE INDEX `topic_research_status_idx` ON `topic` (`research_status`);
--> statement-breakpoint
CREATE INDEX `topic_status_idx` ON `topic` (`status`);
--> statement-breakpoint
CREATE INDEX `topic_year_idx` ON `topic` (`start_year`, `end_year`);
