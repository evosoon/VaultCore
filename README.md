<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## VaultCore

这是一个基于 NestJS 构建的仓库管理系统，具备开箱即用和高度可扩展的特点。它适用于课程设计、项目开发和货物信息管理，提供用户友好的界面和灵活的功能配置，帮助轻松管理库存。

##### 关于页面
![截屏2024-08-03 13 01 33](https://github.com/user-attachments/assets/ea114802-b063-4c5b-81a6-19cc6181837b)

[VaultView - VaultCore的前端仓库](https://github.com/evosoon/VaultView)

##### 关于文档
项目文档使用 [Swagger](https://swagger.io/) 生成，访问 `http://localhost:3000/swagger-ui` 查看文档。
![截屏2024-08-03 13 12 54](https://github.com/user-attachments/assets/a048ee73-ce6b-4359-ac6a-455831c2401f)


## 使用说明

##### 安装依赖  
```bash
$ npm install
```

##### 修改配置文件 
> 在此之前 - 通过 Docker 启动 MySql 与 Redis 服务。

在 `.env` 文件中修改配置，包括数据库连接信息、邮件服务、JWT密钥等。文件中有相关说明。






##### 启动项目

```bash
# 项目启动
$ npm run start

# 启动并开启监听模式
$ npm run start:dev

```

##### 项目打包

```bash
$ npm run build
```
