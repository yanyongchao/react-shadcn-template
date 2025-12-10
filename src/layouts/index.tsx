import { useState } from "react"
import { Sidebar, type MenuKey } from "./components/sidebar"
import { Header } from "./components/header"
import { useSettingsStore } from "@/stores/modules/settings"
import { Outlet } from "react-router-dom";

export default function DashboardPage() {
  const { collapsed } = useSettingsStore()
  const [activeKey, setActiveKey] = useState<MenuKey>("posts-media-images")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        activeKey={activeKey}
        onMenuClick={setActiveKey}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          title={"xxx"}
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
