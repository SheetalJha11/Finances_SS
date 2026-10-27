"use client"

import { Geist, Geist_Mono } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import QueryProvider from "@/providers/query-provider";
import {SheetProvider} from "@/providers/sheet-providers"
import {Sheet} from "@/components/ui/sheet"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={cn(
          "antialiased",
          fontMono.variable,
          "font-sans",
          geist.variable
        )}
      >
        <body>
          <ThemeProvider>
            <QueryProvider>
            <SheetProvider/>
            <Sheet/>
            {children}
            </QueryProvider>
            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}