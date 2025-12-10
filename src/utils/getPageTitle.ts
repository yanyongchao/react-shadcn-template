import { ROUTE_PATHS } from "@/constants/common";

export function getPageTitle<T extends keyof typeof ROUTE_PATHS>(
  key: T,
): string {
  const titles = {
    login: "登录",
    notFound: "页面未找到",
    dashboard: "首页",
  };
  return titles[key];
}
