"use client"

import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { useAuth } from "@/components/auth-provider"
import { db } from "@/lib/firebase"

import { LandingPage } from "@/components/landing-page"
import { PersonalDashboard } from "@/components/personal-dashboard"
import { EstateDashboard } from "@/components/estate-dashboard"
import { OfficeDashboard } from "@/components/office-dashboard"

export function AuthCheck() {
  const { user, loading: authLoading } = useAuth()
  const [userData, setUserData] = useState<{
    userType: string
    fullName?: string
    companyName?: string
    inviteCode?: string
  } | null>(null)
  const [fetchingData, setFetchingData] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || fetchingData || userData) return

      setFetchingData(true)
      try {
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          setUserData({
            userType: data.userType || "personal",
            fullName: data.fullName || user.displayName || "User",
            companyName: data.companyName || "",
            inviteCode: data.inviteCode || "",
          })
        } else {
          setUserData({
            userType: "personal",
            fullName: user.displayName || "User",
          })
        }
      } catch (err: any) {
        console.error("❌ Firestore fetch error:", err.message)
        setError("Failed to fetch user data. Check your internet connection.")
        setUserData({
          userType: "personal",
          fullName: user.displayName || "User",
        })
      } finally {
        setFetchingData(false)
      }
    }

    fetchUserData()
  }, [user, fetchingData, userData])

  // Step 1: Wait for auth to resolve
  if (authLoading) {
    return <div className="text-center py-10 text-muted-foreground">Checking authentication...</div>
  }

  // Step 2: Show landing if not logged in
  if (!user) return <LandingPage />

  // Step 3: Wait for Firestore to load
  if (fetchingData || !userData) {
    return <div className="text-center py-10 text-muted-foreground">Loading dashboard...</div>
  }

  // Step 4: Optional error UI
  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>⚠️ {error}</p>
        <p className="text-muted-foreground">Try refreshing or check your connection.</p>
      </div>
    )
  }

  // Step 5: Render dashboard by role
  switch (userData.userType) {
    case "estate":
      return (
        <EstateDashboard
          userName={userData.fullName || "User"}
          companyName={userData.companyName || ""}
          inviteCode={userData.inviteCode || ""}
        />
      )
    case "office":
    case "factory":
      return (
        <OfficeDashboard
          userName={userData.fullName || "User"}
          companyName={userData.companyName || ""}
          inviteCode={userData.inviteCode || ""}
        />
      )
    default:
      return <PersonalDashboard userName={userData.fullName || "User"} />
  }
}
