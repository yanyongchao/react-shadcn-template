# Project Context

## Purpose
基于 React 18 + Vite + TypeScript 的现代化前端应用模板，使用 shadcn/ui 组件库构建可扩展的 Web 应用程序。项目提供了完整的开发架构，包括路由、状态管理、表单处理、主题切换等核心功能。

## Tech Stack
- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite + SWC
- **UI 组件**: shadcn/ui + Radix UI + Tailwind CSS v4
- **路由**: React Router v6（支持懒加载）
- **状态管理**: Zustand（客户端状态）+ TanStack React Query（服务端状态）
- **表单**: React Hook Form + Zod 验证
- **主题**: next-themes（支持明暗主题切换）
- **样式**: Tailwind CSS v4 + CSS 变量
- **图标**: Lucide React
- **代码质量**: ESLint + Prettier

## Project Conventions

### Code Style
- 使用 Prettier 进行代码格式化
- 使用 ESLint 进行代码检查和修复
- 导入别名：`@/` 指向 `src/`，支持 `@/components`、`@/lib`、`@/hooks` 等
- 使用 `cn()` 工具函数合并 Tailwind 类名（基于 clsx + tailwind-merge）
- 文件命名：kebab-case（如 `app-sidebar.tsx`）
- 组件命名：PascalCase（如 `AppSidebar`）

### Architecture Patterns
- **集中式路由配置**: `router/index.tsx` 使用 `createBrowserRouter`
- **懒加载路由**: 提升应用性能，按需加载页面组件
- **模块化路由**: `router/modules/` 目录下独立定义路由
- **布局系统**: 主布局包含可折叠侧边栏、面包屑导航、头部
- **组件分层**: `components/ui/`（shadcn组件）、业务组件、布局组件
- **错误边界**: 全局错误处理和错误恢复
- **Helmet**: 文档头部管理（标题、meta 标签等）

### Testing Strategy
当前项目未配置测试框架，建议后续添加：
- 单元测试：Vitest + React Testing Library
- 端到端测试：Playwright 或 Cypress
- 组件测试：针对 shadcn/ui 组件的测试用例

### Git Workflow
- 主分支：`main`
- 基础 URL：生产构建使用 `--base=/react-temp-admin`
- 代码提交：遵循约定式提交（Conventional Commits）
- 分支策略：Feature Branch Workflow

## Domain Context
### 项目结构
```
src/
├── components/     # 组件库
│   ├── ui/         # shadcn/ui 组件（50+ 个预置组件）
│   ├── error-boundary/  # 错误边界
│   ├── helmet/     # 头部管理
│   └── theme-provider/  # 主题提供者
├── layouts/        # 布局组件
├── pages/          # 页面组件
├── router/         # 路由配置
├── lib/            # 工具库
├── hooks/          # 自定义钩子
├── constants/      # 常量定义
├── utils/          # 工具函数
└── styles/         # 全局样式
```

### 路由结构
- `/login` → 登录页
- `/` → 主布局（重定向到 `/landing`）
- `/landing` → 首页
- `*` → 404 页面

### 核心功能
- 主题切换（明/暗模式）
- 响应式侧边栏（可折叠）
- 面包屑导航
- 代码分割和懒加载
- TypeScript 类型安全

## Important Constraints
- **浏览器支持**: Chrome 61+（基于 ES2015 目标）
- **代码分割**: React 核心库独立分包（react, react-dom, react-router-dom, zustand）
- **生产优化**: 启用 gzip 压缩
- **构建配置**: 目标 ES2015，使用 @vitejs/plugin-react-swc
- **样式约束**: 仅使用 Tailwind CSS，不使用传统 CSS

## External Dependencies
### 核心依赖
- **Radix UI**: 无样式可访问性组件原语
- **TanStack Query**: 服务端状态管理和缓存（10秒过期时间，无重试）
- **Zustand**: 轻量级状态管理
- **React Hook Form**: 高性能表单处理
- **Zod**: TypeScript 优先的 schema 验证
- **next-themes**: 主题切换管理

### 开发依赖
- **Vite**: 快速构建工具和开发服务器
- **TypeScript**: 类型安全
- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **@tailwindcss/vite**: Tailwind CSS Vite 插件

### 构建优化
- **SVGR**: SVG 文件导入支持
- **压缩插件**: 生产环境代码压缩
- **SWC**: 快速 TypeScript/JavaScript 转译
