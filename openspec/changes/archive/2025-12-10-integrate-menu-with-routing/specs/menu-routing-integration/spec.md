# 规格文档：菜单与路由联动

## 能力概述

本规格定义了菜单系统与 React Router 的联动机制，实现菜单点击自动导航和路由变化时菜单自动高亮的功能。

## 规格增量

## MODIFIED Requirements

### Requirement: 菜单点击导航功能

**要求**：系统 MUST 在用户点击菜单项时自动导航到对应的路由路径，导航行为 MUST 与直接访问 URL 的效果一致，并且 MUST 支持多级嵌套菜单的导航。

#### Scenario: 用户点击一级菜单项
- 给定：当前在 `/dashboard` 页面
- 当：用户点击 "Dashboard" 菜单项
- 那么：页面导航到 `/dashboard`，URL 更新为 `/dashboard`

#### Scenario: 用户点击二级菜单项
- 给定：当前在 `/dashboard` 页面，侧边栏已展开
- 当：用户点击 "用户管理" 子菜单项（路径：`/dashboard/users`）
- 那么：页面导航到 `/dashboard/users`，URL 更新为 `/dashboard/users`

#### Scenario: 用户在移动端点击菜单项
- 给定：移动端菜单已打开
- 当：用户点击任意菜单项
- 那么：页面导航到对应路径，且移动端菜单自动关闭

### Requirement: 路由变化时菜单自动高亮

**要求**：系统 MUST 在路由变化时自动高亮对应的菜单项，高亮状态 MUST 准确反映当前页面，并且 MUST 支持多级菜单的层级高亮（父级和子级）。

#### Scenario: 直接访问 URL
- 给定：用户在地址栏输入 `http://localhost:5173/dashboard`
- 当：页面加载完成
- 那么：侧边栏中的 "Dashboard" 菜单项自动高亮

#### Scenario: 通过浏览器前进/后退导航
- 给定：当前在 `/dashboard` 页面，"Dashboard" 菜单项已高亮
- 当：用户点击浏览器后退按钮返回上一页
- 那么：菜单高亮状态随页面变化正确更新

#### Scenario: 嵌套菜单高亮
- 给定：菜单配置包含父菜单 "Dashboard" 和子菜单 "用户管理"
- 当：用户访问 `/dashboard/users` 路径
- 那么："Dashboard" 菜单项高亮，"用户管理" 子菜单项也高亮

### Requirement: 嵌套菜单自动展开

**要求**：系统 MUST 在访问嵌套菜单的子路径时自动展开父级菜单，展开状态 MUST 持久化直到用户手动折叠，并且 MUST 支持多级嵌套的自动展开。

#### Scenario: 访问二级菜单页面
- 给定：菜单配置包含可折叠的父菜单 "Dashboard"
- 当：用户访问 `/dashboard/users` 路径
- 那么："Dashboard" 父菜单自动展开，显示 "用户管理" 子菜单

#### Scenario: 访问三级菜单页面
- 给定：菜单配置包含三级嵌套菜单
- 当：用户访问三级路径（如 `/dashboard/users/list`）
- 那么：所有相关父级菜单自动展开

### Requirement: 状态管理优化

**要求**：系统 MUST 移除菜单的本地 `activeKey` 状态管理，使用 React Router 的状态（`useLocation`）作为单一数据源，并且 MUST 保持组件 API 不变，向后兼容。

#### Scenario: 移除本地状态
- 给定：Layout 组件当前使用 `useState` 管理 `activeKey`
- 当：修改为使用 `useLocation()` 获取当前路径
- 那么：`activeKey` 自动与路由同步，无需手动更新

#### Scenario: 性能优化
- 给定：组件频繁重渲染
- 当：使用 `useCallback` 缓存事件处理函数
- 那么：避免不必要的重渲染，提升性能

## 技术规范

### 使用的 React Router Hooks

1. **useNavigate**
   - 用途：执行编程式导航
   - 调用时机：菜单项点击时
   - 参数：目标路径（MenuKey 类型）

2. **useLocation**
   - 用途：获取当前路由信息
   - 用途：计算当前激活的菜单项
   - 监听：pathname 变化

3. **useMatches**（可选）
   - 用途：获取路由层级信息
   - 用途：处理嵌套菜单的展开逻辑

### 类型定义

```typescript
// MenuKey 类型必须与路由路径类型一致
export type MenuKey = typeof ROUTE_PATHS[keyof typeof ROUTE_PATHS]

// 菜单项接口
interface MenuItem {
  key: MenuKey          // 路由路径，作为唯一标识
  title: string         // 显示标题
  icon?: ComponentType  // 可选图标组件
  children?: MenuItem[] // 可选子菜单
}
```

### 状态管理规则

1. **单一数据源**：当前路径来自 `useLocation().pathname`
2. **派生状态**：`activeKey` 通过计算当前路径得出
3. **避免循环**：导航前检查当前路径，避免 self-navigation
4. **性能优化**：使用 `useCallback` 和 `useMemo` 优化

### 路径匹配逻辑

```typescript
// 精确匹配
const isActive = (item: MenuItem, currentPath: string) => {
  return item.key === currentPath
}

// 包含匹配（用于父级菜单高亮）
const isDescendantActive = (item: MenuItem, currentPath: string) => {
  if (item.key === currentPath) return true
  if (item.children) {
    return item.children.some(child => isDescendantActive(child, currentPath))
  }
  return false
}
```

## 约束条件

### 必须满足

1. **向后兼容**：组件 props 接口不能变更
2. **类型安全**：通过 TypeScript 类型检查
3. **无循环导航**：避免导航到当前路径
4. **响应式支持**：移动端和桌面端行为一致
5. **无刷新导航**：使用客户端路由，不触发页面刷新

### 不允许

1. 在导航处理函数中使用 `window.location.href`
2. 在组件挂载时执行自动导航
3. 修改现有的菜单 UI 样式和布局
4. 破坏现有的折叠/展开功能

## 验收标准

### 功能验收

- [ ] 所有菜单项点击后正确导航
- [ ] 直接访问 URL 时菜单正确高亮
- [ ] 浏览器前进/后退按钮正常工作
- [ ] 嵌套菜单自动展开和高亮
- [ ] 移动端菜单导航和自动关闭正常

### 性能验收

- [ ] 菜单交互响应时间 < 100ms
- [ ] 路由变化时菜单更新无卡顿
- [ ] 通过 React DevTools Profiler 检查无不必要的重渲染

### 兼容性验收

- [ ] 通过 ESLint 检查
- [ ] 通过 TypeScript 类型检查
- [ ] 代码格式化符合 Prettier 规范
- [ ] 支持 Chrome 61+（项目目标）

## 测试用例

### 单元测试（伪代码）

```typescript
describe("菜单路由联动", () => {
  test("点击菜单项应该导航到对应路径", () => {
    // 模拟 navigate 函数
    const mockNavigate = jest.fn()
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate)

    // 渲染菜单组件并点击
    // 验证 navigate 被正确调用
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard")
  })

  test("路径变化时菜单应该高亮对应项", () => {
    // 模拟 useLocation 返回不同路径
    // 验证 activeKey 计算正确
  })
})
```

### 集成测试（手动）

1. **导航测试**
   - 从首页点击每个菜单项
   - 验证页面正确跳转
   - 验证 URL 正确更新

2. **高亮测试**
   - 直接访问每个页面 URL
   - 验证菜单正确高亮对应项

3. **嵌套测试**
   - 配置嵌套菜单
   - 访问子路径
   - 验证父级展开和子级高亮

4. **浏览器导航测试**
   - 在页面间导航
   - 使用前进/后退按钮
   - 验证状态同步

## 相关文件

- `src/layouts/index.tsx` - 主布局组件
- `src/layouts/components/sidebar.tsx` - 侧边栏组件
- `src/router/config.tsx` - 菜单配置
- `src/router/index.tsx` - 路由配置

## 更新日志

- **2025-12-10**：初始版本，创建规格文档

---

**类型**：功能规格
**状态**：待审核
**版本**：1.0.0
