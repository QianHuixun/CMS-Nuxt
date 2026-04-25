ALTER TABLE `activity`
ADD COLUMN `is_headline` char(1) DEFAULT '0' AFTER `content_html`;
