# TrendPublish API 接口文档

## 📋 接口概览

本文档详细描述了 TrendPublish 前端项目与后端服务的接口规范，包括请求格式、响应格式、错误处理等。

## 🔗 基础信息

- **Base URL**: `http://localhost:8080/api`
- **协议**: HTTP/HTTPS
- **数据格式**: JSON
- **字符编码**: UTF-8
- **认证方式**: Bearer Token

## 🔐 认证机制

### Token 获取

通过登录接口获取 JWT Token：

```http
POST /auth/login
```

### Token 使用

在请求头中携带 Token：

```http
Authorization: Bearer <your-jwt-token>
```

### Token 刷新

```http
POST /auth/refresh
```

## 📊 统一响应格式

### 成功响应

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    // 具体数据
  },
  "timestamp": "2024-01-15T14:30:25.000Z"
}
```

### 错误响应

```json
{
  "code": 400,
  "message": "请求参数错误",
  "data": null,
  "timestamp": "2024-01-15T14:30:25.000Z",
  "path": "/api/workflows",
  "errors": [
    {
      "field": "name",
      "message": "工作流名称不能为空"
    }
  ]
}
```

### 分页响应

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      // 数据列表
    ],
    "total": 100,
    "page": 1,
    "size": 10,
    "pages": 10
  }
}
```

## 🔑 认证接口

### 1. 用户登录

**接口地址**: `POST /auth/login`

**请求参数**:
```json
{
  "username": "admin",           // 用户名/邮箱
  "password": "admin123",        // 密码
  "loginType": "account",        // 登录类型: account | mobile
  "mobile": "13800138000",       // 手机号(手机登录时)
  "captcha": "1234",            // 验证码(手机登录时)
  "rememberMe": true            // 记住登录状态
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200,
    "user": {
      "id": "1",
      "username": "admin",
      "email": "admin@example.com",
      "name": "系统管理员",
      "role": "admin",
      "avatar": "https://example.com/avatar.jpg",
      "permissions": ["*"],
      "lastLoginTime": "2024-01-15T14:30:25.000Z",
      "loginCount": 156
    }
  }
}
```

### 2. 获取验证码

**接口地址**: `POST /auth/captcha`

**请求参数**:
```json
{
  "mobile": "13800138000",
  "type": "login"  // login | register | reset
}
```

### 3. 获取当前用户信息

**接口地址**: `GET /auth/user`

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
    "avatar": "https://example.com/avatar.jpg",
    "permissions": ["*"],
    "profile": {
      "phone": "13800138000",
      "department": "技术部",
      "position": "系统管理员",
      "joinDate": "2023-01-01"
    },
    "settings": {
      "theme": "default",
      "darkMode": false,
      "language": "zh-CN",
      "notifications": {
        "email": true,
        "workflow": true,
        "system": true
      }
    }
  }
}
```

### 4. 更新用户信息

**接口地址**: `PUT /auth/user`

**请求参数**:
```json
{
  "name": "新名称",
  "email": "new@example.com",
  "phone": "13800138001",
  "avatar": "https://example.com/new-avatar.jpg",
  "profile": {
    "department": "产品部",
    "position": "产品经理"
  }
}
```

### 5. 修改密码

**接口地址**: `PUT /auth/password`

**请求参数**:
```json
{
  "currentPassword": "old123",
  "newPassword": "new123",
  "confirmPassword": "new123"
}
```

### 6. 用户登出

**接口地址**: `POST /auth/logout`

## 📊 工作台接口

### 1. 获取系统概览

**接口地址**: `GET /dashboard/overview`

**查询参数**:
- `period`: 时间周期 (7d | 30d | 90d)

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "metrics": {
      "totalArticles": 1247,
      "todayPublished": 12,
      "successRate": 98.5,
      "totalViews": 45678,
      "activeWorkflows": 3,
      "avgResponseTime": 1.2
    },
    "systemStatus": {
      "status": "running",
      "uptime": "2天 14小时 32分钟",
      "version": "v1.2.3",
      "lastUpdate": "2024-01-15T14:30:25.000Z",
      "health": {
        "cpu": 45,
        "memory": 68,
        "disk": 32,
        "score": 90
      }
    },
    "chartData": [
      {
        "date": "2024-01-15",
        "articles": 12,
        "views": 2400,
        "success": 11,
        "users": 89
      }
    ],
    "platformDistribution": [
      {
        "platform": "weixin",
        "count": 65,
        "percentage": 65
      }
    ]
  }
}
```

### 2. 获取最近活动

**接口地址**: `GET /dashboard/activities`

**查询参数**:
- `limit`: 限制数量 (默认 10)
- `type`: 活动类型 (workflow | system | api | user)
- `status`: 状态 (success | warning | error)

**响应数据**:
```json
{
  "code": 200,
  "data": [
    {
      "id": "1",
      "time": "2024-01-15T14:30:25.000Z",
      "title": "微信文章工作流执行完成",
      "description": "成功发布 8 篇文章到微信公众号",
      "type": "workflow",
      "status": "success",
      "user": "System",
      "module": "WeixinWorkflow",
      "duration": "2.5分钟",
      "details": {
        "articleCount": 8,
        "successCount": 8,
        "platform": "weixin"
      }
    }
  ]
}
```

### 3. 获取API使用统计

**接口地址**: `GET /dashboard/api-usage`

**响应数据**:
```json
{
  "code": 200,
  "data": [
    {
      "name": "DeepSeek API",
      "provider": "deepseek",
      "used": 75,
      "total": 100,
      "unit": "美元",
      "resetDate": "2024-02-01",
      "cost": 45.60,
      "requestCount": 15420,
      "status": "normal"
    }
  ]
}
```

## 🔄 工作流管理接口

### 1. 获取工作流列表

**接口地址**: `GET /workflows`

**查询参数**:
- `page`: 页码 (默认 1)
- `size`: 每页数量 (默认 10)
- `type`: 工作流类型
- `status`: 状态 (running | stopped | error)
- `search`: 搜索关键词

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "1",
        "name": "微信文章工作流",
        "type": "WeixinWorkflow",
        "status": "running",
        "schedule": "0 3 * * *",
        "lastRun": "2024-01-15T03:00:00.000Z",
        "nextRun": "2024-01-16T03:00:00.000Z",
        "description": "每日凌晨3点自动抓取AI相关内容并发布到微信公众号",
        "config": {
          "articleNum": 10,
          "templateType": "default",
          "sources": ["twitter", "github"]
        },
        "statistics": {
          "totalRuns": 156,
          "successRuns": 152,
          "failedRuns": 4,
          "avgDuration": "3.2分钟"
        },
        "creator": "admin",
        "createTime": "2023-12-01T10:00:00.000Z",
        "updateTime": "2024-01-15T14:30:25.000Z"
      }
    ],
    "total": 3,
    "page": 1,
    "size": 10
  }
}
```

### 2. 获取工作流详情

**接口地址**: `GET /workflows/{id}`

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "id": "1",
    "name": "微信文章工作流",
    "type": "WeixinWorkflow",
    "status": "running",
    "schedule": "0 3 * * *",
    "description": "每日凌晨3点自动抓取AI相关内容并发布到微信公众号",
    "config": {
      "articleNum": 10,
      "templateType": "default",
      "sources": ["twitter", "github"],
      "filters": {
        "minScore": 80,
        "keywords": ["AI", "机器学习"]
      }
    },
    "executionHistory": [
      {
        "id": "exec_1",
        "startTime": "2024-01-15T03:00:00.000Z",
        "endTime": "2024-01-15T03:03:25.000Z",
        "status": "success",
        "result": {
          "articlesProcessed": 15,
          "articlesPublished": 8,
          "errors": []
        }
      }
    ]
  }
}
```

### 3. 创建工作流

**接口地址**: `POST /workflows`

**请求参数**:
```json
{
  "name": "新工作流",
  "type": "WeixinWorkflow",
  "schedule": "0 3 * * *",
  "description": "工作流描述",
  "config": {
    "articleNum": 10,
    "templateType": "default",
    "sources": ["twitter"],
    "filters": {
      "minScore": 80
    }
  }
}
```

### 4. 更新工作流

**接口地址**: `PUT /workflows/{id}`

### 5. 删除工作流

**接口地址**: `DELETE /workflows/{id}`

### 6. 启动工作流

**接口地址**: `POST /workflows/{id}/start`

### 7. 停止工作流

**接口地址**: `POST /workflows/{id}/stop`

### 8. 立即执行工作流

**接口地址**: `POST /workflows/{id}/execute`

**请求参数**:
```json
{
  "params": {
    "articleNum": 5,
    "testMode": true
  }
}
```

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "executionId": "exec_123",
    "status": "running",
    "startTime": "2024-01-15T14:30:25.000Z"
  }
}
```

### 9. 获取工作流执行状态

**接口地址**: `GET /workflows/{id}/executions/{executionId}`

## 📝 内容管理接口

### 1. 获取内容列表

**接口地址**: `GET /content`

**查询参数**:
- `page`: 页码
- `size`: 每页数量
- `source`: 来源 (twitter | firecrawl | github)
- `status`: 状态 (published | draft | failed)
- `platform`: 发布平台 (weixin)
- `search`: 搜索关键词
- `startDate`: 开始日期
- `endDate`: 结束日期
- `minScore`: 最低评分
- `maxScore`: 最高评分

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
        "summary": "DeepSeek-R1模型在多项评测中取得突破性成绩",
        "url": "https://example.com/deepseek-r1",
        "source": "twitter",
        "platform": "weixin",
        "publishDate": "2024-01-15T14:30:00.000Z",
        "score": 95.5,
        "status": "published",
        "keywords": ["AI", "DeepSeek", "排行榜"],
        "media": [
          {
            "type": "image",
            "url": "https://example.com/image.jpg",
            "description": "模型性能对比图"
          }
        ],
        "metrics": {
          "views": 1520,
          "likes": 89,
          "shares": 23,
          "comments": 12
        },
        "creator": "System",
        "createTime": "2024-01-15T14:25:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10
  }
}
```

### 2. 获取内容详情

**接口地址**: `GET /content/{id}`

### 3. 更新内容

**接口地址**: `PUT /content/{id}`

**请求参数**:
```json
{
  "title": "更新后的标题",
  "content": "更新后的内容",
  "keywords": ["AI", "更新"],
  "status": "published"
}
```

### 4. 删除内容

**接口地址**: `DELETE /content/{id}`

### 5. 批量操作内容

**接口地址**: `POST /content/batch`

**请求参数**:
```json
{
  "action": "delete",  // delete | publish | archive
  "ids": ["1", "2", "3"],
  "params": {
    "platform": "weixin"
  }
}
```

### 6. 内容预览

**接口地址**: `POST /content/{id}/preview`

**请求参数**:
```json
{
  "templateId": "template_1",
  "platform": "weixin"
}
```

## 🎨 模板管理接口

### 1. 获取模板列表

**接口地址**: `GET /templates`

**查询参数**:
- `type`: 模板类型 (article | aibench | hellogithub)
- `page`: 页码
- `size`: 每页数量

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "1",
        "name": "默认文章模板",
        "type": "article",
        "description": "简洁大方的文章模板，适合各类内容",
        "preview": "https://example.com/preview.png",
        "content": "<div class=\"article\">{{title}}</div>",
        "variables": [
          {
            "name": "title",
            "type": "string",
            "description": "文章标题",
            "required": true
          },
          {
            "name": "content",
            "type": "html",
            "description": "文章内容",
            "required": true
          }
        ],
        "isDefault": true,
        "usage": 156,
        "creator": "admin",
        "createTime": "2023-12-01T10:00:00.000Z",
        "updateTime": "2024-01-15T14:30:25.000Z"
      }
    ],
    "total": 5,
    "page": 1,
    "size": 10
  }
}
```

### 2. 获取模板详情

**接口地址**: `GET /templates/{id}`

### 3. 创建模板

**接口地址**: `POST /templates`

**请求参数**:
```json
{
  "name": "新模板",
  "type": "article",
  "description": "模板描述",
  "content": "<div>{{title}}</div>",
  "preview": "https://example.com/preview.png",
  "variables": [
    {
      "name": "title",
      "type": "string",
      "description": "标题",
      "required": true
    }
  ]
}
```

### 4. 更新模板

**接口地址**: `PUT /templates/{id}`

### 5. 删除模板

**接口地址**: `DELETE /templates/{id}`

### 6. 复制模板

**接口地址**: `POST /templates/{id}/copy`

**请求参数**:
```json
{
  "name": "复制的模板名称"
}
```

### 7. 设置默认模板

**接口地址**: `POST /templates/{id}/set-default`

**请求参数**:
```json
{
  "type": "article"
}
```

### 8. 模板渲染预览

**接口地址**: `POST /templates/{id}/render`

**请求参数**:
```json
{
  "data": {
    "title": "测试标题",
    "content": "测试内容"
  }
}
```

## 🔗 数据源管理接口

### 1. 获取数据源列表

**接口地址**: `GET /data-sources`

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
      "lastSync": "2024-01-15T14:30:00.000Z",
      "status": "active",
      "description": "技术新闻和讨论",
      "config": {
        "crawlDepth": 2,
        "interval": 3600,
        "filters": {
          "keywords": ["AI", "机器学习"]
        }
      },
      "statistics": {
        "totalItems": 1520,
        "successRate": 98.5,
        "avgResponseTime": 1.2
      },
      "creator": "admin",
      "createTime": "2023-12-01T10:00:00.000Z"
    }
  ]
}
```

### 2. 创建数据源

**接口地址**: `POST /data-sources`

**请求参数**:
```json
{
  "name": "新数据源",
  "type": "firecrawl",
  "url": "https://example.com",
  "description": "数据源描述",
  "config": {
    "crawlDepth": 2,
    "interval": 3600
  },
  "enabled": true
}
```

### 3. 更新数据源

**接口地址**: `PUT /data-sources/{id}`

### 4. 删除数据源

**接口地址**: `DELETE /data-sources/{id}`

### 5. 测试数据源连接

**接口地址**: `POST /data-sources/{id}/test`

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "status": "success",
    "responseTime": 1.2,
    "message": "连接测试成功",
    "sampleData": [
      {
        "title": "示例标题",
        "url": "https://example.com/article"
      }
    ]
  }
}
```

### 6. 立即同步数据源

**接口地址**: `POST /data-sources/{id}/sync`

### 7. 获取数据源统计

**接口地址**: `GET /data-sources/{id}/statistics`

## 📊 发布历史接口

### 1. 获取发布记录

**接口地址**: `GET /publish-history`

**查询参数**:
- `page`: 页码
- `size`: 每页数量
- `platform`: 发布平台
- `status`: 发布状态
- `workflow`: 工作流ID
- `startDate`: 开始日期
- `endDate`: 结束日期

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
        "publishTime": "2024-01-15T14:30:00.000Z",
        "url": "https://mp.weixin.qq.com/s/example1",
        "articleCount": 8,
        "successCount": 8,
        "workflow": "WeixinWorkflow",
        "workflowId": "workflow_1",
        "template": "默认文章模板",
        "templateId": "template_1",
        "metrics": {
          "views": 1520,
          "likes": 89,
          "shares": 23,
          "comments": 12
        },
        "error": null,
        "logs": [
          {
            "time": "2024-01-15T14:30:00.000Z",
            "level": "info",
            "message": "开始发布流程"
          }
        ]
      }
    ],
    "total": 50,
    "page": 1,
    "size": 10
  }
}
```

### 2. 获取发布详情

**接口地址**: `GET /publish-history/{id}`

### 3. 重试发布

**接口地址**: `POST /publish-history/{id}/retry`

### 4. 获取发布统计

**接口地址**: `GET /publish-history/statistics`

**查询参数**:
- `period`: 统计周期 (7d | 30d | 90d)
- `platform`: 发布平台

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "summary": {
      "totalPublished": 156,
      "successRate": 98.5,
      "totalViews": 45680,
      "avgViews": 293
    },
    "platformStats": [
      {
        "platform": "weixin",
        "count": 156,
        "successRate": 98.5,
        "views": 45680
      }
    ],
    "trendData": [
      {
        "date": "2024-01-15",
        "published": 8,
        "views": 1520
      }
    ]
  }
}
```

## ⚙️ 系统配置接口

### 1. 获取配置

**接口地址**: `GET /config`

**查询参数**:
- `category`: 配置分类 (llm | modules | weixin | datasource | database | notification)

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "llm": {
      "DEFAULT_LLM_PROVIDER": "DEEPSEEK",
      "OPENAI_BASE_URL": "https://api.openai.com/v1",
      "OPENAI_MODEL": "gpt-3.5-turbo",
      "DEEPSEEK_BASE_URL": "https://api.deepseek.com/v1",
      "DEEPSEEK_MODEL": "deepseek-chat"
    },
    "modules": {
      "AI_CONTENT_RANKER_LLM_PROVIDER": "DEEPSEEK:deepseek-reasoner",
      "AI_SUMMARIZER_LLM_PROVIDER": "QWEN:qwen-max",
      "ARTICLE_TEMPLATE_TYPE": "default",
      "ARTICLE_NUM": 10
    },
    "weixin": {
      "WEIXIN_APP_ID": "wx...",
      "AUTHOR": "AI助手",
      "NEED_OPEN_COMMENT": false,
      "ONLY_FANS_CAN_COMMENT": false
    }
  }
}
```

### 2. 更新配置

**接口地址**: `PUT /config`

**请求参数**:
```json
{
  "DEFAULT_LLM_PROVIDER": "DEEPSEEK",
  "ARTICLE_NUM": 15,
  "OPENAI_API_KEY": "sk-...",
  "DEEPSEEK_API_KEY": "sk-..."
}
```

### 3. 重置配置

**接口地址**: `POST /config/reset`

**请求参数**:
```json
{
  "category": "llm"  // 可选，不传则重置全部
}
```

### 4. 验证配置

**接口地址**: `POST /config/validate`

**请求参数**:
```json
{
  "OPENAI_API_KEY": "sk-...",
  "OPENAI_BASE_URL": "https://api.openai.com/v1"
}
```

## 📋 系统日志接口

### 1. 获取日志

**接口地址**: `GET /logs`

**查询参数**:
- `page`: 页码
- `size`: 每页数量
- `level`: 日志级别 (debug | info | warn | error)
- `module`: 模块名称
- `search`: 搜索关键词
- `startTime`: 开始时间
- `endTime`: 结束时间

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "1",
        "timestamp": "2024-01-15T14:30:25.000Z",
        "level": "info",
        "module": "WeixinWorkflow",
        "message": "工作流执行完成，成功发布 8 篇文章",
        "details": {
          "articleCount": 8,
          "successCount": 8,
          "duration": "2.5分钟"
        },
        "traceId": "trace_123",
        "userId": "user_1",
        "ip": "192.168.1.100"
      }
    ],
    "total": 1000,
    "page": 1,
    "size": 50
  }
}
```

### 2. 清空日志

**接口地址**: `DELETE /logs`

**请求参数**:
```json
{
  "beforeDate": "2024-01-01T00:00:00.000Z",  // 可选，清空指定日期前的日志
  "level": "debug"  // 可选，清空指定级别的日志
}
```

### 3. 导出日志

**接口地址**: `GET /logs/export`

**查询参数**:
- `format`: 导出格式 (json | csv | txt)
- `level`: 日志级别
- `startTime`: 开始时间
- `endTime`: 结束时间

### 4. 获取日志统计

**接口地址**: `GET /logs/statistics`

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "total": 10000,
    "levelStats": {
      "debug": 3000,
      "info": 5000,
      "warn": 1500,
      "error": 500
    },
    "moduleStats": {
      "WeixinWorkflow": 2000,
      "ContentRanker": 1500,
      "FireCrawlScraper": 1000
    },
    "recentErrors": [
      {
        "time": "2024-01-15T14:30:25.000Z",
        "module": "TwitterScraper",
        "message": "API调用失败",
        "count": 3
      }
    ]
  }
}
```

## 📢 通知公告接口

### 1. 获取公告列表

**接口地址**: `GET /announcements`

**查询参数**:
- `page`: 页码
- `size`: 每页数量
- `type`: 公告类型 (info | success | warning | error)
- `status`: 状态 (draft | published | expired)
- `targetUsers`: 目标用户 (all | admin | user)
- `priority`: 优先级 (low | medium | high | urgent)

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "1",
        "title": "系统维护通知",
        "content": "系统将于今晚23:00-01:00进行维护升级，期间可能影响正常使用，请提前做好准备。",
        "type": "warning",
        "priority": "high",
        "status": "published",
        "targetUsers": "all",
        "publishTime": "2024-01-15T10:00:00.000Z",
        "expireTime": "2024-01-16T01:00:00.000Z",
        "creator": "系统管理员",
        "creatorId": "admin",
        "readCount": 156,
        "isSticky": true,
        "createTime": "2024-01-15T09:30:00.000Z",
        "updateTime": "2024-01-15T10:00:00.000Z"
      }
    ],
    "total": 20,
    "page": 1,
    "size": 10
  }
}
```

### 2. 创建公告

**接口地址**: `POST /announcements`

**请求参数**:
```json
{
  "title": "新公告标题",
  "content": "公告内容",
  "type": "info",
  "priority": "medium",
  "targetUsers": "all",
  "publishTime": "2024-01-15T10:00:00.000Z",
  "expireTime": "2024-01-16T10:00:00.000Z",
  "isSticky": false
}
```

### 3. 更新公告

**接口地址**: `PUT /announcements/{id}`

### 4. 删除公告

**接口地址**: `DELETE /announcements/{id}`

### 5. 发布公告

**接口地址**: `POST /announcements/{id}/publish`

### 6. 获取用户通知

**接口地址**: `GET /notifications`

**查询参数**:
- `page`: 页码
- `size`: 每页数量
- `isRead`: 是否已读 (true | false)
- `type`: 通知类型

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
        "time": "2024-01-15T14:30:25.000Z",
        "source": "WeixinWorkflow",
        "actionUrl": "/publish-history",
        "data": {
          "workflowId": "workflow_1",
          "executionId": "exec_123"
        }
      }
    ],
    "total": 10,
    "unreadCount": 3,
    "page": 1,
    "size": 20
  }
}
```

### 7. 标记通知为已读

**接口地址**: `PUT /notifications/{id}/read`

### 8. 批量标记已读

**接口地址**: `PUT /notifications/read-all`

**请求参数**:
```json
{
  "ids": ["1", "2", "3"]  // 可选，不传则标记全部为已读
}
```

### 9. 删除通知

**接口地址**: `DELETE /notifications/{id}`

## 📁 文件上传接口

### 1. 上传头像

**接口地址**: `POST /upload/avatar`

**请求格式**: `multipart/form-data`

**请求参数**:
- `file`: 图片文件 (支持 jpg, png, gif，最大 2MB)

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "url": "https://example.com/avatars/user_1_1642234567.jpg",
    "filename": "user_1_1642234567.jpg",
    "size": 102400,
    "mimeType": "image/jpeg"
  }
}
```

### 2. 上传模板预览图

**接口地址**: `POST /upload/template-preview`

### 3. 上传内容媒体文件

**接口地址**: `POST /upload/media`

### 4. 批量上传

**接口地址**: `POST /upload/batch`

**请求参数**:
- `files`: 文件数组
- `type`: 文件类型 (avatar | preview | media)

## 📊 统计分析接口

### 1. 获取发布趋势

**接口地址**: `GET /analytics/publish-trend`

**查询参数**:
- `period`: 时间周期 (7d | 30d | 90d)
- `platform`: 发布平台

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "summary": {
      "totalPublished": 156,
      "avgDaily": 5.2,
      "growthRate": 12.5
    },
    "trendData": [
      {
        "date": "2024-01-15",
        "published": 8,
        "views": 1520,
        "engagement": 5.2
      }
    ]
  }
}
```

### 2. 获取平台分布

**接口地址**: `GET /analytics/platform-distribution`

### 3. 获取内容质量分析

**接口地址**: `GET /analytics/content-quality`

### 4. 获取用户行为分析

**接口地址**: `GET /analytics/user-behavior`

## 🔧 系统管理接口

### 1. 系统健康检查

**接口地址**: `GET /system/health`

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T14:30:25.000Z",
    "uptime": "2天 14小时 32分钟",
    "version": "v1.2.3",
    "components": {
      "database": {
        "status": "healthy",
        "responseTime": 12
      },
      "redis": {
        "status": "healthy",
        "responseTime": 3
      },
      "apis": {
        "deepseek": {
          "status": "healthy",
          "responseTime": 1200
        }
      }
    },
    "metrics": {
      "cpu": 45,
      "memory": 68,
      "disk": 32
    }
  }
}
```

### 2. 系统信息

**接口地址**: `GET /system/info`

### 3. 重启系统

**接口地址**: `POST /system/restart`

### 4. 清理缓存

**接口地址**: `POST /system/clear-cache`

## ❌ 错误码说明

| 错误码 | 说明 | 处理建议 |
|--------|------|----------|
| 200 | 成功 | 正常处理 |
| 400 | 请求参数错误 | 检查请求参数格式和必填项 |
| 401 | 未授权/Token无效 | 重新登录获取Token |
| 403 | 权限不足 | 检查用户权限或联系管理员 |
| 404 | 资源不存在 | 检查请求路径和资源ID |
| 409 | 资源冲突 | 检查资源是否已存在或被占用 |
| 422 | 数据验证失败 | 检查数据格式和业务规则 |
| 429 | 请求频率限制 | 降低请求频率或稍后重试 |
| 500 | 服务器内部错误 | 联系技术支持 |
| 502 | 网关错误 | 检查网络连接或稍后重试 |
| 503 | 服务不可用 | 系统维护中，稍后重试 |

## 🔄 版本控制

### API版本

当前版本: `v1`

版本控制方式: URL路径版本控制

示例: `http://localhost:8080/api/v1/workflows`

### 版本兼容性

- 向后兼容: 新版本保持对旧版本的兼容
- 废弃通知: 废弃的接口会提前通知并保留一个版本周期
- 迁移指南: 提供详细的版本迁移文档

## 🛡️ 安全规范

### 请求签名

对于敏感操作，可能需要请求签名：

```http
X-Signature: sha256=<signature>
X-Timestamp: 1642234567
```

### 频率限制

- 登录接口: 5次/分钟
- 普通接口: 100次/分钟
- 上传接口: 10次/分钟

### 数据加密

- 敏感数据传输使用HTTPS
- 密码等敏感字段使用加密传输
- API密钥等配置信息加密存储

---

**注意**: 本文档会随着系统更新而持续维护，请关注版本变更通知。