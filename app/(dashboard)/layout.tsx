
import {Header} from "@/components/header"

type Props = {
    children: React.ReactNode
}

export default function LayoutDashBoard({children}:Props) {
    return(
        <div>
            <Header/>
             {children}
        </div>
    )
}