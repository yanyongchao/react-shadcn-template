import { type RouteObject } from "react-router-dom";
import { ROUTE_PATHS } from "@/constants/common";

export const dashboardRoute: RouteObject = {
  path: ROUTE_PATHS.dashboard,
  lazy: async () => ({
    Component: (await import("@/pages/dashboard")).default,
  }),
  handle: {
    title: "首页",
  },
};
