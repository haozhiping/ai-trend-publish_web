# TrendPublish 部署指南

## 📋 部署概览

本文档详细说明了 TrendPublish 前端项目的部署流程，包括开发环境、测试环境和生产环境的配置。

## 🛠 环境要求

### 基础环境

- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0 或 **yarn**: >= 1.22.0
- **Git**: >= 2.0.0

### 推荐环境

- **Node.js**: 18.x LTS
- **npm**: 9.x
- **操作系统**: Linux/macOS/Windows

## 📦 构建配置

### 环境变量配置

创建对应环境的配置文件：

#### 开发环境 (`.env.development`)

```env
# 应用配置
VITE_APP_TITLE=TrendPublish 管理系统 (开发)
VITE_APP_VERSION=1.0.0-dev
VITE_APP_ENV=development

# API配置
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000

# 功能开关
VITE_ENABLE_MOCK=true
VITE_ENABLE_DEBUG=true
VITE_ENABLE_VCONSOLE=true

# 第三方服务
VITE_SENTRY_DSN=
VITE_ANALYTICS_ID=
```

#### 测试环境 (`.env.staging`)

```env
# 应用配置
VITE_APP_TITLE=TrendPublish 管理系统 (测试)
VITE_APP_VERSION=1.0.0-staging
VITE_APP_ENV=staging

# API配置
VITE_API_BASE_URL=https://api-staging.trendpublish.com/api
VITE_API_TIMEOUT=30000

# 功能开关
VITE_ENABLE_MOCK=false
VITE_ENABLE_DEBUG=true
VITE_ENABLE_VCONSOLE=false

# 第三方服务
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
VITE_ANALYTICS_ID=GA-STAGING-ID
```

#### 生产环境 (`.env.production`)

```env
# 应用配置
VITE_APP_TITLE=TrendPublish 管理系统
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production

# API配置
VITE_API_BASE_URL=https://api.trendpublish.com/api
VITE_API_TIMEOUT=30000

# 功能开关
VITE_ENABLE_MOCK=false
VITE_ENABLE_DEBUG=false
VITE_ENABLE_VCONSOLE=false

# 第三方服务
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
VITE_ANALYTICS_ID=GA-PRODUCTION-ID

# CDN配置
VITE_CDN_URL=https://cdn.trendpublish.com
VITE_STATIC_URL=https://static.trendpublish.com
```

### 构建脚本配置

更新 `package.json` 中的构建脚本：

```json
{
  "scripts": {
    "dev": "vite --mode development",
    "build": "vite build --mode production",
    "build:staging": "vite build --mode staging",
    "build:analyze": "vite build --mode production && npx vite-bundle-analyzer dist",
    "preview": "vite preview",
    "preview:staging": "vite preview --mode staging",
    "lint": "eslint src --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

## 🏗 构建流程

### 1. 安装依赖

```bash
# 使用 npm
npm ci

# 或使用 yarn
yarn install --frozen-lockfile
```

### 2. 代码检查

```bash
# 类型检查
npm run type-check

# 代码规范检查
npm run lint

# 运行测试
npm run test
```

### 3. 构建项目

```bash
# 生产环境构建
npm run build

# 测试环境构建
npm run build:staging

# 构建分析
npm run build:analyze
```

### 4. 预览构建结果

```bash
# 预览生产构建
npm run preview

# 预览测试构建
npm run preview:staging
```

## 🚀 部署方案

### 方案一：Nginx 静态部署

#### 1. 构建项目

```bash
npm run build
```

#### 2. Nginx 配置

创建 `/etc/nginx/sites-available/trendpublish` 配置文件：

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com;
    
    # SSL 证书配置
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # 网站根目录
    root /var/www/trendpublish;
    index index.html;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.trendpublish.com;" always;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # 前端路由支持
    location / {
        try_files $uri $uri/ /index.html;
        
        # 缓存策略
        location ~* \.(html)$ {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # API 代理
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时设置
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
        
        # 缓存设置
        proxy_cache_bypass $http_upgrade;
        proxy_no_cache $http_upgrade;
    }
    
    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # 禁止访问敏感文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~ \.(env|config)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

#### 3. 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/trendpublish /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载配置
sudo systemctl reload nginx
```

#### 4. 部署脚本

创建 `deploy.sh` 脚本：

```bash
#!/bin/bash

# 部署配置
PROJECT_NAME="trendpublish"
DEPLOY_PATH="/var/www/trendpublish"
BACKUP_PATH="/var/backups/trendpublish"
BUILD_PATH="./dist"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查构建目录
if [ ! -d "$BUILD_PATH" ]; then
    log_error "构建目录不存在: $BUILD_PATH"
    exit 1
fi

# 创建备份
log_info "创建备份..."
if [ -d "$DEPLOY_PATH" ]; then
    BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
    sudo mkdir -p "$BACKUP_PATH"
    sudo cp -r "$DEPLOY_PATH" "$BACKUP_PATH/$BACKUP_NAME"
    log_info "备份已创建: $BACKUP_PATH/$BACKUP_NAME"
fi

# 部署新版本
log_info "部署新版本..."
sudo rm -rf "$DEPLOY_PATH"
sudo mkdir -p "$DEPLOY_PATH"
sudo cp -r "$BUILD_PATH"/* "$DEPLOY_PATH/"

# 设置权限
sudo chown -R www-data:www-data "$DEPLOY_PATH"
sudo chmod -R 755 "$DEPLOY_PATH"

# 重载 Nginx
log_info "重载 Nginx..."
sudo nginx -t && sudo systemctl reload nginx

# 清理旧备份 (保留最近5个)
log_info "清理旧备份..."
sudo find "$BACKUP_PATH" -maxdepth 1 -type d -name "backup_*" | sort -r | tail -n +6 | sudo xargs rm -rf

log_info "部署完成!"
log_info "访问地址: https://your-domain.com"
```

### 方案二：Docker 容器部署

#### 1. 创建 Dockerfile

```dockerfile
# 多阶段构建
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 生产镜像
FROM nginx:alpine

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 复制构建结果
COPY --from=builder /app/dist /usr/share/nginx/html

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 设置权限
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# 启动命令
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. 创建 nginx.conf

```nginx
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    # 基础配置
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 10M;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # 安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        
        # 前端路由支持
        location / {
            try_files $uri $uri/ /index.html;
            
            # HTML 文件不缓存
            location ~* \.html$ {
                expires -1;
                add_header Cache-Control "no-cache, no-store, must-revalidate";
            }
        }
        
        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # 健康检查
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

#### 3. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  trendpublish-frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: trendpublish-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    volumes:
      - ./logs:/var/log/nginx
    networks:
      - trendpublish-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  trendpublish-network:
    driver: bridge

volumes:
  logs:
    driver: local
```

#### 4. Docker 部署脚本

创建 `docker-deploy.sh`：

```bash
#!/bin/bash

# Docker 部署脚本
PROJECT_NAME="trendpublish-frontend"
IMAGE_NAME="trendpublish/frontend"
CONTAINER_NAME="trendpublish-frontend"

# 构建镜像
echo "构建 Docker 镜像..."
docker build -t $IMAGE_NAME:latest .

# 停止并删除旧容器
echo "停止旧容器..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# 启动新容器
echo "启动新容器..."
docker-compose up -d

# 检查容器状态
echo "检查容器状态..."
docker ps | grep $CONTAINER_NAME

# 查看日志
echo "容器日志:"
docker logs $CONTAINER_NAME --tail 20

echo "部署完成!"
```

### 方案三：CDN + 对象存储部署

#### 1. 构建配置

更新 `vite.config.ts` 支持 CDN：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  const cdnUrl = process.env.VITE_CDN_URL || ''
  
  return {
    plugins: [react()],
    base: isProduction && cdnUrl ? cdnUrl : '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            antd: ['antd', '@ant-design/icons'],
            charts: ['recharts'],
            utils: ['dayjs', 'axios']
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            '@primary-color': '#1677ff',
          },
        },
      },
    }
  }
})
```

#### 2. 上传脚本

创建 `upload-to-cdn.js`：

```javascript
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const mime = require('mime-types')

// 配置 AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
})

const BUCKET_NAME = process.env.S3_BUCKET_NAME
const DIST_PATH = './dist'
const CDN_PATH = 'frontend'

// 上传文件到 S3
async function uploadFile(filePath, key) {
  const fileContent = fs.readFileSync(filePath)
  const contentType = mime.lookup(filePath) || 'application/octet-stream'
  
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
    CacheControl: getCacheControl(filePath),
    ACL: 'public-read'
  }
  
  try {
    const result = await s3.upload(params).promise()
    console.log(`✅ 上传成功: ${key}`)
    return result
  } catch (error) {
    console.error(`❌ 上传失败: ${key}`, error)
    throw error
  }
}

// 获取缓存策略
function getCacheControl(filePath) {
  const ext = path.extname(filePath)
  
  if (ext === '.html') {
    return 'no-cache, no-store, must-revalidate'
  } else if (['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2'].includes(ext)) {
    return 'public, max-age=31536000, immutable'
  } else {
    return 'public, max-age=86400'
  }
}

// 递归上传目录
async function uploadDirectory(dirPath, prefix = '') {
  const files = fs.readdirSync(dirPath)
  
  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      await uploadDirectory(filePath, `${prefix}${file}/`)
    } else {
      const key = `${CDN_PATH}/${prefix}${file}`
      await uploadFile(filePath, key)
    }
  }
}

// 主函数
async function main() {
  try {
    console.log('开始上传到 CDN...')
    await uploadDirectory(DIST_PATH)
    console.log('🎉 上传完成!')
  } catch (error) {
    console.error('上传失败:', error)
    process.exit(1)
  }
}

main()
```

## 🔄 CI/CD 流程

### GitHub Actions 配置

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run type check
      run: npm run type-check
      
    - name: Run linting
      run: npm run lint
      
    - name: Run tests
      run: npm run test
      
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build project
      run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
        VITE_CDN_URL: ${{ secrets.CDN_URL }}
        
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: dist
        path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: dist
        path: dist/
        
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/trendpublish
          sudo systemctl stop nginx
          sudo rm -rf *
          
    - name: Upload files
      uses: appleboy/scp-action@v0.1.4
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        source: "dist/*"
        target: "/var/www/trendpublish"
        strip_components: 1
        
    - name: Restart services
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          sudo chown -R www-data:www-data /var/www/trendpublish
          sudo systemctl start nginx
          sudo systemctl reload nginx

  notify:
    needs: [test, build, deploy]
    runs-on: ubuntu-latest
    if: always()
    
    steps:
    - name: Notify deployment status
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 📊 监控和日志

### 1. 应用监控

#### Sentry 错误监控

在 `src/main.tsx` 中集成 Sentry：

```typescript
import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new BrowserTracing(),
    ],
    tracesSampleRate: 1.0,
    environment: import.meta.env.VITE_APP_ENV,
    beforeSend(event) {
      // 过滤敏感信息
      if (event.request?.url?.includes('/api/auth/')) {
        return null
      }
      return event
    }
  })
}
```

#### Google Analytics

```typescript
// utils/analytics.ts
import { gtag } from 'ga-gtag'

export const initAnalytics = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_ANALYTICS_ID) {
    gtag('config', import.meta.env.VITE_ANALYTICS_ID, {
      page_title: document.title,
      page_location: window.location.href,
    })
  }
}

export const trackEvent = (action: string, category: string, label?: string) => {
  if (import.meta.env.PROD) {
    gtag('event', action, {
      event_category: category,
      event_label: label,
    })
  }
}
```

### 2. 性能监控

创建 `src/utils/performance.ts`：

```typescript
// 性能监控
export const initPerformanceMonitoring = () => {
  // Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log)
    getFID(console.log)
    getFCP(console.log)
    getLCP(console.log)
    getTTFB(console.log)
  })
  
  // 资源加载监控
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const paint = performance.getEntriesByType('paint')
    
    console.log('Performance Metrics:', {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
    })
  })
}
```

### 3. 日志收集

创建 `src/utils/logger.ts`：

```typescript
interface LogLevel {
  DEBUG: 0
  INFO: 1
  WARN: 2
  ERROR: 3
}

const LOG_LEVELS: LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

class Logger {
  private level: number
  
  constructor() {
    this.level = import.meta.env.PROD ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG
  }
  
  private log(level: keyof LogLevel, message: string, data?: any) {
    if (LOG_LEVELS[level] >= this.level) {
      const timestamp = new Date().toISOString()
      const logData = {
        timestamp,
        level,
        message,
        data,
        url: window.location.href,
        userAgent: navigator.userAgent
      }
      
      console[level.toLowerCase() as 'debug' | 'info' | 'warn' | 'error'](
        `[${timestamp}] ${level}: ${message}`,
        data
      )
      
      // 发送到日志服务
      if (import.meta.env.PROD && LOG_LEVELS[level] >= LOG_LEVELS.WARN) {
        this.sendToLogService(logData)
      }
    }
  }
  
  private async sendToLogService(logData: any) {
    try {
      await fetch('/api/logs/frontend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData)
      })
    } catch (error) {
      console.error('Failed to send log to service:', error)
    }
  }
  
  debug(message: string, data?: any) {
    this.log('DEBUG', message, data)
  }
  
  info(message: string, data?: any) {
    this.log('INFO', message, data)
  }
  
  warn(message: string, data?: any) {
    this.log('WARN', message, data)
  }
  
  error(message: string, data?: any) {
    this.log('ERROR', message, data)
  }
}

export const logger = new Logger()
```

## 🔧 故障排查

### 常见问题及解决方案

#### 1. 构建失败

**问题**: TypeScript 类型错误
```bash
# 解决方案
npm run type-check
# 修复类型错误后重新构建
```

**问题**: 内存不足
```bash
# 解决方案：增加 Node.js 内存限制
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### 2. 部署后白屏

**问题**: 路由配置错误
```nginx
# 确保 Nginx 配置包含
location / {
    try_files $uri $uri/ /index.html;
}
```

**问题**: 静态资源 404
```bash
# 检查 base 配置
# vite.config.ts
export default defineConfig({
  base: '/your-path/', // 确保与部署路径一致
})
```

#### 3. API 请求失败

**问题**: CORS 错误
```nginx
# Nginx 代理配置
location /api/ {
    proxy_pass http://backend-server/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

**问题**: 环境变量未生效
```bash
# 检查环境变量文件
cat .env.production

# 确保变量以 VITE_ 开头
VITE_API_BASE_URL=https://api.example.com
```

### 健康检查脚本

创建 `health-check.sh`：

```bash
#!/bin/bash

# 健康检查脚本
DOMAIN="https://your-domain.com"
TIMEOUT=10

# 检查网站可访问性
check_website() {
    local url=$1
    local expected_status=${2:-200}
    
    echo "检查 $url ..."
    
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$url")
    
    if [ "$response" = "$expected_status" ]; then
        echo "✅ $url 正常 (HTTP $response)"
        return 0
    else
        echo "❌ $url 异常 (HTTP $response)"
        return 1
    fi
}

# 检查 API 接口
check_api() {
    local api_url="$DOMAIN/api/system/health"
    
    echo "检查 API 健康状态..."
    
    response=$(curl -s --max-time $TIMEOUT "$api_url")
    
    if echo "$response" | grep -q "healthy"; then
        echo "✅ API 服务正常"
        return 0
    else
        echo "❌ API 服务异常"
        echo "响应: $response"
        return 1
    fi
}

# 主检查流程
main() {
    echo "开始健康检查..."
    echo "时间: $(date)"
    echo "域名: $DOMAIN"
    echo "------------------------"
    
    local failed=0
    
    # 检查主页
    check_website "$DOMAIN" || failed=$((failed + 1))
    
    # 检查健康检查端点
    check_website "$DOMAIN/health" || failed=$((failed + 1))
    
    # 检查 API
    check_api || failed=$((failed + 1))
    
    echo "------------------------"
    
    if [ $failed -eq 0 ]; then
        echo "🎉 所有检查通过!"
        exit 0
    else
        echo "⚠️  发现 $failed 个问题"
        exit 1
    fi
}

main "$@"
```

## 📋 部署检查清单

### 部署前检查

- [ ] 代码已合并到主分支
- [ ] 所有测试通过
- [ ] 代码已通过 Code Review
- [ ] 环境变量已配置
- [ ] 构建成功无错误
- [ ] 静态资源路径正确

### 部署后检查

- [ ] 网站可正常访问
- [ ] 所有页面路由正常
- [ ] API 接口调用正常
- [ ] 静态资源加载正常
- [ ] 用户登录功能正常
- [ ] 核心功能测试通过
- [ ] 性能指标正常
- [ ] 错误监控正常

### 回滚准备

- [ ] 备份已创建
- [ ] 回滚脚本已准备
- [ ] 数据库迁移可回滚
- [ ] 监控告警已配置

---

**注意**: 请根据实际部署环境调整配置参数，确保安全性和性能要求。