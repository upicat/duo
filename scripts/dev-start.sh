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

# 启动数据库和Redis
start_infrastructure() {
  print_message "启动基础设施服务（MySQL和Redis）..."
  
  (
    # 进入部署目录
    cd "${PROJECT_ROOT}/deployment" || { print_error "无法切换到部署目录"; exit 1; }
    
    # 启动MySQL和Redis
    docker compose -f docker-compose.dev.yml up -d mysql redis
    
    if [ $? -eq 0 ]; then
      print_message "基础设施服务已启动 ✓"
    else
      print_error "启动基础设施服务失败"
      exit 1
    fi
  )
  
  # 等待MySQL启动
  print_message "等待MySQL启动..."
  sleep 10
}

# 启动后端服务
start_backend() {
  print_message "启动后端服务..."
  
  (
    # 进入后端目录
    cd "${PROJECT_ROOT}/backend" || { print_error "无法切换到后端目录"; exit 1; }
    
    # 检查Maven是否安装
    if ! command -v mvn &> /dev/null; then
      print_warning "Maven未安装，使用Maven包装器..."
      
      # 使用Maven包装器启动
      ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev &
    else
      # 使用Maven启动
      mvn spring-boot:run -Dspring-boot.run.profiles=dev &
    fi
    
    # 保存后端进程ID
    BACKEND_PID=$!
    
    print_message "后端服务已启动，PID: $BACKEND_PID ✓"
    print_message "后端API地址: http://localhost:8080/api"
    print_message "Swagger API文档: http://localhost:8080/swagger-ui/index.html"
    
    # 将PID导出到父shell
    echo $BACKEND_PID > /tmp/duo_backend_pid
  )
  
  # 从临时文件获取PID
  BACKEND_PID=$(cat /tmp/duo_backend_pid)
  rm /tmp/duo_backend_pid
  
  # 等待后端启动
  print_message "等待后端服务启动..."
  sleep 10
}

# 启动前端服务
start_frontend() {
  print_message "启动前端服务..."
  
  (
    # 进入前端目录
    cd "${PROJECT_ROOT}/frontend" || { print_error "无法切换到前端目录"; exit 1; }
    
    # 检查Node.js是否安装
    if ! command -v node &> /dev/null; then
      print_error "Node.js未安装，请先安装Node.js: https://nodejs.org/"
      exit 1
    fi
    
    # 安装依赖
    npm install
    
    if [ $? -ne 0 ]; then
      print_error "前端依赖安装失败"
      exit 1
    fi
    
    # 启动前端开发服务器
    npm run dev &
    
    # 保存前端进程ID
    FRONTEND_PID=$!
    
    # 将PID导出到父shell
    echo $FRONTEND_PID > /tmp/duo_frontend_pid
  )
  
  # 从临时文件获取PID
  FRONTEND_PID=$(cat /tmp/duo_frontend_pid)
  rm /tmp/duo_frontend_pid
  
  print_message "前端服务已启动，PID: $FRONTEND_PID ✓"
  print_message "前端地址: http://localhost:3000"
}

# 监控服务
monitor_services() {
  print_message "开发环境已启动，按Ctrl+C停止所有服务..."
  
  # 捕获SIGINT信号
  trap cleanup SIGINT
  
  # 等待用户中断
  wait
}

# 清理资源
cleanup() {
  print_message "正在停止服务..."
  
  # 停止前端进程
  if [ ! -z "$FRONTEND_PID" ]; then
    kill $FRONTEND_PID 2>/dev/null || true
  fi
  
  # 停止后端进程
  if [ ! -z "$BACKEND_PID" ]; then
    kill $BACKEND_PID 2>/dev/null || true
  fi
  
  (
    # 进入部署目录
    cd "${PROJECT_ROOT}/deployment" || { print_error "无法切换到部署目录"; exit 1; }
    
    # 停止基础设施服务
    docker compose -f docker-compose.dev.yml stop mysql redis
  )
  
  print_message "所有服务已停止 ✓"
  exit 0
}

# 主函数
main() {
  print_message "启动Duo项目开发环境..."
  
  # 检查必要的工具
  check_requirements
  
  # 启动基础设施
  start_infrastructure
  
  # 启动后端服务
  start_backend
  
  # 启动前端服务
  start_frontend
  
  # 监控服务
  monitor_services
}

# 执行主函数
main
