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

# 确认操作
confirm() {
  read -p "$(echo -e ${YELLOW}"$1 [y/N] "${NC})" response
  case "$response" in
    [yY][eE][sS]|[yY]) 
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

# 停止并删除容器
stop_containers() {
  print_message "停止并删除所有容器..."
  
  (
    # 进入部署目录
    cd "${PROJECT_ROOT}/deployment" || { print_error "无法切换到部署目录"; exit 1; }
    
    # 停止并删除开发环境容器
    docker compose -f docker-compose.dev.yml down
    
    # 停止并删除生产环境容器
    docker compose -f docker-compose.prod.yml down
    
    # 停止并删除默认环境容器
    docker compose down
  )
  
  print_message "所有容器已停止并删除 ✓"
}

# 删除数据卷
remove_volumes() {
  print_message "删除数据卷..."
  
  (
    # 删除开发环境数据卷
    docker volume rm deployment_mysql-data-dev deployment_redis-data-dev 2>/dev/null || true
    
    # 删除生产环境数据卷
    docker volume rm deployment_mysql-data-prod deployment_redis-data-prod 2>/dev/null || true
    
    # 删除默认环境数据卷
    docker volume rm deployment_mysql-data deployment_redis-data 2>/dev/null || true
  )
  
  print_message "所有数据卷已删除 ✓"
}

# 删除网络
remove_networks() {
  print_message "删除网络..."
  
  (
    # 删除开发环境网络
    docker network rm deployment_duo-network-dev 2>/dev/null || true
    
    # 删除生产环境网络
    docker network rm deployment_duo-network-prod 2>/dev/null || true
    
    # 删除默认环境网络
    docker network rm deployment_duo-network 2>/dev/null || true
  )
  
  print_message "所有网络已删除 ✓"
}

# 清理Docker系统
clean_docker() {
  print_message "清理Docker系统..."
  
  (
    # 删除未使用的镜像
    docker image prune -f
    
    # 删除未使用的卷
    docker volume prune -f
    
    # 删除未使用的网络
    docker network prune -f
  )
  
  print_message "Docker系统已清理 ✓"
}

# 重置数据库
reset_database() {
  print_message "重置数据库..."
  
  (
    # 进入数据库目录
    cd "${PROJECT_ROOT}/database" || { print_error "无法切换到数据库目录"; exit 1; }
    
    # 创建临时容器执行SQL脚本
    docker run --rm --name mysql-temp -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=duo_db -v $(pwd):/sql -d mysql:8.0
    
    # 等待MySQL启动
    print_message "等待MySQL启动..."
    sleep 10
    
    # 执行数据库初始化脚本
    docker exec mysql-temp mysql -uroot -ppassword -e "DROP DATABASE IF EXISTS duo_db; CREATE DATABASE duo_db;"
    docker exec mysql-temp mysql -uroot -ppassword duo_db -e "source /sql/init.sql"
    
    # 停止临时容器
    docker stop mysql-temp
  )
  
  print_message "数据库已重置 ✓"
}

# 主函数
main() {
  print_message "开始重置Duo项目环境..."
  
  if ! confirm "此操作将删除所有容器、数据卷和网络，确定要继续吗？"; then
    print_message "操作已取消"
    exit 0
  fi
  
  # 停止并删除容器
  stop_containers
  
  if confirm "是否要删除所有数据卷？这将导致数据丢失！"; then
    # 删除数据卷
    remove_volumes
  else
    print_warning "跳过删除数据卷"
  fi
  
  # 删除网络
  remove_networks
  
  if confirm "是否要清理Docker系统？"; then
    # 清理Docker系统
    clean_docker
  else
    print_warning "跳过清理Docker系统"
  fi
  
  if confirm "是否要重置数据库？"; then
    # 重置数据库
    reset_database
  else
    print_warning "跳过重置数据库"
  fi
  
  print_message "Duo项目环境已重置！"
  print_message "使用 ${PROJECT_ROOT}/scripts/setup.sh 重新启动环境"
}

# 执行主函数
main
