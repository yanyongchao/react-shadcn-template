"use client"

import { useState } from "react"
import { Sidebar, type MenuKey } from "./components/sidebar"
import { Header } from "./components/header"
import { Outlet } from "react-router-dom";

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeKey, setActiveKey] = useState<MenuKey>("dashboard")
  const [hoverOpen, setHoverOpen] = useState(false)
  const [disableSidebar, setDisableSidebar] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleDisableSidebarChange = (value: boolean) => {
    setDisableSidebar(value)
    if (value) {
      setSidebarCollapsed(true)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={disableSidebar ? true : sidebarCollapsed}
        activeKey={activeKey}
        onMenuClick={setActiveKey}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          title={"xxx"}
          sidebarCollapsed={disableSidebar ? true : sidebarCollapsed}
          onToggleSidebar={() => !disableSidebar && setSidebarCollapsed(!sidebarCollapsed)}
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
