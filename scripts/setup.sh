#!/bin/bash

# 确定项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# 检查必要的工具
check_requirements() {
  print_message "检查必要的工具..."
  
  # 检查Docker
  if ! command -v docker &> /dev/null; then
    print_error "Docker未安装，请先安装Docker: https://docs.docker.com/get-docker/"
    exit 1
  fi
  
  # 检查Docker Compose
  if ! command -v docker compose &> /dev/null; then
    print_error "Docker Compose未安装，请确保Docker已更新到支持compose命令的版本"
    exit 1
  fi
  
  print_message "所有必要的工具已安装 ✓"
}

# 创建环境变量文件
create_env_file() {
  print_message "创建环境变量文件..."
  
  (
    cd "${PROJECT_ROOT}" || { print_error "无法切换到项目根目录"; exit 1; }
    
    if [ ! -f .env ]; then
      cp .env.example .env
      print_message ".env文件已创建 ✓"
    else
      print_warning ".env文件已存在，跳过创建"
    fi
  )
}

# 启动开发环境
start_dev_environment() {
  print_message "启动开发环境..."
  
  (
    # 进入部署目录
    cd "${PROJECT_ROOT}/deployment" || { print_error "无法切换到部署目录"; exit 1; }
    
    # 启动开发环境
    docker compose -f docker-compose.dev.yml up -d
    
    if [ $? -eq 0 ]; then
      print_message "开发环境已成功启动 ✓"
      print_message "前端服务: http://localhost:3000"
      print_message "后端服务: http://localhost:8080/api"
      print_message "Swagger API文档: http://localhost:8080/swagger-ui/index.html"
    else
      print_error "启动开发环境失败，请检查日志"
      exit 1
    fi
  )
}

# 初始化数据库
init_database() {
  print_message "初始化数据库..."
  
  # 等待MySQL启动
  print_message "等待MySQL启动..."
  sleep 10
  
  (
    # 执行数据库初始化脚本
    docker exec duo-mysql-dev mysql -uroot -ppassword -e "source /docker-entrypoint-initdb.d/init.sql"
    
    if [ $? -eq 0 ]; then
      print_message "数据库初始化成功 ✓"
    else
      print_warning "数据库初始化可能失败，请检查日志"
    fi
  )
}

# 主函数
main() {
  print_message "开始设置Duo项目环境..."
  
  # 检查必要的工具
  check_requirements
  
  # 创建环境变量文件
  create_env_file
  
  # 启动开发环境
  start_dev_environment
  
  # 初始化数据库
  init_database
  
  print_message "Duo项目环境设置完成！"
  print_message "使用以下命令查看容器状态: docker compose -f ${PROJECT_ROOT}/deployment/docker-compose.dev.yml ps"
  print_message "使用以下命令查看日志: docker compose -f ${PROJECT_ROOT}/deployment/docker-compose.dev.yml logs -f"
}

# 执行主函数
main
