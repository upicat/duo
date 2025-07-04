# 数据库脚本说明

本目录包含了项目的数据库相关脚本文件，已经过优化去除冗余信息。

## 文件说明

### 1. schema.sql
- **用途**: 数据库表结构定义
- **内容**: 创建数据库和所有表的DDL语句
- **使用场景**: 初次搭建数据库时使用

### 2. init.sql  
- **用途**: 数据库初始化脚本
- **内容**: 插入系统必需的基础数据（角色、权限、默认管理员用户）
- **使用场景**: 在创建表结构后，插入系统运行所需的基础数据

### 3. data.sql
- **用途**: 测试数据脚本
- **内容**: 插入用于开发和测试的示例数据
- **使用场景**: 开发和测试环境中使用，生产环境不建议执行

### 4. cleanup.sql
- **用途**: 数据清理脚本
- **内容**: 安全地清空所有表数据，处理外键约束问题
- **使用场景**: 需要重置数据库数据时使用

## 执行顺序

1. 首先执行 `schema.sql` 创建数据库和表结构
2. 然后执行 `init.sql` 插入基础数据
3. 最后执行 `data.sql` 插入测试数据（可选）

## 数据清理

如果需要清空数据库重新初始化，可以使用：
```bash
# 清空所有数据（处理外键约束）
mysql -u root -p < cleanup.sql

# 重新插入基础数据
mysql -u root -p < init.sql

# 重新插入测试数据（可选）
mysql -u root -p < data.sql
```

## 优化说明

本次优化主要解决了以下冗余问题：

1. **消除重复的表结构定义**: 将表结构定义统一到 `schema.sql` 中
2. **合并基础数据**: 将系统必需的角色、权限数据统一到 `init.sql` 中
3. **分离测试数据**: 将测试用户数据独立到 `data.sql` 中
4. **统一管理员账户**: 避免了不同文件中管理员账户的重复和冲突
5. **解决外键约束问题**: 新增cleanup.sql处理数据清理时的外键约束

## 使用示例

```bash
# 完整初始化流程
mysql -u root -p < schema.sql
mysql -u root -p < init.sql
mysql -u root -p < data.sql

# 重置数据流程
mysql -u root -p < cleanup.sql
mysql -u root -p < init.sql
mysql -u root -p < data.sql
```

## 注意事项

- `cleanup.sql` 会清空所有数据，请谨慎使用
- 生产环境建议只执行 `schema.sql` 和 `init.sql`
- `data.sql` 仅用于开发和测试环境
