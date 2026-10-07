
import { Button } from "./button"
import {cn} from "@/lib/utils"

type Props = {
    href : string;
    label: string;
    isActive? : boolean;
}

export function NavButton({
    href,
    label,
    isActive
}:Props) {
    return(
        <div>
           <Button
           size="sm"
           variant="link"
           className={cn("cursor-pointer  hover:text-neutral-400 hover:underline  font-extrabold text-white",
           isActive ? "bg-white/10" : "bg-transparent"
        )}
      >
        <a href={href}>{label}</a>
                       
            </Button> 
        </div>
    )
}