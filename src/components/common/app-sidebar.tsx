// "use client";

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import { useTheme } from "next-themes";
// import Image from "next/image";
// import {
//   DropdownMenu,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuSeparator,
// } from "../ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import { EllipsisVertical, LogOut } from "lucide-react";
// import {
//   SIDEBAR_MENU_LIST,
//   SidebarMenuKey,
// } from "@/constants/sidebar-constant";
// import { cn } from "@/lib/utils";
// import { usePathname } from "next/navigation";
// import { signOut } from "@/actions/auth-action";
// import { useAuthStore } from "@/stores/auth-store";
// import Link from "next/link";
// import { Skeleton } from "../ui/skeleton";
// import { useEffect, useState } from "react";

// export function AppSidebar() {
//   const { isMobile } = useSidebar();
//   const pathname = usePathname();
//   const profile = useAuthStore((state) => state.profile);
//   const [mounted, setMounted] = useState(false);
//   const { theme } = useTheme();

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const logoSrc =
//     theme === "dark"
//       ? "https://nwbgobqaazltwhxpusdv.supabase.co/storage/v1/object/public/images/assets/logo_dark.png"
//       : "https://nwbgobqaazltwhxpusdv.supabase.co/storage/v1/object/public/images/assets/logo_light.png";

//   return (
//     <Sidebar collapsible="icon">
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton asChild>
//               {!mounted ? (
//                 <Skeleton className="w-[140px] h-[50px] mt-4 mx-auto" />
//               ) : (
//                 <div className="w-[140px] h-[50px] mx-auto mt-4 relative">
//                   <Image
//                     src={logoSrc}
//                     alt="Logo Aplikasi"
//                     width={120}
//                     height={80}
//                     className="object-contain mx-auto"
//                     priority
//                   />
//                 </div>
//               )}
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupContent className="flex flex-col gap-2">
//             <SidebarMenu>
//               {SIDEBAR_MENU_LIST[profile.role as SidebarMenuKey]?.map(
//                 (item) => (
//                   <SidebarMenuItem key={item.title}>
//                     <SidebarMenuButton asChild tooltip={item.title}>
//                       <Link
//                         href={item.url}
//                         className={cn(
//                           "px-4 py-3 h-auto transition-colors duration-200",
//                           pathname === item.url
//                             ? "bg-blue-900 text-white hover:!bg-blue-900"
//                             : "hover:!bg-purple-900/70"
//                         )}
//                       >
//                         {item.icon && <item.icon />}
//                         <span>{item.title}</span>
//                       </Link>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 )
//               )}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//       <SidebarFooter>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             {!profile.name || !profile.role ? (
//               <div className="flex items-center gap-3 p-4">
//                 <Skeleton className="h-8 w-8 rounded-lg" />
//                 <div className="flex-1 space-y-1">
//                   <Skeleton className="h-3 w-[100px]" />
//                   <Skeleton className="h-3 w-[60px]" />
//                 </div>
//               </div>
//             ) : (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <SidebarMenuButton
//                     size="lg"
//                     className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//                   >
//                     <Avatar className="h-8 w-8 rounded-lg">
//                       <AvatarImage
//                         src={profile.avatar_url}
//                         alt={profile.name}
//                       ></AvatarImage>
//                       <AvatarFallback className="rounded-lg">
//                         {profile.name?.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="leading-tight">
//                       <h4 className="truncate font-medium">{profile.name}</h4>
//                       <p className="text-muted-foreground truncate text-xs capitalize">
//                         {profile.role}
//                       </p>
//                     </div>
//                     <EllipsisVertical className="ml-auto size-4" />
//                   </SidebarMenuButton>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent
//                   className="min-w-56 rounded-lg"
//                   side={isMobile ? "bottom" : "right"}
//                   align="end"
//                   sideOffset={4}
//                 >
//                   <DropdownMenuLabel>
//                     <div className="flex items-center gap-2 px-1 py-1.5">
//                       <Avatar className="h-8 w-8 rounded-lg">
//                         <AvatarImage
//                           src={profile.avatar_url}
//                           alt={profile.name}
//                         ></AvatarImage>
//                         <AvatarFallback className="rounded-lg">
//                           {profile.name?.charAt(0)}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="leading-tight">
//                         <h4 className="truncate font-medium">{profile.name}</h4>
//                         <p className="text-muted-foreground truncate text-xs capitalize">
//                           {profile.role}
//                         </p>
//                       </div>
//                     </div>
//                   </DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuGroup>
//                     <DropdownMenuItem onClick={() => signOut()}>
//                       <LogOut />
//                       Logout
//                     </DropdownMenuItem>
//                   </DropdownMenuGroup>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>
//     </Sidebar>
//   );
// }
