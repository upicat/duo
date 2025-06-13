-- 数据库初始化脚本（包含基础数据）
USE duo_db;

-- 插入基础角色数据
INSERT INTO roles (name, description) VALUES 
('ROLE_ADMIN', '管理员角色'),
('ROLE_USER', '普通用户角色'),
('ROLE_GUEST', '访客角色');

-- 插入基础权限数据
INSERT INTO permissions (name, description) VALUES 
('USER_CREATE', '创建用户'),
('USER_READ', '查看用户'),
('USER_UPDATE', '更新用户'),
('USER_DELETE', '删除用户'),
('ROLE_MANAGE', '管理角色'),
('PERMISSION_MANAGE', '管理权限');

-- 关联角色和权限
INSERT INTO role_permissions (role_id, permission_id) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), -- 管理员拥有所有权限
(2, 2), (2, 3), -- 普通用户有查看和更新权限
(3, 2); -- 访客只有查看权限

-- 创建默认管理员用户 (密码: password123)
INSERT INTO users (username, password, email, nickname, status) VALUES 
('admin', '$2a$10$wX9o0p2D2wFXjyQ/o9Y3yuJmZpIbJgpx2UDy62WQenxxGpwkMEazi', 'admin@example.com', '管理员', 'ACTIVE');

-- 关联管理员用户和角色
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);
