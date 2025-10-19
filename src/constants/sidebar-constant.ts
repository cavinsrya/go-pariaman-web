import {
  Album,
  Armchair,
  LayoutDashboard,
  RotateCcwKey,
  SquareMenu,
  Users,
} from "lucide-react";

export const SIDEBAR_MENU_LIST = {
  admin: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Order",
      url: "/order",
      icon: Album,
    },
    {
      title: "User",
      url: "/admin/user",
      icon: Users,
    },
    {
      title: "Change Password",
      url: "/admin/change-password",
      icon: RotateCcwKey,
    },
  ],
  user: [],
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;
