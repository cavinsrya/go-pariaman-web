"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

const gradientBtn =
  "text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 shadow-lg shadow-teal-500/50 rounded-lg font-bold py-2 cursor-pointer";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Katalog" },
];

export default function Navbar01() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  const navBase =
    "px-4 py-2 text-sm rounded-md no-underline transition-colors font-bold";
  const navHover = "hover:bg-accent hover:text-accent-foreground font-bold";
  const navActive = "bg-accent text-accent-foreground font-bold";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center h-16 gap-2">
          <div className="flex items-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="https://res.cloudinary.com/dohpngcuj/image/upload/v1760430546/mainlogo_z9im0h.png"
                alt="App Logo"
                width={100}
                height={80}
                priority
                className="h-10 w-auto"
              />
              <span className="sr-only">Home</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                {NAV_LINKS.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        navBase,
                        navHover,
                        isActive(link.href) && navActive
                      )}
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center justify-end gap-2">
            <div className="hidden md:block">
              <Link href="/login" className={cn("px-4 text-sm", gradientBtn)}>
                Masuk
              </Link>
            </div>

            <div className="md:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    aria-label="Menu"
                    className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="space-y-1.5">
                      <span className="block h-0.5 w-5 bg-current" />
                      <span className="block h-0.5 w-5 bg-current" />
                      <span className="block h-0.5 w-5 bg-current" />
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-56 p-3">
                  <nav className="grid gap-2">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "text-sm text-center rounded-md px-3 py-2",
                          navHover,
                          isActive(link.href) && navActive
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link
                      href="/login"
                      className={cn("text-sm text-center", gradientBtn)}
                    >
                      Masuk
                    </Link>
                  </nav>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
