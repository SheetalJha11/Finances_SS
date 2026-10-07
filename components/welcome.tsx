"use client"

import { useUser } from "@clerk/nextjs";

export function Welcome() {
  const { user, isLoaded } = useUser();

  return(
    <h1 className="text-2xl font-bold text-white">
        Hii {isLoaded ? " , " : " "}{user?.firstName}
      </h1>
  )
}