-- 测试数据脚本（用于开发和测试环境）
USE duo_db;

-- 插入测试用户数据 (密码均为: password123)
INSERT INTO users (username, password, email, nickname, status) VALUES 
('user1', '$2a$10$IVwP9CYSJOCYzz.2XpW65OUozrxbBqXlnuam1AmMTvV0ueRcMlgou', 'user1@example.com', '用户1', 'ACTIVE'),
('user2', '$2a$10$IVwP9CYSJOCYzz.2XpW65OUozrxbBqXlnuam1AmMTvV0ueRcMlgou', 'user2@example.com', '用户2', 'ACTIVE'),
('guest', '$2a$10$IVwP9CYSJOCYzz.2XpW65OUozrxbBqXlnuam1AmMTvV0ueRcMlgou', 'guest@example.com', '访客', 'ACTIVE'),
('inactive', '$2a$10$IVwP9CYSJOCYzz.2XpW65OUozrxbBqXlnuam1AmMTvV0ueRcMlgou', 'inactive@example.com', '禁用用户', 'INACTIVE');

-- 关联测试用户和角色
INSERT INTO user_roles (user_id, role_id) VALUES 
(2, 2), -- user1是普通用户
(3, 2), -- user2是普通用户
(4, 3); -- guest是访客
