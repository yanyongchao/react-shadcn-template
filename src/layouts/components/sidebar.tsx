"use client"

import type React from "react"

import { useState } from "react"
import {
  LayoutGrid,
  FileEdit,
  Bookmark,
  Tag,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Box,
  FolderOpen,
  File,
  ImageIcon,
  Video,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type MenuKey =
  | "dashboard"
  | "posts"
  | "posts-new"
  | "posts-drafts"
  | "posts-media"
  | "posts-media-images"
  | "posts-media-videos"
  | "categories"
  | "tags"
  | "users"
  | "account"

interface MenuItem {
  key: MenuKey
  title: string
  icon?: React.ComponentType<{ className?: string }>
  children?: MenuItem[]
}

const menuConfig: { title?: string; items: MenuItem[] }[] = [
  {
    items: [
      {
        key: "dashboard",
        title: "Dashboard",
        icon: LayoutGrid,
      },
    ],
  },
  {
    title: "Contents",
    items: [
      {
        key: "posts",
        title: "Posts",
        icon: FileEdit,
        children: [
          { key: "posts", title: "All Posts", icon: File },
          { key: "posts-new", title: "Add New", icon: FileEdit },
          { key: "posts-drafts", title: "Drafts", icon: FolderOpen },
          {
            key: "posts-media",
            title: "Media",
            icon: FolderOpen,
            children: [
              { key: "posts-media-images", title: "Images", icon: ImageIcon },
              { key: "posts-media-videos", title: "Videos", icon: Video },
            ],
          },
        ],
      },
      {
        key: "categories",
        title: "Categories",
        icon: Bookmark,
      },
      {
        key: "tags",
        title: "Tags",
        icon: Tag,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        key: "users",
        title: "Users",
        icon: Users,
      },
      {
        key: "account",
        title: "Account",
        icon: Settings,
      },
    ],
  },
]

interface SidebarProps {
  collapsed: boolean
  activeKey: MenuKey
  onMenuClick: (key: MenuKey) => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

function CollapsedMenuItem({
  item,
  activeKey,
  onMenuClick,
}: {
  item: MenuItem
  activeKey: MenuKey
  onMenuClick: (key: MenuKey) => void
}) {
  const [open, setOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isActive = activeKey === item.key

  const isDescendantActive = (menuItem: MenuItem): boolean => {
    if (menuItem.key === activeKey) return true
    if (menuItem.children) {
      return menuItem.children.some((child) => isDescendantActive(child))
    }
    return false
  }

  const hasActiveChild = item.children && isDescendantActive(item)

  const buttonClasses = cn(
    "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
    isActive || hasActiveChild
      ? "bg-primary/10 text-primary"
      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
  )

  // No children: simple tooltip + click
  if (!hasChildren) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button onClick={() => onMenuClick(item.key)} className={buttonClasses}>
            {item.icon && <item.icon className="h-5 w-5" />}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          {item.title}
        </TooltipContent>
      </Tooltip>
    )
  }

  // Has children: use Popover to show nested menu
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={buttonClasses}>{item.icon && <item.icon className="h-5 w-5" />}</button>
      </PopoverTrigger>
      <PopoverContent side="right" align="start" sideOffset={10} className="w-48 p-1">
        <CollapsedPopoverMenu
          items={item.children!}
          activeKey={activeKey}
          onMenuClick={(key) => {
            onMenuClick(key)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

function CollapsedPopoverMenu({
  items,
  activeKey,
  onMenuClick,
  level = 0,
}: {
  items: MenuItem[]
  activeKey: MenuKey
  onMenuClick: (key: MenuKey) => void
  level?: number
}) {
  return (
    <div className="space-y-0.5">
      {items.map((item) => (
        <CollapsedPopoverMenuItem
          key={item.key}
          item={item}
          activeKey={activeKey}
          onMenuClick={onMenuClick}
          level={level}
        />
      ))}
    </div>
  )
}

function CollapsedPopoverMenuItem({
  item,
  activeKey,
  onMenuClick,
  level,
}: {
  item: MenuItem
  activeKey: MenuKey
  onMenuClick: (key: MenuKey) => void
  level: number
}) {
  const [subOpen, setSubOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isActive = activeKey === item.key

  const isDescendantActive = (menuItem: MenuItem): boolean => {
    if (menuItem.key === activeKey) return true
    if (menuItem.children) {
      return menuItem.children.some((child) => isDescendantActive(child))
    }
    return false
  }

  const hasActiveChild = hasChildren && isDescendantActive(item)

  const baseClasses = cn(
    "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
    isActive || hasActiveChild
      ? "bg-primary/10 font-medium text-primary"
      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
  )

  if (!hasChildren) {
    return (
      <button onClick={() => onMenuClick(item.key)} className={baseClasses}>
        <span className="flex items-center gap-2">
          {item.icon && <item.icon className="h-4 w-4" />}
          {item.title}
        </span>
      </button>
    )
  }

  // Nested submenu using another Popover
  return (
    <Popover open={subOpen} onOpenChange={setSubOpen}>
      <PopoverTrigger asChild>
        <button className={baseClasses}>
          <span className="flex items-center gap-2">
            {item.icon && <item.icon className="h-4 w-4" />}
            {item.title}
          </span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="right" align="start" sideOffset={4} className="w-44 p-1">
        <CollapsedPopoverMenu
          items={item.children!}
          activeKey={activeKey}
          onMenuClick={(key) => {
            onMenuClick(key)
            setSubOpen(false)
          }}
          level={level + 1}
        />
      </PopoverContent>
    </Popover>
  )
}

function MenuItemComponent({
  item,
  level = 0,
  activeKey,
  onMenuClick,
  openKeys,
  toggleOpen,
}: {
  item: MenuItem
  level?: number
  activeKey: MenuKey
  onMenuClick: (key: MenuKey) => void
  openKeys: Set<string>
  toggleOpen: (key: string) => void
}) {
  const hasChildren = item.children && item.children.length > 0
  const isOpen = openKeys.has(item.key)
  const isActive = activeKey === item.key

  // Check if any descendant is active
  const isDescendantActive = (menuItem: MenuItem): boolean => {
    if (menuItem.key === activeKey) return true
    if (menuItem.children) {
      return menuItem.children.some((child) => isDescendantActive(child))
    }
    return false
  }

  const hasActiveChild = hasChildren && isDescendantActive(item)

  const paddingLeft = level === 0 ? "pl-3" : level === 1 ? "pl-8" : level === 2 ? "pl-12" : "pl-16"

  if (hasChildren) {
    return (
      <Collapsible open={isOpen} onOpenChange={() => toggleOpen(item.key)}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
              paddingLeft,
              hasActiveChild
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <span className="flex items-center gap-3">
              {item.icon && <item.icon className="h-5 w-5" />}
              {item.title}
            </span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1">
          {item.children!.map((child) => (
            <MenuItemComponent
              key={child.key}
              item={child}
              level={level + 1}
              activeKey={activeKey}
              onMenuClick={onMenuClick}
              openKeys={openKeys}
              toggleOpen={toggleOpen}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onMenuClick(item.key)
      }}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        paddingLeft,
        isActive
          ? "bg-primary/10 font-medium text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {item.icon && <item.icon className="h-5 w-5" />}
      {item.title}
    </button>
  )
}

export function Sidebar({ collapsed, activeKey, onMenuClick, mobileOpen, onMobileClose }: SidebarProps) {
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set(["posts", "posts-media"]))

  const toggleOpen = (key: string) => {
    setOpenKeys((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  const handleMenuClick = (key: MenuKey) => {
    onMenuClick(key)
    onMobileClose?.()
  }

  return (
    <TooltipProvider>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onMobileClose} />}

      <aside
        className={cn(
          "flex h-screen flex-col border-r border-border bg-background transition-all duration-300",
          "fixed left-0 top-0 z-50 md:relative md:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "w-64 md:w-auto",
          !collapsed ? "md:w-64" : "md:w-16",
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center border-b border-border",
            collapsed ? "md:justify-center md:px-2 justify-start px-4" : "gap-2 px-4",
          )}
        >
          <Box className="h-6 w-6 shrink-0" />
          <span className={cn("text-lg font-semibold", collapsed && "md:hidden")}>Brand</span>
        </div>

        <nav className={cn("flex-1 overflow-y-auto", collapsed ? "p-4 md:p-2" : "p-4")}>
          {/* 仅在PC端收起时显示图标模式 */}
          <div className={cn("hidden", collapsed && "md:block")}>
            <div className="flex flex-col items-center gap-2">
              {menuConfig.map((section) =>
                section.items.map((item) => (
                  <CollapsedMenuItem key={item.key} item={item} activeKey={activeKey} onMenuClick={handleMenuClick} />
                )),
              )}
            </div>
          </div>

          {/* PC端展开或移动端时显示完整菜单 */}
          <div className={cn(collapsed && "md:hidden")}>
            {menuConfig.map((section, sectionIndex) => (
              <div key={sectionIndex} className={sectionIndex > 0 ? "mt-6" : ""}>
                {section.title && (
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </p>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <MenuItemComponent
                      key={item.key}
                      item={item}
                      activeKey={activeKey}
                      onMenuClick={handleMenuClick}
                      openKeys={openKeys}
                      toggleOpen={toggleOpen}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div className={cn("border-t border-border", collapsed ? "p-4 md:p-2" : "p-4")}>
          {/* 仅在PC端收起时显示图标按钮 */}
          <div className={cn("hidden", collapsed && "md:block")}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                Sign out
              </TooltipContent>
            </Tooltip>
          </div>
          {/* PC端展开或移动端时显示完整按钮 */}
          <div className={cn(collapsed && "md:hidden")}>
            <Button variant="outline" className="w-full justify-center gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
