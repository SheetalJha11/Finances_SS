

import { HeaderLogo } from "./headerLogo"
import {Navigation} from "./navigation"
import { UserButton, ClerkLoaded, ClerkLoading } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/theme-provider"
import { Loader2 } from "lucide-react";
import { Welcome } from "./welcome";


export function Header() {
    return(
      <div>
        <header className="bg-(image:--gradient-primary-dark-bottom) px-4 py-8 pb-20 lg:px-14">
           <div className="max-h-screen-2xl mx-auto">
             <div className="w-full flex justify-between items-center mb-16">
               <div className="lg-gap-x-16 flex justify-center">
                 <HeaderLogo/>
                 
               </div>
                
             </div>
             <div className="w-full flex justify-center items-center">
                <div className="lg-gap-x-16 flex justify-center -translate-y-23">
                <Navigation/>
                </div>
             </div>
             
             <div  className="flex w-full justify-end items-center gap-5 -translate-y-32">
             <ThemeToggle />
              
              <ClerkLoaded>
              <UserButton />
              </ClerkLoaded>
              <ClerkLoading>
                <Loader2 className="size-8 animate-spin"/>
              </ClerkLoading>

             </div>
          </div> 
          <Welcome/>
        </header>
        </div>
    )
}