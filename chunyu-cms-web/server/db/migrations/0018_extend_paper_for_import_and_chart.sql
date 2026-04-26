ALTER TABLE `paper`
ADD COLUMN `publish_year` int NULL AFTER `keywords`;
--> statement-breakpoint
ALTER TABLE `paper`
ADD COLUMN `is_featured` char(1) DEFAULT '0' AFTER `publish_year`;
--> statement-breakpoint
UPDATE `paper`
SET `publish_year` = 2024,
    `is_featured` = '1'
WHERE `title` = '天回医简整理与川派医学文献数字化研究';
--> statement-breakpoint
UPDATE `paper`
SET `publish_year` = 2023,
    `is_featured` = '0'
WHERE `title` = '中医脉诊语义标注与智能分析方法研究';
--> statement-breakpoint
UPDATE `paper`
SET `publish_year` = 2022,
    `is_featured` = '1'
WHERE `title` = '针灸古籍图像识别与术语抽取实验';
