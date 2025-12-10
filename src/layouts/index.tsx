import { useState } from "react";
import { useLocation, useMatches } from "react-router-dom";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { useSettingsStore } from "@/stores/modules/settings";
import { Outlet } from "react-router-dom";

export default function DashboardPage() {
  const { collapsed } = useSettingsStore();
  const location = useLocation();
  const matches = useMatches();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 获取当前页面的 title
  const currentTitle = (matches[matches.length - 1] as any)?.handle?.title;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        activePath={location.pathname}
        onMenuClick={() => {}}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          title={currentTitle}
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
