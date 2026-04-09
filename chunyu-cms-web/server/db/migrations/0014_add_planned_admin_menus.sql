INSERT INTO `menu` (
  `menu_id`,
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
  121,
  '系统基础配置管理',
  1,
  'system-base-config',
  NULL,
  NULL,
  1,
  '0',
  'M',
  '0',
  '0',
  NULL,
  'system',
  0,
  '121.',
  '系统基础配置管理目录',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `menu` WHERE `menu_id` = 121);
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_id`, `menu_name`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`,
  `menu_type`, `visible`, `status`, `perms`, `icon`, `parent_menu_id`, `mpath`, `remark`,
  `create_by`, `create_time`, `update_by`, `update_time`
)
SELECT
  122,
  '导航配置',
  1,
  'nav-config',
  'systemBaseConfig/navConfig/index',
  NULL,
  1,
  '0',
  'C',
  '0',
  '0',
  'systemBaseConfig:navConfig:list',
  'guide',
  121,
  '121.122.',
  '导航配置页面',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `menu` WHERE `menu_id` = 122);
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_id`, `menu_name`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`,
  `menu_type`, `visible`, `status`, `perms`, `icon`, `parent_menu_id`, `mpath`, `remark`,
  `create_by`, `create_time`, `update_by`, `update_time`
)
SELECT
  123,
  '屏保配置',
  2,
  'screen-saver-config',
  'systemBaseConfig/screenSaverConfig/index',
  NULL,
  1,
  '0',
  'C',
  '0',
  '0',
  'systemBaseConfig:screenSaverConfig:list',
  'theme',
  121,
  '121.123.',
  '屏保配置页面',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `menu` WHERE `menu_id` = 123);
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_id`, `menu_name`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`,
  `menu_type`, `visible`, `status`, `perms`, `icon`, `parent_menu_id`, `mpath`, `remark`,
  `create_by`, `create_time`, `update_by`, `update_time`
)
SELECT
  124,
  '人才与对应科研管理',
  2,
  'talent-research',
  NULL,
  NULL,
  1,
  '0',
  'M',
  '0',
  '0',
  NULL,
  'peoples',
  0,
  '124.',
  '人才与对应科研管理目录',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `menu` WHERE `menu_id` = 124);
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_id`, `menu_name`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`,
  `menu_type`, `visible`, `status`, `perms`, `icon`, `parent_menu_id`, `mpath`, `remark`,
  `create_by`, `create_time`, `update_by`, `update_time`
)
SELECT
  125,
  '专家库管理',
  1,
  'expert-library',
  'talentResearch/expertLibrary/index',
  NULL,
  1,
  '0',
  'C',
  '0',
  '0',
  'talentResearch:expertLibrary:list',
  'peoples',
  124,
  '124.125.',
  '专家库管理页面',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `menu` WHERE `menu_id` = 125);
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_id`, `menu_name`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`,
  `menu_type`, `visible`, `status`, `perms`, `icon`, `parent_menu_id`, `mpath`, `remark`,
  `create_by`, `create_time`, `update_by`, `update_time`
)
SELECT
  126,
  '课题时空管理',
  2,
  'topic-space-time',
  'talentResearch/topicSpaceTime/index',
  NULL,
  1,
  '0',
  'C',
  '0',
  '0',
  'talentResearch:topicSpaceTime:list',
  'time-range',
  124,
  '124.126.',
  '课题时空管理页面',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `menu` WHERE `menu_id` = 126);
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_id`, `menu_name`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`,
  `menu_type`, `visible`, `status`, `perms`, `icon`, `parent_menu_id`, `mpath`, `remark`,
  `create_by`, `create_time`, `update_by`, `update_time`
)
SELECT
  127,
  '论文著作与成果管理',
  3,
  'paper-achievement',
  NULL,
  NULL,
  1,
  '0',
  'M',
  '0',
  '0',
  NULL,
  'documentation',
  0,
  '127.',
  '论文著作与成果管理目录',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `menu` WHERE `menu_id` = 127);
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_id`, `menu_name`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`,
  `menu_type`, `visible`, `status`, `perms`, `icon`, `parent_menu_id`, `mpath`, `remark`,
  `create_by`, `create_time`, `update_by`, `update_time`
)
SELECT
  128,
  '书籍导入',
  1,
  'book-import',
  'paperAchievement/bookImport/index',
  NULL,
  1,
  '0',
  'C',
  '0',
  '0',
  'paperAchievement:bookImport:list',
  'documentation',
  127,
  '127.128.',
  '书籍导入页面',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `menu` WHERE `menu_id` = 128);
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_id`, `menu_name`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`,
  `menu_type`, `visible`, `status`, `perms`, `icon`, `parent_menu_id`, `mpath`, `remark`,
  `create_by`, `create_time`, `update_by`, `update_time`
)
SELECT
  129,
  '仿真录入',
  2,
  'simulation-entry',
  'paperAchievement/simulationEntry/index',
  NULL,
  1,
  '0',
  'C',
  '0',
  '0',
  'paperAchievement:simulationEntry:list',
  'edit',
  127,
  '127.129.',
  '仿真录入页面',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `menu` WHERE `menu_id` = 129);
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_id`, `menu_name`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`,
  `menu_type`, `visible`, `status`, `perms`, `icon`, `parent_menu_id`, `mpath`, `remark`,
  `create_by`, `create_time`, `update_by`, `update_time`
)
SELECT
  130,
  '自动化辅助',
  4,
  'automation-tools',
  NULL,
  NULL,
  1,
  '0',
  'M',
  '0',
  '0',
  NULL,
  'chart',
  0,
  '130.',
  '自动化辅助目录',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `menu` WHERE `menu_id` = 130);
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_id`, `menu_name`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`,
  `menu_type`, `visible`, `status`, `perms`, `icon`, `parent_menu_id`, `mpath`, `remark`,
  `create_by`, `create_time`, `update_by`, `update_time`
)
SELECT
  131,
  '词云',
  1,
  'word-cloud',
  'automationTools/wordCloud/index',
  NULL,
  1,
  '0',
  'C',
  '0',
  '0',
  'automationTools:wordCloud:list',
  'chart',
  130,
  '130.131.',
  '词云页面',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `menu` WHERE `menu_id` = 131);
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_id`, `menu_name`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`,
  `menu_type`, `visible`, `status`, `perms`, `icon`, `parent_menu_id`, `mpath`, `remark`,
  `create_by`, `create_time`, `update_by`, `update_time`
)
SELECT
  132,
  '图表生成',
  2,
  'chart-generator',
  'automationTools/chartGenerator/index',
  NULL,
  1,
  '0',
  'C',
  '0',
  '0',
  'automationTools:chartGenerator:list',
  'chart',
  130,
  '130.132.',
  '图表生成页面',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `menu` WHERE `menu_id` = 132);
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_id`, `menu_name`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`,
  `menu_type`, `visible`, `status`, `perms`, `icon`, `parent_menu_id`, `mpath`, `remark`,
  `create_by`, `create_time`, `update_by`, `update_time`
)
SELECT
  133,
  '活动管理',
  5,
  'activity-management',
  NULL,
  NULL,
  1,
  '0',
  'M',
  '0',
  '0',
  NULL,
  'star',
  0,
  '133.',
  '活动管理目录',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `menu` WHERE `menu_id` = 133);
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_id`, `menu_name`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`,
  `menu_type`, `visible`, `status`, `perms`, `icon`, `parent_menu_id`, `mpath`, `remark`,
  `create_by`, `create_time`, `update_by`, `update_time`
)
SELECT
  134,
  '沉浸式编辑',
  1,
  'immersive-editor',
  'activityManagement/immersiveEditor/index',
  NULL,
  1,
  '0',
  'C',
  '0',
  '0',
  'activityManagement:immersiveEditor:list',
  'build',
  133,
  '133.134.',
  '沉浸式编辑页面',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `menu` WHERE `menu_id` = 134);
--> statement-breakpoint
INSERT INTO `menu` (
  `menu_id`, `menu_name`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`,
  `menu_type`, `visible`, `status`, `perms`, `icon`, `parent_menu_id`, `mpath`, `remark`,
  `create_by`, `create_time`, `update_by`, `update_time`
)
SELECT
  135,
  '头条精选',
  2,
  'headline-featured',
  'activityManagement/headlineFeatured/index',
  NULL,
  1,
  '0',
  'C',
  '0',
  '0',
  'activityManagement:headlineFeatured:list',
  'star',
  133,
  '133.135.',
  '头条精选页面',
  'codex',
  NOW(),
  'codex',
  NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `menu` WHERE `menu_id` = 135);
