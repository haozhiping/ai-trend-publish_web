## 📋 项目概述

本项目基于 ai-trend-publish 二次开发
原版项目：https://github.com/OpenAISpace/ai-trend-publish

### 🎯 核心功能

- **智能工作流管理** - 自动化内容抓取、排序、发布流程
- **多源数据整合** - 支持 Twitter、GitHub、技术博客等多种数据源
- **AI 内容分析** - 基于大语言模型的内容质量评估和排序
- **多平台发布** - 支持微信公众号等多个发布平台
- **实时监控** - 系统状态、API 额度、发布效果实时监控
- **智能通知** - 多级别通知系统，及时推送重要信息

### 🛠 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 组件库**: Ant Design 5.x + Ant Design Pro Components
- **路由**: React Router 6
- **状态管理**: React Hooks
- **样式**: Less + CSS Variables
- **图表**: Recharts
- **代码编辑器**: Monaco Editor
- **HTTP 客户端**: Axios
- **日期处理**: Day.js

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
src/
├── components/          # 通用组件
│   ├── Login.tsx           # 登录组件
│   ├── UserProfile.tsx     # 用户设置
│   ├── GlobalSearch.tsx    # 全局搜索
│   ├── ThemeSelector.tsx   # 主题选择器
│   └── NotificationCenter.tsx # 通知中心
├── pages/              # 页面组件
│   ├── Dashboard.tsx       # 工作台
│   ├── WorkflowManagement.tsx # 工作流管理
│   ├── ContentManagement.tsx  # 内容管理
│   ├── TemplateManagement.tsx # 模板管理
│   ├── DataSources.tsx     # 数据源管理
│   ├── PublishHistory.tsx  # 发布历史
│   ├── ConfigManagement.tsx # 系统配置
│   ├── SystemLogs.tsx      # 系统日志
│   └── AnnouncementManagement.tsx # 通知公告
├── styles/             # 样式文件
│   ├── global.less         # 全局样式
│   ├── components.less     # 组件样式
│   ├── layout.less         # 布局样式
│   └── variables.less      # 样式变量
├── utils/              # 工具函数
│   └── theme.ts           # 主题配置
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── index.less          # 样式入口
```

## 🗺 路由系统

### 路由配置

| 路径 | 组件 | 功能描述 | 权限要求 |
|------|------|----------|----------|
| `/` | Dashboard | 工作台首页 | 已登录 |
| `/workflows` | WorkflowManagement | 工作流管理 | 已登录 |
| `/content` | ContentManagement | 内容库管理 | 已登录 |
| `/templates` | TemplateManagement | 模板管理 | 已登录 |
| `/data-sources` | DataSources | 数据源管理 | 已登录 |
| `/publish-history` | PublishHistory | 发布历史 | 已登录 |
| `/config` | ConfigManagement | 系统配置 | 管理员 |
| `/logs` | SystemLogs | 系统日志 | 管理员 |
| `/announcements` | AnnouncementManagement | 通知公告 | 管理员 |

### 路由守卫

- **认证守卫**: 所有路由都需要用户登录
- **权限守卫**: 部分管理功能需要管理员权限
- **自动重定向**: 未登录用户自动跳转到登录页

## 🎨 主题系统

### 预设主题

- **默认蓝** (#1677ff) - 经典蓝色主题
- **薄荷绿** (#00b96b) - 清新绿色主题  
- **酱紫** (#722ed1) - 优雅紫色主题
- **日暮** (#fa8c16) - 温暖橙色主题
- **火红** (#f5222d) - 热情红色主题
- **明青** (#13c2c2) - 清澈青色主题

### 暗色模式

- 支持亮色/暗色模式切换
- 平滑的主题切换动画
- 自动保存用户偏好设置

## 🔐 认证系统

### 登录方式

- **账号密码登录** - 用户名/邮箱 + 密码
- **手机号登录** - 手机号 + 验证码
- **第三方登录** - 支持多种社交账号登录

### 演示账号

```
用户名: admin
密码: admin123
```

### 权限级别

- **管理员** (admin) - 完整系统权限
- **普通用户** (user) - 基础功能权限

## 📊 功能模块详解

### 1. 工作台 (Dashboard)

**功能概述**: 系统总览和核心指标展示

**主要组件**:
- 核心指标卡片 (总发布文章、今日发布、成功率、总阅读量)
- 发布趋势图表 (支持面积图、折线图、柱状图)
- 发布平台分布饼图
- 最近活动时间线
- API 额度监控
- 系统资源监控
- 工作流状态监控
- 系统健康度评估

**数据展示**:
- 实时更新的系统状态
- 可视化图表展示趋势
- 交互式数据筛选

### 2. 工作流管理 (WorkflowManagement)

**功能概述**: 自动化工作流的创建、配置和管理

**支持的工作流类型**:
- **微信文章工作流** - 每日AI资讯自动发布
- **AI模型排行榜** - 定期更新模型性能排行
- **GitHub热门项目** - 热门AI项目推荐

**核心功能**:
- 工作流创建和编辑
- 定时任务配置 (Cron 表达式)
- 工作流启动/停止控制
- 立即执行功能
- 执行历史查看

### 3. 内容管理 (ContentManagement)

**功能概述**: 抓取内容的查看、编辑和管理

**内容来源**:
- Twitter/X 平台
- FireCrawl 网页抓取
- HelloGitHub 项目
- 自定义数据源

**管理功能**:
- 内容预览和编辑
- 质量评分查看
- 关键词标签管理
- 发布状态跟踪
- 批量操作支持

### 4. 模板管理 (TemplateManagement)

**功能概述**: 发布内容的模板设计和管理

**模板类型**:
- **文章模板** - 通用文章发布模板
- **AI排行榜模板** - 排行榜展示模板
- **GitHub项目模板** - 项目推荐模板

**编辑功能**:
- 可视化模板预览
- HTML/CSS 代码编辑
- 模板复制和导入
- 默认模板设置

### 5. 数据源管理 (DataSources)

**功能概述**: 外部数据源的配置和监控

**支持的数据源**:
- **FireCrawl** - 网页内容抓取
- **Twitter API** - 社交媒体数据
- **自定义API** - 第三方数据接口

**管理功能**:
- 数据源添加和配置
- 连接状态测试
- 同步频率设置
- 数据质量监控

### 6. 发布历史 (PublishHistory)

**功能概述**: 历史发布记录的查看和分析

**记录信息**:
- 发布时间和平台
- 内容标题和摘要
- 发布状态和结果
- 阅读量和互动数据
- 错误信息和重试记录

**分析功能**:
- 发布成功率统计
- 平台表现对比
- 时间趋势分析
- 失败原因分析

### 7. 系统配置 (ConfigManagement)

**功能概述**: 系统参数和第三方服务配置

**配置分类**:
- **LLM配置** - OpenAI、DeepSeek、通义千问等
- **模块配置** - 各功能模块参数设置
- **微信配置** - 公众号接口配置
- **数据源配置** - API密钥和参数
- **数据库配置** - 数据库连接设置
- **通知配置** - 消息推送设置

### 8. 系统日志 (SystemLogs)

**功能概述**: 系统运行日志的查看和分析

**日志级别**:
- **Debug** - 调试信息
- **Info** - 一般信息
- **Warning** - 警告信息
- **Error** - 错误信息

**功能特性**:
- 实时日志流
- 多维度筛选
- 关键词搜索
- 日志导出
- 自动刷新

### 9. 通知公告 (AnnouncementManagement)

**功能概述**: 系统通知和公告的发布管理

**通知类型**:
- **信息** - 一般信息通知
- **成功** - 成功状态通知
- **警告** - 警告信息
- **错误** - 错误和故障通知

**管理功能**:
- 通知创建和编辑
- 目标用户设置
- 优先级配置
- 置顶和定时发布
- 阅读状态统计

## 🔌 后端接口对接文档

### API 基础信息

**Base URL**: `http://localhost:8080/api`

**认证方式**: Bearer Token

**请求头设置**:
```javascript
{
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
```

### 认证接口

#### 1. 用户登录

```http
POST /auth/login
```

**请求参数**:
```json
{
  "username": "admin",
  "password": "admin123",
  "loginType": "account" // account | mobile
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "username": "admin",
      "email": "admin@example.com",
      "name": "系统管理员",
      "role": "admin",
      "avatar": null,
      "permissions": ["*"]
    }
  }
}
```

#### 2. 获取用户信息

```http
GET /auth/user
```

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "id": "1",
    "username": "admin",
    "email": "admin@example.com",
    "name": "系统管理员",
    "role": "admin",
    "avatar": null,
    "permissions": ["*"]
  }
}
```

#### 3. 用户登出

```http
POST /auth/logout
```

### 工作台接口

#### 1. 获取系统概览数据

```http
GET /dashboard/overview
```

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "metrics": {
      "totalArticles": 1247,
      "todayPublished": 12,
      "successRate": 98.5,
      "totalViews": 45678
    },
    "systemStatus": {
      "status": "running",
      "uptime": "2天 14小时 32分钟",
      "version": "v1.2.3"
    },
    "chartData": [
      {
        "date": "2024-01-15",
        "articles": 12,
        "views": 2400,
        "success": 11
      }
    ]
  }
}
```

#### 2. 获取最近活动

```http
GET /dashboard/activities?limit=10
```

**响应数据**:
```json
{
  "code": 200,
  "data": [
    {
      "id": "1",
      "time": "2024-01-15 14:30:25",
      "title": "微信文章工作流执行完成",
      "description": "成功发布 8 篇文章到微信公众号",
      "status": "success",
      "user": "System",
      "module": "WeixinWorkflow"
    }
  ]
}
```

### 工作流管理接口

#### 1. 获取工作流列表

```http
GET /workflows
```

**响应数据**:
```json
{
  "code": 200,
  "data": [
    {
      "id": "1",
      "name": "微信文章工作流",
      "type": "WeixinWorkflow",
      "status": "running",
      "schedule": "0 3 * * *",
      "lastRun": "2024-01-15 03:00:00",
      "nextRun": "2024-01-16 03:00:00",
      "description": "每日凌晨3点自动抓取AI相关内容并发布到微信公众号"
    }
  ]
}
```

#### 2. 创建工作流

```http
POST /workflows
```

**请求参数**:
```json
{
  "name": "新工作流",
  "type": "WeixinWorkflow",
  "schedule": "0 3 * * *",
  "description": "工作流描述",
  "config": {
    "articleNum": 10,
    "templateType": "default"
  }
}
```

#### 3. 更新工作流

```http
PUT /workflows/{id}
```

#### 4. 删除工作流

```http
DELETE /workflows/{id}
```

#### 5. 启动/停止工作流

```http
POST /workflows/{id}/start
POST /workflows/{id}/stop
```

#### 6. 立即执行工作流

```http
POST /workflows/{id}/execute
```

### 内容管理接口

#### 1. 获取内容列表

```http
GET /content?page=1&size=10&source=twitter&status=published
```

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "1",
        "title": "DeepSeek-R1 登顶AI模型排行榜",
        "content": "DeepSeek-R1在最新的AI模型评测中表现出色...",
        "url": "https://example.com/deepseek-r1",
        "source": "twitter",
        "platform": "weixin",
        "publishDate": "2024-01-15 14:30:00",
        "score": 95.5,
        "status": "published",
        "keywords": ["AI", "DeepSeek", "排行榜"]
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10
  }
}
```

#### 2. 获取内容详情

```http
GET /content/{id}
```

#### 3. 更新内容

```http
PUT /content/{id}
```

#### 4. 删除内容

```http
DELETE /content/{id}
```

#### 5. 批量删除内容

```http
DELETE /content/batch
```

**请求参数**:
```json
{
  "ids": ["1", "2", "3"]
}
```

### 模板管理接口

#### 1. 获取模板列表

```http
GET /templates?type=article
```

**响应数据**:
```json
{
  "code": 200,
  "data": [
    {
      "id": "1",
      "name": "默认文章模板",
      "type": "article",
      "description": "简洁大方的文章模板，适合各类内容",
      "preview": "https://example.com/preview.png",
      "content": "<div>模板内容...</div>",
      "isDefault": true
    }
  ]
}
```

#### 2. 创建模板

```http
POST /templates
```

#### 3. 更新模板

```http
PUT /templates/{id}
```

#### 4. 删除模板

```http
DELETE /templates/{id}
```

#### 5. 设置默认模板

```http
POST /templates/{id}/set-default
```

### 数据源管理接口

#### 1. 获取数据源列表

```http
GET /data-sources
```

**响应数据**:
```json
{
  "code": 200,
  "data": [
    {
      "id": "1",
      "name": "Hacker News",
      "type": "firecrawl",
      "url": "https://news.ycombinator.com/",
      "enabled": true,
      "lastSync": "2024-01-15 14:30:00",
      "status": "active",
      "description": "技术新闻和讨论"
    }
  ]
}
```

#### 2. 创建数据源

```http
POST /data-sources
```

#### 3. 更新数据源

```http
PUT /data-sources/{id}
```

#### 4. 删除数据源

```http
DELETE /data-sources/{id}
```

#### 5. 测试数据源连接

```http
POST /data-sources/{id}/test
```

#### 6. 立即同步数据源

```http
POST /data-sources/{id}/sync
```

### 发布历史接口

#### 1. 获取发布记录

```http
GET /publish-history?page=1&size=10&platform=weixin&status=published
```

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "1",
        "title": "2024-01-15 AI速递 | DeepSeek-R1登顶排行榜",
        "platform": "weixin",
        "status": "published",
        "publishTime": "2024-01-15 14:30:00",
        "url": "https://mp.weixin.qq.com/s/example1",
        "articleCount": 8,
        "successCount": 8,
        "workflow": "WeixinWorkflow"
      }
    ],
    "total": 50,
    "page": 1,
    "size": 10
  }
}
```

#### 2. 获取发布详情

```http
GET /publish-history/{id}
```

#### 3. 重试发布

```http
POST /publish-history/{id}/retry
```

### 系统配置接口

#### 1. 获取配置

```http
GET /config
```

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "llm": {
      "DEFAULT_LLM_PROVIDER": "DEEPSEEK",
      "OPENAI_BASE_URL": "https://api.openai.com/v1",
      "DEEPSEEK_BASE_URL": "https://api.deepseek.com/v1"
    },
    "modules": {
      "ARTICLE_NUM": 10,
      "ARTICLE_TEMPLATE_TYPE": "default"
    },
    "weixin": {
      "AUTHOR": "AI助手",
      "NEED_OPEN_COMMENT": false
    }
  }
}
```

#### 2. 更新配置

```http
PUT /config
```

**请求参数**:
```json
{
  "DEFAULT_LLM_PROVIDER": "DEEPSEEK",
  "ARTICLE_NUM": 15,
  "OPENAI_API_KEY": "sk-..."
}
```

### 系统日志接口

#### 1. 获取日志

```http
GET /logs?page=1&size=50&level=info&module=WeixinWorkflow&search=关键词
```

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "1",
        "timestamp": "2024-01-15 14:30:25",
        "level": "info",
        "module": "WeixinWorkflow",
        "message": "工作流执行完成，成功发布 8 篇文章",
        "details": {
          "articleCount": 8,
          "successCount": 8
        }
      }
    ],
    "total": 1000,
    "page": 1,
    "size": 50
  }
}
```

#### 2. 清空日志

```http
DELETE /logs
```

### 通知公告接口

#### 1. 获取公告列表

```http
GET /announcements?page=1&size=10&type=warning&status=published
```

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "1",
        "title": "系统维护通知",
        "content": "系统将于今晚23:00-01:00进行维护升级",
        "type": "warning",
        "priority": "high",
        "status": "published",
        "targetUsers": "all",
        "publishTime": "2024-01-15 10:00:00",
        "expireTime": "2024-01-16 01:00:00",
        "creator": "系统管理员",
        "readCount": 156,
        "isSticky": true
      }
    ],
    "total": 20,
    "page": 1,
    "size": 10
  }
}
```

#### 2. 创建公告

```http
POST /announcements
```

#### 3. 更新公告

```http
PUT /announcements/{id}
```

#### 4. 删除公告

```http
DELETE /announcements/{id}
```

#### 5. 发布公告

```http
POST /announcements/{id}/publish
```

#### 6. 获取用户通知

```http
GET /notifications?page=1&size=20&isRead=false
```

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "1",
        "title": "微信工作流执行完成",
        "content": "成功发布 8 篇文章到微信公众号",
        "type": "workflow",
        "priority": "medium",
        "isRead": false,
        "time": "2024-01-15 14:30:25",
        "source": "WeixinWorkflow",
        "actionUrl": "/publish-history"
      }
    ],
    "total": 10,
    "unreadCount": 3
  }
}
```

#### 7. 标记通知为已读

```http
PUT /notifications/{id}/read
```

#### 8. 批量标记已读

```http
PUT /notifications/read-all
```

### 文件上传接口

#### 1. 上传头像

```http
POST /upload/avatar
Content-Type: multipart/form-data
```

#### 2. 上传模板预览图

```http
POST /upload/template-preview
Content-Type: multipart/form-data
```

### 统计分析接口

#### 1. 获取发布趋势数据

```http
GET /analytics/publish-trend?period=7d
```

#### 2. 获取平台分布数据

```http
GET /analytics/platform-distribution
```

#### 3. 获取API使用统计

```http
GET /analytics/api-usage
```

## 🔧 错误处理

### 统一错误响应格式

```json
{
  "code": 400,
  "message": "请求参数错误",
  "data": null,
  "timestamp": "2024-01-15T14:30:25.000Z",
  "path": "/api/workflows"
}
```

### 常见错误码

| 错误码 | 说明 | 处理方式 |
|--------|------|----------|
| 200 | 成功 | 正常处理 |
| 400 | 请求参数错误 | 检查请求参数 |
| 401 | 未授权 | 重新登录 |
| 403 | 权限不足 | 提示权限不足 |
| 404 | 资源不存在 | 提示资源不存在 |
| 500 | 服务器内部错误 | 提示系统错误 |

### 前端错误处理

```typescript
// axios 拦截器示例
axios.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const { status, data } = error.response
    
    switch (status) {
      case 401:
        // 清除token，跳转登录页
        localStorage.removeItem('token')
        window.location.href = '/login'
        break
      case 403:
        message.error('权限不足')
        break
      case 500:
        message.error('系统错误，请稍后重试')
        break
      default:
        message.error(data?.message || '请求失败')
    }
    
    return Promise.reject(error)
  }
)
```

## 📝 开发规范

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 配置
- 组件使用 PascalCase 命名
- 文件使用 camelCase 命名
- 常量使用 UPPER_SNAKE_CASE

### 组件开发规范

```typescript
// 组件示例
interface ComponentProps {
  title: string
  onSubmit: (data: any) => void
}

const Component: React.FC<ComponentProps> = ({ title, onSubmit }) => {
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      await onSubmit(values)
      message.success('操作成功')
    } catch (error) {
      message.error('操作失败')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Card title={title}>
      {/* 组件内容 */}
    </Card>
  )
}

export default Component
```

### API 调用规范

```typescript
// API 服务示例
class WorkflowService {
  static async getList(params?: any) {
    return request.get('/workflows', { params })
  }
  
  static async create(data: any) {
    return request.post('/workflows', data)
  }
  
  static async update(id: string, data: any) {
    return request.put(`/workflows/${id}`, data)
  }
  
  static async delete(id: string) {
    return request.delete(`/workflows/${id}`)
  }
}
```

## 🚀 部署指南

### 环境变量配置

创建 `.env.production` 文件：

```env
VITE_API_BASE_URL=https://api.iqpublish.cn
VITE_APP_TITLE=IQPublish 管理系统
VITE_APP_VERSION=1.0.0
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 部署到服务器
# 将 dist 目录上传到 Web 服务器
```

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/iqpublish;
    index index.html;
    
    # 前端路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API 代理
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🤝 贡献指南

### 开发流程

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 提交规范

使用 Conventional Commits 规范：

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
