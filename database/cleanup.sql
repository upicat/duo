-- 数据清理脚本
-- 用于清空所有表数据，同时处理外键约束问题

USE duo_db;

-- 临时禁用外键检查
SET FOREIGN_KEY_CHECKS = 0;

-- 清空所有表数据（按依赖关系顺序）
TRUNCATE TABLE user_roles;
TRUNCATE TABLE role_permissions;
TRUNCATE TABLE users;
TRUNCATE TABLE roles;
TRUNCATE TABLE permissions;

-- 重新启用外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- 重置自增ID
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE roles AUTO_INCREMENT = 1;
ALTER TABLE permissions AUTO_INCREMENT = 1;
