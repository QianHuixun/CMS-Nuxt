CREATE TABLE `patent` (
  `patent_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(500) NOT NULL,
  `patent_no` varchar(150) DEFAULT '',
  `applicant` varchar(300) DEFAULT '',
  `apply_year` int DEFAULT NULL,
  `abstract` text,
  `operation_video_url` varchar(500) DEFAULT '',
  `video_cover_url` varchar(500) DEFAULT '',
  `status` char(1) DEFAULT '0',
  `del_flag` char(1) DEFAULT '0',
  `remark` varchar(500) DEFAULT '',
  `create_by` varchar(64) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` varchar(64) DEFAULT '',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`patent_id`)
);
--> statement-breakpoint
CREATE TABLE `topic` (
  `topic_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(500) NOT NULL,
  `topic_no` varchar(150) DEFAULT '',
  `leader` varchar(100) DEFAULT '',
  `project_year` int DEFAULT NULL,
  `source` varchar(300) DEFAULT '',
  `abstract` text,
  `status` char(1) DEFAULT '0',
  `del_flag` char(1) DEFAULT '0',
  `remark` varchar(500) DEFAULT '',
  `create_by` varchar(64) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` varchar(64) DEFAULT '',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`topic_id`)
);
