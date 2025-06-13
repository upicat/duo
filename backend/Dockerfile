# 使用Eclipse Temurin的Java 17基础镜像（Alpine轻量版）
FROM eclipse-temurin:17-jdk-alpine

# 设置工作目录
WORKDIR /app

# 复制Maven构建输出的JAR文件（通配符匹配版本号）
COPY target/backend-*.jar app.jar

# 暴露Spring Boot默认端口
EXPOSE 8080

# 启动命令（生产环境推荐添加JVM参数优化）
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-Xmx512m", "-jar", "app.jar"]
