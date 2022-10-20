## Description

 该项目是由 Nest + typeScript + typeORM + mysql + redis + docker <BR>等技术栈组成

## Installation

```bash
安装NestJS 
$ npm install -g typescript
$ npm install -g @nestjs/cli

自行安装mysql,以及redis
mysql需要创建interview_test默认库

```

## Running the app

```bash
项目集成了docker技术,  只需执行以下启动命令即可启动程序, 不需要额外安装对应组件依赖<BR>
# development
$ npm run start   //启动项目

# watch mode
$ npm run start:dev  //以热部署的方式, 启动项目

```

## Other way Running the app

```bash
如果需要本地启动项目,需要安装以下依赖
进入项目路径
cd [Project Path]

安装mysql驱动
npm install --save @nestjs/typeorm typeorm mysql

安装typeORM
npm install typeorm --save

安装redis依赖
npm install @svtslv/nestjs-ioredis --save

定时任务依赖
npm install --save @nestjs/schedule
npm install --save-dev @types/cron

安装swagger
npm install @nestjs/swagger swagger-ui-express -S

安装拦截器 过滤器依赖
nest g interceptor core/interceptor/transform
nest g filter core/filter/http-exception

安装测试依赖个工具
$ npm i --save-dev @nestjs/testing
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## swagger 
[**http://localhost:3000/docs**
]()


## Thank you for view
