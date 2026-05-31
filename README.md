# 🌍 Luxury Bespoke Travel Website

> 高端定制旅行网站 - 对标 Black Tomato

## 📋 项目概述

基于 Black Tomato 网站架构分析，设计并开发的高端定制旅行网站。核心理念：**情感化旅行体验**，而非传统目的地导向。

**核心价值主张：**
> "旅行，不是去往何处，而是感受什么"

---

## 📁 项目结构

```
luxury-travel-site/
├── docs/                              # 文档
│   ├── BLACK-TOMATO-ANALYSIS.md       # Black Tomato 网站架构分析
│   └── HOMEPAGE-LAYOUT.md             # 首页布局设计方案
│
├── src/
│   ├── app/                           # Next.js App Router
│   │   └── (marketing)/
│   │       └── page.tsx               # 首页
│   │
│   ├── components/                    # React 组件
│   │   ├── HeroSection.tsx            # 首屏全屏轮播
│   │   ├── FeelingsSelector.tsx       # 情感选择器（核心功能）
│   │   ├── FeaturedTrips.tsx          # 精选行程
│   │   └── ...                        # 更多组件
│   │
│   └── database/
│       └── schema.prisma              # 数据库模型设计
│
└── package.json
```

---

## 🗄️ 数据库模型

核心数据表：

| 表名 | 说明 | 关键字段 |
|------|------|---------|
| `emotions` | 情感标签 | 5 种核心情感 |
| `destinations` | 目的地 | 大洲/区域/国家 |
| `trips` | 行程产品 | 情感关联/价格/行程 |
| `experiences` | 体验项目 | 活动类型/地点 |
| `accommodations` | 酒店住宿 | 星级/类型/设施 |
| `travel_experts` | 旅行专家 | 专长/语言/简介 |
| `inquiries` | 咨询询盘 | 客户信息/需求/状态 |
| `reviews` | 客户评价 | 评分/内容/关联行程 |
| `articles` | 灵感文章 | 故事/指南/播客 |

详细模型：`src/database/schema.prisma`

---

## 🎨 首页布局

```
┌─────────────────────────────────┐
│  HEADER (固定导航)               │
├─────────────────────────────────┤
│  HERO (全屏视频/图片轮播)        │
│  情感化主标语 + CTA              │
├─────────────────────────────────┤
│  FEELINGS ENGINE ⭐              │
│  "你想感受什么？"                │
│  5 种情感标签选择器              │
├─────────────────────────────────┤
│  FEATURED TRIPS                  │
│  精选行程卡片网格                │
├─────────────────────────────────┤
│  WHY CHOOSE US                   │
│  品牌优势展示                    │
├─────────────────────────────────┤
│  DESTINATIONS                    │
│  按大洲探索目的地                │
├─────────────────────────────────┤
│  TESTIMONIALS                    │
│  客户评价轮播                    │
├─────────────────────────────────┤
│  LATEST STORIES                  │
│  博客/故事/播客                  │
├─────────────────────────────────┤
│  FINAL CTA                       │
│  咨询表单转化                    │
├─────────────────────────────────┤
│  FOOTER                          │
└─────────────────────────────────┘
```

详细设计：`docs/HOMEPAGE-LAYOUT.md`

---

## 🚀 快速开始

### 1. 安装依赖

```bash
cd luxury-travel-site
npm install
```

### 2. 配置数据库

```bash
# 创建.env 文件
cp .env.example .env

# 编辑 DATABASE_URL
# DATABASE_URL="postgresql://user:password@localhost:5432/luxury_travel"

# 生成 Prisma 客户端
npm run db:generate

# 推送数据库结构
npm run db:push

# (可选) 运行种子数据
npm run db:seed
```

### 3. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

---

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| 数据库 | PostgreSQL + Prisma |
| 样式 | Tailwind CSS |
| 动画 | Framer Motion |
| 表单 | React Hook Form + Zod |
| 部署 | Vercel |

---

## 📋 开发阶段

### Phase 1 - MVP (2 周) ✅ 数据库设计
- [x] 数据库模型设计
- [x] 首页布局方案
- [ ] 基础页面搭建
- [ ] 咨询表单

### Phase 2 - 内容层 (2 周)
- [ ] 情感选择器完整实现
- [ ] 灵感/博客系统
- [ ] 客户评价模块

### Phase 3 - 增强 (2 周)
- [ ] 多语言支持
- [ ] SEO 优化
- [ ] 后台 CMS

### Phase 4 - 高级功能 (2 周)
- [ ] AI 情感推荐引擎
- [ ] 数据分析集成

---

## 📚 文档

- [Black Tomato 网站架构分析](docs/BLACK-TOMATO-ANALYSIS.md)
- [首页布局设计方案](docs/HOMEPAGE-LAYOUT.md)
- [数据库模型文档](src/database/schema.prisma)

---

*项目创建时间：2026-05-30 | 对标参考：Black Tomato*
