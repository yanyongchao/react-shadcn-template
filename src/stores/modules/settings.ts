import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light" | "system";

interface SettingsState {
  collapsed: boolean
  theme: Theme
  setCollapsed: (collapsed: boolean) => void
  setTheme: (theme: Theme) => void
  toggleCollapsed: () => void
}

const initialState: Omit<SettingsState, "setCollapsed" | "setTheme" | "toggleCollapsed"> = {
  collapsed: false,
  theme: "system",
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,
      setCollapsed: (collapsed: boolean) => set({ collapsed }),
      setTheme: (theme: Theme) => set({ theme }),
      toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
    }),
    { name: "app-settings" }
  ),
)
