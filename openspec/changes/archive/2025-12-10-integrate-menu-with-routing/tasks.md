# 任务清单：打通菜单配置与 React 路由的联动

## 任务列表

### 阶段 1：准备工作

- [ ] 1.1 检查当前代码结构和依赖
- [ ] 1.2 验证 React Router 版本和可用 Hooks
- [ ] 1.3 确认 MenuKey 类型定义

### 阶段 2：修改 Sidebar 组件

- [ ] 2.1 在 Sidebar 组件中导入 `useNavigate` Hook
- [ ] 2.2 修改 `onMenuClick` 处理函数，实现路由导航
- [ ] 2.3 使用 `useCallback` 优化 `onMenuClick` 函数
- [ ] 2.4 测试菜单点击导航功能

### 阶段 3：修改 Layout 组件

- [ ] 3.1 在 layouts/index.tsx 中导入 `useLocation` Hook
- [ ] 3.2 移除本地的 `activeKey` 状态管理
- [ ] 3.3 使用 `useLocation()` 获取当前路径，计算 `activeKey`
- [ ] 3.4 处理嵌套菜单的父级路径匹配逻辑
- [ ] 3.5 使用 `useCallback` 和 `useMemo` 优化性能

### 阶段 4：处理嵌套菜单联动

- [ ] 4.1 实现自动展开父级菜单的逻辑
- [ ] 4.2 使用 `useMatches` Hook 获取路由层级信息
- [ ] 4.3 根据路由层级自动展开对应菜单组
- [ ] 4.4 测试嵌套菜单的联动效果

### 阶段 5：优化和测试

- [ ] 5.1 代码格式化（运行 `npm run format`）
- [ ] 5.2 代码检查（运行 `npm run lint`）
- [ ] 5.3 TypeScript 类型检查
- [ ] 5.4 手动测试所有菜单项的导航
- [ ] 5.5 手动测试路由变化时的菜单高亮
- [ ] 5.6 测试浏览器前进/后退按钮
- [ ] 5.7 测试直接访问 URL 的场景
- [ ] 5.8 测试移动端菜单功能

### 阶段 6：验证和收尾

- [ ] 6.1 验证所有验收标准
- [ ] 6.2 创建测试用例（如需要）
- [ ] 6.3 更新相关文档
- [ ] 6.4 提交代码并创建 PR

## 任务详情

### 任务 2.1：导入 useNavigate Hook

**文件**：`src/layouts/components/sidebar.tsx`

**操作**：
```typescript
import { useNavigate } from "react-router-dom";
```

**说明**：需要在 Sidebar 组件内部调用 Hook

### 任务 2.2：修改 onMenuClick 处理函数

**文件**：`src/layouts/components/sidebar.tsx`

**当前代码**：
```typescript
const handleMenuClick = (key: MenuKey) => {
  onMenuClick(key)
  onMobileClose?.()
}
```

**修改后**：
```typescript
const handleMenuClick = (key: MenuKey) => {
  navigate(key)
  onMobileClose?.()
}
```

### 任务 3.1：导入 useLocation Hook

**文件**：`src/layouts/index.tsx`

**操作**：
```typescript
import { useLocation } from "react-router-dom";
```

### 任务 3.2：移除本地 activeKey 状态

**当前代码**：
```typescript
const [activeKey, setActiveKey] = useState<MenuKey>("/dashboard")
```

**修改后**：
```typescript
const location = useLocation()
const activeKey = location.pathname
```

### 任务 3.3：处理嵌套菜单路径匹配

**逻辑**：
- 如果当前路径完全匹配菜单项的 key，则高亮该菜单项
- 如果当前路径是菜单项子路径，则高亮父菜单项（用于展开状态）

### 任务 4.1：实现父级菜单自动展开

**文件**：`src/layouts/components/sidebar.tsx`

**当前代码**：
```typescript
const [openKeys, setOpenKeys] = useState<Set<string>>(new Set(["posts", "posts-media"]))
```

**修改后**：
```typescript
const location = useLocation()
const [openKeys, setOpenKeys] = useState<Set<string>>(new Set())

// 根据当前路径自动展开相关菜单组
useEffect(() => {
  const keys = new Set<string>()
  MEMU_CONFIG.forEach(section => {
    section.items.forEach(item => {
      if (isDescendantActive(item)) {
        keys.add(item.key)
      }
    })
  })
  setOpenKeys(keys)
}, [location.pathname])
```

## 验收检查点

### 检查点 1：菜单点击导航
```bash
# 测试步骤：
1. 启动开发服务器：npm run dev
2. 访问 http://localhost:5173
3. 点击侧边栏中的 "Dashboard" 菜单项
4. 验证页面是否跳转到 /dashboard
5. 检查 URL 是否正确更新
```

**期望结果**：点击菜单项后页面立即跳转，URL 更新为对应路径

### 检查点 2：路由变化时菜单高亮
```bash
# 测试步骤：
1. 手动在地址栏输入 http://localhost:5173/dashboard
2. 检查侧边栏中 "Dashboard" 是否高亮
3. 手动输入 http://localhost:5173/login
4. 检查登录页是否显示，侧边栏是否隐藏或显示对应状态
```

**期望结果**：直接访问 URL 时，菜单正确高亮对应项

### 检查点 3：浏览器导航按钮
```bash
# 测试步骤：
1. 在仪表盘页面点击浏览器前进按钮
2. 检查是否有错误或异常行为
3. 在仪表盘页面点击浏览器后退按钮
4. 检查页面和菜单状态是否正确
```

**期望结果**：浏览器导航按钮正常工作，菜单状态与页面同步

### 检查点 4：嵌套菜单
```bash
# 测试步骤：
1. 添加嵌套菜单项到 MEMU_CONFIG
2. 访问子菜单页面
3. 检查父菜单是否自动展开
4. 检查子菜单是否正确高亮
```

**期望结果**：嵌套菜单的展开和高亮行为正确

### 检查点 5：移动端兼容性
```bash
# 测试步骤：
1. 调整浏览器窗口大小至移动端尺寸
2. 点击移动端菜单按钮
3. 点击菜单项
4. 检查菜单是否自动关闭
5. 检查页面是否正确导航
```

**期望结果**：移动端功能保持正常，菜单导航联动正常

## 性能注意事项

1. **使用 useCallback**：缓存事件处理函数，避免不必要的重渲染
2. **使用 useMemo**：缓存计算结果（如 activeKey 的计算）
3. **最小化依赖**：在 useEffect 中正确设置依赖项
4. **避免循环**：确保导航不会导致无限循环

## 故障排除

### 问题 1：菜单点击后页面刷新
**原因**：onMenuClick 仍调用了 onMenuClick prop 而不是 navigate
**解决**：确保使用 navigate(key) 而不是 onMenuClick(key)

### 问题 2：菜单高亮不正确
**原因**：activeKey 计算逻辑有误
**解决**：检查路径匹配逻辑，确保支持嵌套路径

### 问题 3：嵌套菜单不展开
**原因**：useEffect 依赖项设置错误
**解决**：检查依赖项是否包含 location.pathname

### 问题 4：类型错误
**原因**：MenuKey 类型与路由路径类型不匹配
**解决**：确保 ROUTE_PATHS 和 MenuKey 使用相同的类型定义

---

**更新时间**：2025-12-10
**状态**：进行中
