import {
  LayoutGrid,
} from "lucide-react"

export const ROUTE_PATHS = {
  login: "/login",
  notFound: "/not-found",
  dashboard: "/dashboard",
} as const;

export type MenuKey = typeof ROUTE_PATHS[keyof typeof ROUTE_PATHS]

interface MenuItem {
  key: MenuKey
  title: string
  icon?: React.ComponentType<{ className?: string }>
  children?: MenuItem[]
}

export const MEMU_CONFIG: { title?: string; items: MenuItem[] }[] = [
  {
    items: [
      {
        key: ROUTE_PATHS.dashboard,
        title: "Dashboard",
        icon: LayoutGrid,
      },
    ],
  },
]