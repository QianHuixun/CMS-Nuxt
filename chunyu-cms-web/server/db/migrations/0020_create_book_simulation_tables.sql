CREATE TABLE IF NOT EXISTS `book_simulation` (
  `book_simulation_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(300) NOT NULL,
  `author` varchar(300) DEFAULT '',
  `publisher` varchar(300) DEFAULT '',
  `publish_year` int DEFAULT NULL,
  `isbn` varchar(100) DEFAULT '',
  `summary` text,
  `cover_image` varchar(500) DEFAULT '',
  `back_cover_image` varchar(500) DEFAULT '',
  `status` char(1) DEFAULT '0',
  `del_flag` char(1) DEFAULT '0',
  `remark` varchar(500) DEFAULT '',
  `create_by` varchar(64) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` varchar(64) DEFAULT '',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`book_simulation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `book_simulation_page` (
  `book_simulation_page_id` int NOT NULL AUTO_INCREMENT,
  `book_simulation_id` int NOT NULL,
  `page_title` varchar(200) DEFAULT '',
  `page_no` int DEFAULT '0',
  `image_url` varchar(500) NOT NULL,
  `sort` int DEFAULT '0',
  `status` char(1) DEFAULT '0',
  `del_flag` char(1) DEFAULT '0',
  `remark` varchar(500) DEFAULT '',
  `create_by` varchar(64) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` varchar(64) DEFAULT '',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`book_simulation_page_id`),
  KEY `idx_book_simulation_page_book_id` (`book_simulation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
