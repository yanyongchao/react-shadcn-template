<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指导。

## 项目概览

这是一个基于 React 18 + Vite + TypeScript 的应用程序，使用 shadcn/ui 组件库。项目特性包括：
- **UI 框架**: shadcn/ui 配合 Radix UI 组件和 Tailwind CSS
- **路由**: React Router v6，支持懒加载路由
- **状态管理**: Zustand（客户端状态）+ TanStack React Query（服务端状态）
- **表单**: React Hook Form + Zod 验证
- **主题**: 使用 next-themes 支持明暗主题切换
- **构建**: Vite + SWC，Tailwind CSS v4，支持压缩

## 常用命令

### 开发
```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 修复代码检查问题
npm run lint:fix

# 代码格式化
npm run format
```

### 构建配置
- **基础 URL**: 生产构建使用 `--base=/react-temp-admin`（详见 package.json:8）
- **目标**: ES2015，支持 Chrome 61+
- **代码分割**: React 库分割为独立 chunks（react, react-dom, react-router-dom, zustand）
- **压缩**: 生产构建启用 gzip 压缩

## 代码架构

### 入口点
- **main.tsx**: 应用程序入口点，设置：
  - QueryClient 配合 TanStack React Query（10秒过期时间，无重试）
  - ErrorBoundary 用于错误处理
  - HelmetProvider 用于文档头部管理
  - ThemeProvider 用于明暗主题管理

### 路由结构
- **router/index.tsx**: 使用 `createBrowserRouter` 的集中化路由配置
  - 懒加载路由以提升性能
  - 使用环境变量 `VITE_APP_BASE_URL` 作为 `basename`
  - 路由配置：
    - `/login` → 登录页
    - `/` → 主布局（重定向到 `/landing`）
    - `/landing` → 首页
    - `*` → 404 页面

- **router/modules/**: 独立的路由模块定义
  - 每个路由可包含元数据（如 `handle` 中的标题）

### 布局系统
- **layouts/index.tsx**: 主应用布局，包含：
  - 可折叠侧边栏（SidebarProvider/SidebarInset）
  - 面包屑导航
  - 带侧边栏触发器的头部
  - 使用 `<Outlet />` 的可滚动内容区域

- **layouts/components/**: 侧边栏相关组件：
  - `app-sidebar.tsx`: 主侧边栏组件
  - `nav-main.tsx`: 主导航项
  - `nav-projects.tsx`: 项目导航区域
  - `nav-user.tsx`: 用户账户区域
  - `team-switcher.tsx`: 团队切换组件

### 目录结构

```
src/
├── components/
│   ├── ui/              # shadcn/ui 组件（50+ 个组件）
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ... (更多)
│   ├── error-boundary/  # 错误边界组件
│   ├── helmet/          # 头部管理组件
│   └── theme-provider/  # 主题提供者包装器
├── layouts/
│   ├── components/      # 布局专用组件
│   └── index.tsx        # 主布局组件
├── pages/
│   ├── landing/         # 首页
│   ├── login/           # 登录页
│   └── not-found/       # 404 页面
├── router/
│   ├── modules/         # 独立路由定义
│   └── index.tsx        # 路由配置
├── lib/
│   └── utils.ts         # 工具函数（合并 className 的 cn() 函数）
├── hooks/
│   └── use-mobile.ts    # 自定义钩子
├── constants/
│   └── common.ts        # 路由路径和其他常量
├── utils/
│   ├── array.ts         # 数组工具
│   └── index.ts         # 工具导出
└── styles/
    └── index.css        # 全局样式和 Tailwind 导入
```

### 组件模式

#### shadcn/ui 组件
- 所有 UI 组件遵循 shadcn/ui 约定
- 使用 Radix UI 组件保证可访问性
- 使用 Tailwind CSS 和 CSS 变量进行样式设置
- 位于 `src/components/ui/`
- 图标库：Lucide React

#### 自定义组件
- **错误边界**: 包裹整个应用进行错误处理
- **Helmet**: 文档头部管理（标题、meta 标签等）
- **主题提供者**: 管理明暗主题切换

### 样式
- **Tailwind CSS v4**: 配合 `@tailwindcss/vite` 插件
- **CSS 变量**: 用于主题设置（在 components.json 中配置）
- **基础颜色**: `neutral` 调色板
- **样式**: "new-york" 样式变体
- 全局样式在 `src/styles/index.css`

### 工具函数
- **`src/lib/utils.ts` 中的 `cn()`**: 使用 clsx 和 tailwind-merge 合并 Tailwind 类名
  ```typescript
  import { cn } from "@/lib/utils"
  cn("px-4 py-2", "bg-blue-500") // → "px-4 py-2 bg-blue-500"
  ```

### 常量
- **路由路径**: 集中管理在 `src/constants/common.ts`
  ```typescript
  export const ROUTE_PATHS = {
    login: "/login",
    notFound: "/not-found",
    landing: "/landing",
  };
  ```

## 配置文件

### components.json
shadcn/ui 配置：
- 样式："new-york"
- 图标库："lucide"
- Tailwind CSS 启用 CSS 变量
- 为 components、utils、ui、lib 和 hooks 配置路径别名

### vite.config.ts
Vite 配置，包含：
- React SWC 插件
- Tailwind CSS 插件
- 压缩插件（仅构建时）
- SVGR 插件用于 SVG 导入
- 路径别名（`@` → `src`）
- React 库的自定义代码分割

### TypeScript 配置
- 两个独立配置：`tsconfig.app.json`（应用）和 `tsconfig.node.json`（Node.js 工具）

## 开发说明

### 添加新路由
1. 在 `src/pages/<name>/` 创建页面组件
2. 在 `src/router/modules/` 添加路由定义
3. 更新 `src/router/index.tsx` 包含新路由
4. 将路径添加到 `src/constants/common.ts`

### 添加 shadcn/ui 组件
组件已预装。如需添加新组件：
```bash
npx shadcn@latest add <component-name>
```

### 环境变量
- `VITE_APP_BASE_URL`: 用作路由 basename（默认："/"）

### 导入别名
- `@/` → `src/`
- `@/components` → `src/components`
- `@/components/ui` → `src/components/ui`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`

## 关键依赖

### UI 和样式
- `@radix-ui/*`: 可访问的 UI 组件原语
- `tailwindcss`: 实用优先的 CSS 框架
- `class-variance-authority`: 组件变体
- `clsx` + `tailwind-merge`: 类名工具
- `lucide-react`: 图标库

### 状态和数据
- `@tanstack/react-query`: 服务端状态管理
- `zustand`: 客户端状态管理
- `react-hook-form`: 表单处理
- `@hookform/resolvers`: 使用 Zod 进行表单验证
- `zod`: 模式验证

### 路由和导航
- `react-router-dom`: 客户端路由
- `react-helmet-async`: 文档头部管理

### 开发工具
- `vite`: 构建工具和开发服务器
- `@vitejs/plugin-react-swc`: Vite 的 React 插件
- `eslint`: 代码检查
- `prettier`: 代码格式化
- `typescript`: 类型安全
