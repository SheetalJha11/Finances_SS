"use client";

import { usePathname, useRouter } from "next/navigation";
import { NavButton } from "./ui/navButton";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useMedia } from "react-use";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";


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

  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button
            size="sm"
            variant="link"
            className="cursor-pointer text-white"
          >
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="px-2">
          <nav className="flex flex-col gap-y-2 pt-6">
            {routers.map((route) => (
              <Button
                key={route.href}
                variant={
                  route.href === pathname ? "secondary" : "ghost"
                }
                onClick={() => onClick(route.href)}
                className="w-full flex justify-start"
              >
                {route.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

     return (
  <div>
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
  </div>
);
     
    
}