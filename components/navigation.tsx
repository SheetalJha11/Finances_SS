
"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMedia } from "react-use";
import { Menu } from "lucide-react";

import { NavButton } from "./ui/navButton";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";

const routers = [
  {
    href: "/",
    label: "Overview",
  },
  {
    href: "/transactions",
    label: "Transactions",
  },
  {
    href: "/accounts",
    label: "Accounts",
  },
  {
    href: "/categories",
    label: "Categories",
  },
  {
    href: "/settings",
    label: "Settings",
  },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const isMobile = useMedia("(max-width: 768px)", false);

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  // Mobile navigation
  
if (isMobile) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        className="cursor-pointer text-white"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>

      <SheetContent side="left" className="px-2">
        <nav className="flex flex-col gap-y-2 pt-6">
          {routers.map((route) => (
            <Button
              key={route.href}
              type="button"
              variant={
                pathname === route.href ? "secondary" : "ghost"
              }
              onClick={() => {
                setIsOpen(false);
                router.push(route.href);
              }}
              className="flex w-full justify-start"
            >
              {route.label}
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}


  // Desktop navigation
  return (
    <nav className="flex flex-nowrap items-center gap-4">
      {routers.map((route) => (
        <NavButton
          key={route.href}
          href={route.href}
          label={route.label}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  );
}
