import {
  LayoutDashboard,
  Users,
  RotateCcwKey,
  Store,
  Package,
  UsersRound,
} from "lucide-react";

export const SIDEBAR_MENU_LIST = {
  admin: [
    {
      title: "Dashboard Admin",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "User Management",
      url: "/admin/user",
      icon: Users,
    },
    {
      title: "Change Password",
      url: "/common/change-password",
      icon: RotateCcwKey,
    },
  ],
  user: [
    {
      title: "Dashboard User",
      url: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Products",
      url: "/user/my-products",
      icon: Package,
    },
    {
      title: "Change Password",
      url: "/common/change-password",
      icon: RotateCcwKey,
    },
    {
      title: "My Profile",
      url: "/user/complete-profile",
      icon: UsersRound,
    },
  ],
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;
