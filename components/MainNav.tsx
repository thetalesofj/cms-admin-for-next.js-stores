"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Dashboard",
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Orders",
      active: pathname === `/${params.storeId}/orders`,
    },
  ];

  const settings = [
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeId}/settings`,
    }
  ]

  const storeRoutes = [
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sub-categories`,
      label: "Sub-Categories",
      active: pathname === `/${params.storeId}/sub-categories`,
    },
    {
      href: `/${params.storeId}/brands`,
      label: "Brands",
      active: pathname === `/${params.storeId}/brands`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
      active: pathname === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colours`,
      label: "Colours",
      active: pathname === `/${params.storeId}/colours`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Products",
      active: pathname === `/${params.storeId}/products`,
    },
  ];

  return (
    <nav
      className={cn("flex items-center justify-between space-x-4 lg:space-x-6", className)}
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
            "text-sm text-muted-foreground font-medium transition-colors hover:text-primary",
          )}
          >Explore</DropdownMenuTrigger>
            <DropdownMenuContent>
              
                {storeRoutes.map((route) => {
                  return (
                    <DropdownMenuItem
                    key={route.href}
                    >
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
