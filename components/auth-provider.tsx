"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  userType: "personal" | "estate" | "office" | "factory"
  companyName?: string
  inviteCode?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (
    email: string,
    password: string,
    name: string,
    userType: User["userType"],
    companyName?: string,
  ) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate auth check
    const savedUser = localStorage.getItem("enerlyst_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate Firebase auth
    const mockUser: User = {
      id: "1",
      email,
      name: email.split("@")[0],
      userType: "personal",
    }
    setUser(mockUser)
    localStorage.setItem("enerlyst_user", JSON.stringify(mockUser))
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
    userType: User["userType"],
    companyName?: string,
  ) => {
    // Generate invite code for estate/office users
    const inviteCode =
      userType === "estate" || userType === "office"
        ? Math.random().toString(36).substring(2, 8).toUpperCase()
        : undefined

    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      userType,
      companyName,
      inviteCode,
    }
    setUser(mockUser)
    localStorage.setItem("enerlyst_user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("enerlyst_user")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
