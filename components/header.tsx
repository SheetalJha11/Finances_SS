
import { HeaderLogo } from "./headerLogo";
import { Navigation } from "./navigation";
import {
  UserButton,
  ClerkLoaded,
  ClerkLoading,
} from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-provider";
import { Loader2 } from "lucide-react";
import { Welcome } from "./welcome";
import { Filters} from "./filters"

export function Header() {
  return (
    <div>
      <header className="bg-(image:--gradient-primary-dark-bottom) px-4 py-8 pb-40 lg:px-14">
        <div className="mx-auto max-w-screen-2xl">

          {/* Logo on the left */}
          <div className="mb-8 flex w-full items-center justify-between">
            <div className="flex items-center lg:gap-x-16">
              <HeaderLogo />
            </div>

             <div className="flex w-full justify-center">
            <Navigation />
          </div>

            {/* Theme toggle and profile on the right */}
            <div className="flex items-center gap-5">
              <ThemeToggle />

              <ClerkLoaded>
                <UserButton />
              </ClerkLoaded>

              <ClerkLoading>
                <Loader2 className="size-8 animate-spin" />
              </ClerkLoading>
            </div>
          </div>

        </div>

        <Welcome />
         <Filters/>
      </header>
    </div>
  );
}
