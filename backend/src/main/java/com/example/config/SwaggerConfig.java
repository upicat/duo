package com.example.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
@Profile({ "dev", "test" }) // 仅在开发和测试环境启用
public class SwaggerConfig {

    @Value("${server.servlet.context-path:/}")
    private String contextPath;

    @Value("${spring.application.name:API}")
    private String applicationName;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .addServersItem(new Server().url(contextPath))
                .info(apiInfo())
                .components(securityComponents())
        // .addSecurityItem(new SecurityRequirement()
        // .addList("Bearer Authentication")
        // // .addList("API Key Authentication")
        // // .addList("Basic Authentication")
        // )
        ;
    }

    private Info apiInfo() {
        return new Info()
                .title(applicationName + " API")
                .version("1.0.0")
                .description("RESTful API 文档")
                .contact(new Contact()
                        .name("开发团队")
                        .email("dev@company.com")
                        .url("https://company.com"))
                .license(new License()
                        .name("MIT License")
                        .url("https://opensource.org/licenses/MIT"));
    }

    private Components securityComponents() {
        return new Components()
                .addSecuritySchemes("Bearer Authentication", new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("请输入JWT token，格式：Bearer <token>"));
    }
}
