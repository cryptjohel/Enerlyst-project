import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { AIChat } from "@/components/ai-chat"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Enerlyst - AI-Powered Energy Optimization | Pelagus Real Estate",
  description:
    "Monitor, analyze, and reduce energy costs with AI-powered insights. Built by Pelagus Real Estate and Energy Solutions.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <AIChat />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
