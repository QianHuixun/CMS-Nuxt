-- ----------------------------
-- Table structure for activity
-- ----------------------------
DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity` (
  `activity_id` int NOT NULL AUTO_INCREMENT COMMENT '活动ID',
  `name` varchar(255) NOT NULL COMMENT '活动名称',
  `description` text COMMENT '活动描述',
  `thumbnail` varchar(500) DEFAULT '' COMMENT '缩略图',
  `content_blocks` text COMMENT '内容区块JSON',
  `content_html` text COMMENT '富文本HTML',
  `sort` int DEFAULT 0 COMMENT '排序',
  `status` char(1) DEFAULT '0' COMMENT '状态 0:草稿 1:发布',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`activity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='活动管理表';

-- ----------------------------
-- Records of activity
-- ----------------------------
BEGIN;
INSERT INTO `activity` (`name`, `description`, `thumbnail`, `content_blocks`, `content_html`, `sort`, `status`) VALUES
('中医药文化展', '沉浸式体验中医药文化', 'https://picsum.photos/200/150?random=10', '[{\"id\":\"block_demo_1\",\"type\":\"text\",\"content\":\"欢迎来到中医药文化展览\",\"bgColor\":\"#ffffff\",\"padding\":16,\"sort\":0,\"config\":{\"fontSize\":16,\"color\":\"#303133\",\"align\":\"left\",\"bold\":false,\"italic\":false}},{\"id\":\"block_demo_2\",\"type\":\"image\",\"content\":\"https://picsum.photos/800/400?random=20\",\"bgColor\":\"#ffffff\",\"padding\":16,\"sort\":1,\"config\":{\"width\":100,\"borderRadius\":8,\"alt\":\"中医药图片\"}}]', '', 1, '1'),
('本草纲目数字展', '数字化展示本草纲目', 'https://picsum.photos/200/150?random=11', '', '', 2, '0');
COMMIT;
