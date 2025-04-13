# 吃掉那只青蛙 (Eat That Frog)

一个简单的每日重要任务规划应用，基于 Brian Tracy 的"吃掉那只青蛙"理念。

## 项目简介

这个应用帮助用户专注于每天最重要的一件事，提高工作效率和生活质量。基于 Brian Tracy 的"吃掉那只青蛙"理念，即每天早上先完成最困难但最重要的任务。

## 功能特点

- 设置每日重要任务
- 查看当前重要任务
- 标记任务完成
- 查看历史任务记录

## 技术栈

### 前端
- React.js
- HTML5, CSS3, JavaScript
- Axios

### 后端
- Python
- Flask
- SQLite
- Flask-SQLAlchemy

## 开始使用

### 前提条件

- Node.js
- Python 3
- pip3

### 安装和运行

1. 克隆项目

```bash
git clone <项目地址>
cd EatThatFrog
```

2. 运行后端

```bash
cd backend
pip3 install -r requirements.txt
python3 app.py
```

3. 运行前端

```bash
cd frontend
npm install
npm start
```

4. 打开浏览器访问 http://localhost:3000

## 项目结构

```
EatThatFrog/
├── backend/            # 后端代码
│   ├── app.py         # Flask 应用主文件
│   └── requirements.txt # 依赖包列表
├── frontend/           # 前端代码
│   ├── public/        # 公共文件
│   └── src/           # 源代码
│       ├── components/  # React 组件
│       ├── App.js        # 主应用组件
│       └── index.js      # 入口文件
├── prd.md               # 产品需求文档
└── README.md            # 项目说明
```

## 使用方法

1. 在主页面设置你今天最重要的任务
2. 完成任务后点击"完成任务"按钮
3. 在历史页面查看过去的任务记录

## 开发者

如果你想要贡献代码，请遵循以下步骤：

1. Fork 这个项目
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 版权

MIT License
