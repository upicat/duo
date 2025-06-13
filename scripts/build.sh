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

# 构建后端
build_backend() {
  print_message "构建后端..."
  
  (
    # 进入后端目录
    cd "${PROJECT_ROOT}/backend" || { print_error "无法切换到后端目录"; exit 1; }
    
    # 检查Maven是否安装
    if ! command -v mvn &> /dev/null; then
      print_warning "Maven未安装，使用Maven包装器..."
      
      # 使用Maven包装器构建
      ./mvnw clean package -DskipTests
    else
      # 使用Maven构建
      mvn clean package -DskipTests
    fi
    
    if [ $? -eq 0 ]; then
      print_message "后端构建成功 ✓"
    else
      print_error "后端构建失败"
      exit 1
    fi
  )
}

# 构建前端
build_frontend() {
  print_message "构建前端..."
  
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
    
    # 构建前端
    npm run build
    
    if [ $? -eq 0 ]; then
      print_message "前端构建成功 ✓"
    else
      print_error "前端构建失败"
      exit 1
    fi
  )
}

# 构建Docker镜像
build_docker_images() {
  print_message "构建Docker镜像..."
  
  # 检查部署目录是否存在
  if [ -d "${PROJECT_ROOT}/deployment" ]; then
    (
      # 进入部署目录
      cd "${PROJECT_ROOT}/deployment" || { print_error "无法切换到部署目录"; exit 1; }
      
      # 检查后端目录是否存在
      if [ -d "${PROJECT_ROOT}/backend" ]; then
        # 构建后端镜像
        print_message "构建后端Docker镜像..."
        docker build -t duo-backend:latest "${PROJECT_ROOT}/backend"
        
        if [ $? -ne 0 ]; then
          print_error "后端Docker镜像构建失败"
          exit 1
        fi
      else
        print_warning "后端目录不存在，跳过后端Docker镜像构建"
      fi
      
      # 构建前端镜像
      print_message "构建前端Docker镜像..."
      docker build -t duo-frontend:latest "${PROJECT_ROOT}/frontend"
      
      if [ $? -ne 0 ]; then
        print_error "前端Docker镜像构建失败"
        exit 1
      fi
    )
  else
    # 直接在当前目录构建
    print_warning "部署目录不存在，在当前目录构建Docker镜像"
    
    # 检查后端目录是否存在
    if [ -d "${PROJECT_ROOT}/backend" ]; then
      # 构建后端镜像
      print_message "构建后端Docker镜像..."
      docker build -t duo-backend:latest "${PROJECT_ROOT}/backend"
      
      if [ $? -ne 0 ]; then
        print_error "后端Docker镜像构建失败"
        exit 1
      fi
    else
      print_warning "后端目录不存在，跳过后端Docker镜像构建"
    fi
    
    # 构建前端镜像
    print_message "构建前端Docker镜像..."
    docker build -t duo-frontend:latest "${PROJECT_ROOT}/frontend"
    
    if [ $? -ne 0 ]; then
      print_error "前端Docker镜像构建失败"
      exit 1
    fi
  fi
  
  print_message "Docker镜像构建成功 ✓"
}

# 推送Docker镜像到仓库
push_docker_images() {
  print_message "推送Docker镜像到仓库..."
  
  (
    # 设置Docker仓库地址
    DOCKER_REGISTRY=${DOCKER_REGISTRY:-"docker.io"}
    DOCKER_NAMESPACE=${DOCKER_NAMESPACE:-"duo"}
    
    # 检查后端镜像是否存在
    if docker image inspect duo-backend:latest &> /dev/null; then
      # 标记后端镜像
      docker tag duo-backend:latest ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/duo-backend:latest
      
      # 推送后端镜像
      docker push ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/duo-backend:latest
      
      if [ $? -ne 0 ]; then
        print_error "后端Docker镜像推送失败"
        exit 1
      fi
    fi
    
    # 标记前端镜像
    docker tag duo-frontend:latest ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/duo-frontend:latest
    
    # 推送前端镜像
    docker push ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/duo-frontend:latest
    
    if [ $? -eq 0 ]; then
      print_message "Docker镜像推送成功 ✓"
    else
      print_error "Docker镜像推送失败，请检查Docker登录状态和权限"
      exit 1
    fi
  )
}

# 主函数
main() {
  print_message "开始构建Duo项目..."
  
  # 检查后端目录是否存在
  if [ -d "backend" ]; then
    # 构建后端
    build_backend
  else
    print_warning "后端目录不存在，跳过后端构建"
  fi
  
  # 构建前端
  build_frontend
  
  # 构建Docker镜像
  if confirm "是否要构建Docker镜像？"; then
    build_docker_images
    
    # 推送Docker镜像
    if confirm "是否要推送Docker镜像到仓库？"; then
      push_docker_images
    else
      print_warning "跳过推送Docker镜像"
    fi
  else
    print_warning "跳过构建Docker镜像"
  fi
  
  print_message "Duo项目构建完成！"
}

# 执行主函数
main
