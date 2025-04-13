# 吃掉那只青蛙应用部署指南

本文档提供了将“吃掉那只青蛙”应用部署到云端的详细步骤，包括 API 部署和前端部署。

## 准备工作

在开始部署之前，请确保您已经：

1. 在 GitHub 上创建了仓库并上传了代码
2. 创建了 Render 和 Netlify 账号
3. 已经完成了必要的代码修改（如更新依赖等）

## 部署 API （Render）

### 1. 初始化 GitHub 仓库

```bash
cd /Users/longhai/Code/all-in-agi/EatThatFrog
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/longhaiqwe/eat-that-frog.git
git push -u origin main
```

### 2. 在 Render 上部署 API

1. 登录 [Render](https://render.com/) 账号
2. 点击“New +”按钮，选择“Web Service”
3. 连接您的 GitHub 仓库
4. 填写以下信息：
   - 名称：eat-that-frog-api
   - 根目录：backend
   - 运行时：Python 3
   - 构建命令：pip install -r requirements.txt
   - 启动命令：gunicorn app:app
5. 配置环境变量（可选）：
   - 如果使用了数据库，请添加 DATABASE_URL 环境变量
6. 点击“Create Web Service”

### 3. 配置数据库（可选）

1. 在 Render 上创建 PostgreSQL 数据库：
   - 点击“New +”按钮，选择“PostgreSQL”
   - 输入名称：eat-that-frog-db
   - 选择合适的计划（免费版或付费版）
   - 点击“Create Database”

2. 将数据库连接 URL 添加到您的 Web Service 环境变量：
   - 进入您的 Web Service 设置
   - 点击“Environment”选项卡
   - 添加 DATABASE_URL 环境变量，值为数据库连接 URL

## 部署前端（Netlify）

### 1. 构建前端项目

在前端项目目录下运行以下命令：

```bash
cd /Users/longhai/Code/all-in-agi/EatThatFrog/frontend
npm run build
```

### 2. 在 Netlify 上部署前端

1. 登录 [Netlify](https://www.netlify.com/) 账号
2. 点击“New site from Git”
3. 连接您的 GitHub 仓库
4. 填写以下信息：
   - 基础目录：frontend
   - 构建命令：npm run build
   - 发布目录：frontend/build
5. 配置环境变量：
   - 添加 REACT_APP_API_URL 环境变量，值为您的 Render API URL（如 https://eat-that-frog-api.onrender.com）
6. 点击“Deploy site”

## 部署后的配置

### 1. 自定义域名（可选）

如果您有自定义域名，可以在 Netlify 上配置：

1. 进入您的 Netlify 网站设置
2. 点击“Domain settings”
3. 点击“Add custom domain”
4. 按照提示完成 DNS 配置

### 2. HTTPS 配置

Netlify 和 Render 都支持 HTTPS 配置。

## 测试部署

部署完成后，请访问您的 Netlify URL 测试应用。

注意事项：

1. 免费版 Render 的负载均衡可能在一段时间后进入休眠状态，请多次刷新页面以确保应用正常运行
2. 如果使用了免费版 Render PostgreSQL 数据库，请注意数据库在 90 天后会过期，需要更新数据库
3. 对于高流量应用，请考虑使用付费版 Render 或升级您的部署选项

## 更新应用

当您需要更新应用时：

1. 将更新推送到 GitHub 仓库
2. Netlify 和 Render 会自动检测更新并重新部署应用

如果您需要强制部署：

1. 在 Netlify 上，进入您的网站设置，点击“Deploys”选项卡，点击“Trigger deploy”
2. 在 Render 上，进入您的 Web Service 设置，点击“Manual Deploy”按钮，选择“Deploy latest commit”

本部署指南的其余部分将介绍如何解决常见问题。
