# Duo项目API文档

## 1. API概述

本文档描述了Duo项目的REST API接口规范。所有API均遵循RESTful设计原则，使用JSON作为数据交换格式，并使用标准HTTP状态码表示请求结果。

### 1.1 基础URL

- 开发环境: `http://localhost:8080/api`
- 生产环境: `https://your-domain.com/api`

### 1.2 认证方式

除了登录和注册等公开接口外，所有API都需要通过JWT令牌进行认证。认证方式为在HTTP请求头中添加`Authorization`字段，格式为：

```
Authorization: Bearer {token}
```

### 1.3 通用响应格式

所有API响应均使用以下统一格式：

```json
{
  "code": 200,           // 业务状态码
  "message": "success",  // 状态描述
  "data": {              // 响应数据
    // 具体数据内容
  }
}
```

### 1.4 通用状态码

| 状态码 | 描述 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或认证失败 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 2. 认证接口

### 2.1 用户登录

- **URL**: `/auth/login`
- **方法**: `POST`
- **描述**: 用户登录并获取JWT令牌
- **请求参数**:

```json
{
  "username": "admin",
  "password": "password123"
}
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "userId": 1,
    "username": "admin"
  }
}
```

### 2.2 用户注册

- **URL**: `/auth/register`
- **方法**: `POST`
- **描述**: 注册新用户
- **请求参数**:

```json
{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com",
  "phone": "13800138000",
  "nickname": "新用户"
}
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": 5,
    "username": "newuser"
  }
}
```

### 2.3 刷新令牌

- **URL**: `/auth/refresh`
- **方法**: `POST`
- **描述**: 使用刷新令牌获取新的访问令牌
- **请求头**: `Authorization: Bearer {refresh_token}`
- **响应示例**:

```json
{
  "code": 200,
  "message": "刷新成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400
  }
}
```

### 2.4 退出登录

- **URL**: `/auth/logout`
- **方法**: `POST`
- **描述**: 用户退出登录，使当前令牌失效
- **请求头**: `Authorization: Bearer {token}`
- **响应示例**:

```json
{
  "code": 200,
  "message": "退出成功",
  "data": null
}
```

## 3. 用户接口

### 3.1 获取当前用户信息

- **URL**: `/users/me`
- **方法**: `GET`
- **描述**: 获取当前登录用户的详细信息
- **请求头**: `Authorization: Bearer {token}`
- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "email": "admin@example.com",
    "phone": "13800138000",
    "status": "ACTIVE",
    "roles": [
      {
        "id": 1,
        "name": "ROLE_ADMIN",
        "description": "管理员角色"
      }
    ]
  }
}
```

### 3.2 获取指定用户信息

- **URL**: `/users/{id}`
- **方法**: `GET`
- **描述**: 根据用户ID获取用户信息
- **请求头**: `Authorization: Bearer {token}`
- **路径参数**: `id` - 用户ID
- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 2,
    "username": "user1",
    "nickname": "用户1",
    "email": "user1@example.com",
    "phone": "13800138001",
    "status": "ACTIVE"
  }
}
```

### 3.3 更新用户信息

- **URL**: `/users/{id}`
- **方法**: `PUT`
- **描述**: 更新指定用户的信息
- **请求头**: `Authorization: Bearer {token}`
- **路径参数**: `id` - 用户ID
- **请求参数**:

```json
{
  "nickname": "新昵称",
  "email": "newemail@example.com",
  "phone": "13900139000"
}
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "新昵称",
    "email": "newemail@example.com",
    "phone": "13900139000",
    "status": "ACTIVE"
  }
}
```

### 3.4 修改密码

- **URL**: `/users/password`
- **方法**: `PUT`
- **描述**: 修改当前用户密码
- **请求头**: `Authorization: Bearer {token}`
- **请求参数**:

```json
{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "密码修改成功",
  "data": null
}
```

### 3.5 获取用户列表

- **URL**: `/users`
- **方法**: `GET`
- **描述**: 分页获取用户列表
- **请求头**: `Authorization: Bearer {token}`
- **查询参数**:
  - `page`: 页码，默认0
  - `size`: 每页大小，默认10
  - `sort`: 排序字段，默认id
  - `direction`: 排序方向，asc或desc，默认desc
  - `keyword`: 搜索关键词，可选
- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "username": "admin",
        "nickname": "管理员",
        "email": "admin@example.com",
        "phone": "13800138000",
        "status": "ACTIVE"
      },
      // 更多用户...
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": true,
        "unsorted": false,
        "empty": false
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "totalElements": 5,
    "totalPages": 1,
    "last": true,
    "size": 10,
    "number": 0,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "numberOfElements": 5,
    "first": true,
    "empty": false
  }
}
```

## 4. 角色和权限接口

### 4.1 获取所有角色

- **URL**: `/roles`
- **方法**: `GET`
- **描述**: 获取系统中所有角色
- **请求头**: `Authorization: Bearer {token}`
- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "ROLE_ADMIN",
      "description": "管理员角色"
    },
    {
      "id": 2,
      "name": "ROLE_USER",
      "description": "普通用户角色"
    }
  ]
}
```

### 4.2 获取所有权限

- **URL**: `/permissions`
- **方法**: `GET`
- **描述**: 获取系统中所有权限
- **请求头**: `Authorization: Bearer {token}`
- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "USER_CREATE",
      "description": "创建用户"
    },
    {
      "id": 2,
      "name": "USER_READ",
      "description": "查看用户"
    },
    // 更多权限...
  ]
}
```

### 4.3 获取角色的权限

- **URL**: `/roles/{roleId}/permissions`
- **方法**: `GET`
- **描述**: 获取指定角色的所有权限
- **请求头**: `Authorization: Bearer {token}`
- **路径参数**: `roleId` - 角色ID
- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "USER_CREATE",
      "description": "创建用户"
    },
    {
      "id": 2,
      "name": "USER_READ",
      "description": "查看用户"
    },
    // 更多权限...
  ]
}
```

### 4.4 更新角色权限

- **URL**: `/roles/{roleId}/permissions`
- **方法**: `PUT`
- **描述**: 更新指定角色的权限
- **请求头**: `Authorization: Bearer {token}`
- **路径参数**: `roleId` - 角色ID
- **请求参数**:

```json
{
  "permissionIds": [1, 2, 3, 4]
}
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "权限更新成功",
  "data": {
    "id": 1,
    "name": "ROLE_ADMIN",
    "description": "管理员角色",
    "permissions": [
      {
        "id": 1,
        "name": "USER_CREATE",
        "description": "创建用户"
      },
      // 更多权限...
    ]
  }
}
```

## 5. 系统接口

### 5.1 获取系统信息

- **URL**: `/system/info`
- **方法**: `GET`
- **描述**: 获取系统基本信息
- **请求头**: `Authorization: Bearer {token}`
- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "name": "Duo系统",
    "version": "1.0.0",
    "description": "Duo全栈应用框架",
    "serverTime": "2025-06-09T16:30:00.000+08:00"
  }
}
```

### 5.2 健康检查

- **URL**: `/system/health`
- **方法**: `GET`
- **描述**: 系统健康状态检查
- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "status": "UP",
    "components": {
      "db": {
        "status": "UP",
        "details": {
          "database": "MySQL",
          "validationQuery": "isValid()"
        }
      },
      "redis": {
        "status": "UP"
      },
      "diskSpace": {
        "status": "UP",
        "details": {
          "total": 500000000000,
          "free": 250000000000,
          "threshold": 10000000000
        }
      }
    }
  }
}
```

## 6. 错误响应示例

### 6.1 参数验证错误

```json
{
  "code": 400,
  "message": "请求参数错误",
  "data": {
    "errors": [
      {
        "field": "username",
        "message": "用户名不能为空"
      },
      {
        "field": "password",
        "message": "密码长度必须在6-20之间"
      }
    ]
  }
}
```

### 6.2 认证错误

```json
{
  "code": 401,
  "message": "未认证或认证已过期",
  "data": null
}
```

### 6.3 权限错误

```json
{
  "code": 403,
  "message": "权限不足",
  "data": null
}
```

### 6.4 资源不存在

```json
{
  "code": 404,
  "message": "用户不存在",
  "data": null
}
```

### 6.5 服务器错误

```json
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```

## 7. API版本控制

API版本控制通过URL路径实现，格式为：`/api/v{version}/{resource}`

例如：
- `/api/v1/users` - API v1版本的用户资源
- `/api/v2/users` - API v2版本的用户资源

当前默认版本为v1，可以省略版本号直接使用`/api/{resource}`。

## 8. API限流策略

为保护系统稳定性，API接口实施了限流策略：

- 匿名用户: 60次/分钟
- 认证用户: 300次/分钟
- 管理员用户: 600次/分钟

超出限制将返回429状态码(Too Many Requests)。

## 9. Swagger文档

在开发环境中，可以通过以下URL访问Swagger API文档：

```
http://localhost:8080/swagger-ui/index.html
```

Swagger提供了交互式API文档，可以直接在浏览器中测试API调用。
