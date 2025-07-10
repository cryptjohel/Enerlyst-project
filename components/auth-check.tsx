"use client"

import type React from "react"

import { useAuth } from "./auth-provider"
import { Loader2 } from "lucide-react"

interface AuthCheckProps {
  children: ({ user }: { user: any }) => React.ReactNode
}

export function AuthCheck({ children }: AuthCheckProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#22C55E]" />
      </div>
    )
  }

  return <>{children({ user })}</>
}
