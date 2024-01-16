"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.store_id}`,
      label: "Dashboard",
      active: pathname === `/${params.store_id}`,
    },
    {
      href: `/${params.store_id}/orders`,
      label: "Orders",
      active: pathname === `/${params.store_id}/orders`,
    },
  ];

  const settings = [
    {
      href: `/${params.store_id}/settings`,
      label: "Settings",
      active: pathname === `/${params.store_id}/settings`,
    },
  ];

  const storeRoutes = [
    {
      href: `/${params.store_id}/billboards`,
      label: "Billboards",
      active: pathname === `/${params.store_id}/billboards`,
    },
    {
      href: `/${params.store_id}/categories`,
      label: "Categories",
      active: pathname === `/${params.store_id}/categories`,
    },
    {
      href: `/${params.store_id}/sub-categories`,
      label: "Sub-Categories",
      active: pathname === `/${params.store_id}/sub-categories`,
    },
    {
      href: `/${params.store_id}/brands`,
      label: "Brands",
      active: pathname === `/${params.store_id}/brands`,
    },
    {
      href: `/${params.store_id}/sizes`,
      label: "Sizes",
      active: pathname === `/${params.store_id}/sizes`,
    },
    {
      href: `/${params.store_id}/colours`,
      label: "Colours",
      active: pathname === `/${params.store_id}/colours`,
    },
    {
      href: `/${params.store_id}/products`,
      label: "Products",
      active: pathname === `/${params.store_id}/products`,
    },
  ];

  return (
    <nav
      className={cn(
        "flex items-center justify-between space-x-4 lg:space-x-6",
        className
      )}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "text-sm text-muted-foreground font-medium transition-colors hover:text-primary"
          )}
        >
          Explore
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {storeRoutes.map((route) => {
            return (
              <DropdownMenuItem key={route.href}>
                <Link
                  href={route.href}
                  className={cn(
                    "my-1 text-sm font-medium transition-colors hover:text-primary",
                    route.active
                      ? "text-black dark:text-white"
                      : "text-muted-foreground"
                  )}
                >
                  {route.label}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      {settings.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
