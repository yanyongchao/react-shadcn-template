import { PanelLeftClose, PanelLeftOpen, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSettingsStore } from "@/stores/modules/settings";
import { useTheme } from "@/hooks/useTheme";

interface HeaderProps {
  title: string;
  onMobileMenuOpen?: () => void;
}

export function Header({ title, onMobileMenuOpen }: HeaderProps) {
  const { collapsed, toggleCollapsed } = useSettingsStore();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuOpen}
          className="h-8 w-8 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          className="hidden h-8 w-8 md:flex"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
