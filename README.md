# Duo - 前后端分离项目

这是一个基于 React + TypeScript + Spring Boot 的现代化前后端分离项目。

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Redux Toolkit
- CSS Modules

### 后端
- Java 17
- Spring Boot 3
- Spring Security
- JWT
- MySQL
- Redis

## 快速开始

### 方式一：使用启动脚本
```bash
# 克隆项目
git clone <repository-url>
cd duo

# 一键启动环境
chmod +x scripts/setup.sh
./scripts/setup.sh

# 启动服务
cd backend && mvn spring-boot:run &
cd frontend && npm run dev
```

### 方式二：手动启动
```bash
# 1. 启动数据库
cd deployment
docker compose up -d mysql redis

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 3. 启动后端
cd backend
mvn spring-boot:run

# 4. 启动前端
cd frontend
npm install
npm run dev
```

## 生产部署

### 使用Docker一键部署
```bash
cd deployment
docker compose up -d
```

### 访问地址
- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:8080
- **API文档**: http://localhost:8080/swagger-ui.html
- **生产环境**: http://localhost (Nginx代理)

## 开发指南

### 前端开发
```bash
cd frontend
npm run dev          # 开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览生产版本
npm run lint         # 代码检查
```

### 后端开发
```bash
cd backend
mvn spring-boot:run  # 启动开发服务器
mvn clean package    # 打包
mvn test            # 运行测试
```

## 项目特色

- ✅ **开箱即用**: 完整的项目结构和配置
- ✅ **环境隔离**: 开发、测试、生产环境配置分离
- ✅ **类型安全**: TypeScript + Java强类型系统
- ✅ **现代化技术栈**: React 18 + Spring Boot 3
- ✅ **容器化部署**: Docker + Docker Compose
- ✅ **代码规范**: ESLint + Prettier + Checkstyle
- ✅ **安全认证**: JWT + Spring Security
- ✅ **API文档**: Swagger/OpenAPI 3.0
- ✅ **状态管理**: Redux Toolkit
- ✅ **响应式设计**: CSS Modules + Flexbox

## 许可证

MIT License
