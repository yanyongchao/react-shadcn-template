import { LayoutGrid } from "lucide-react";

export const ROUTE_PATHS = {
  login: "/login",
  notFound: "/not-found",
  dashboard: "/dashboard",
} as const;

export type MenuKey = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];

interface MenuItem {
  key: MenuKey;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
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
];




// 添加menu配置示例
/**
 *  {
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
 */