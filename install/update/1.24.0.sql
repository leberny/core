ALTER TABLE `user` 
ADD COLUMN `hash` VARCHAR(255) NULL DEFAULT NULL AFTER `options`;

