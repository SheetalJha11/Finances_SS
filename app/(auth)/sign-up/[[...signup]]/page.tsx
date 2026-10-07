import {
  SignUp,
  ClerkLoaded,
  ClerkLoading,
} from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Logo from "@/components/logo"

export default function SignUpPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center">
        <ClerkLoading>
          <Loader2 className="h-6 w-6 animate-spin" />
        </ClerkLoading>

        <ClerkLoaded>
          <SignUp />
        </ClerkLoaded>
      </div>

      <div className="hidden h-ful bg-gradient-to-r from-blue-900 to-cyan-600 lg:flex justify-center items-center">
        <Logo className="text-white"  width={220} height={200}/>
      </div>
    </div>
  );
}