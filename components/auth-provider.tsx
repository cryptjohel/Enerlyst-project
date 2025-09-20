"use client"

import { createContext, useContext, useEffect, useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import { useGeolocation } from "@/hooks/useGeolocation"

interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  signup: (
    email: string,
    password: string,
    fullName: string,
    userType: string,
    companyName?: string
  ) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const location = useGeolocation()

  // ✅ Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // ✅ Save location on login
  useEffect(() => {
    const saveLocationToFirestore = async () => {
      if (user && location?.city) {
        try {
          await setDoc(
            doc(db, "users", user.uid),
            {
              location: {
                city: location.city,
                state: location.state,
                country: location.country,
                latitude: location.latitude,
                longitude: location.longitude,
              },
            },
            { merge: true }
          )
        } catch (error) {
          console.error("❌ Error saving location:", error)
        }
      }
    }

    saveLocationToFirestore()
  }, [user, location])

  // ✅ Signup logic
  const signup = async (
    email: string,
    password: string,
    fullName: string,
    userType: string,
    companyName?: string
  ) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const newUser = userCredential.user

    // Update display name
    await updateProfile(newUser, {
      displayName: fullName,
    })

    // Create inviteCode if needed
    const inviteCode =
      userType === "estate" || userType === "office" || userType === "factory"
        ? Math.random().toString(36).substring(2, 8).toUpperCase()
        : undefined

    // Save metadata
    await setDoc(doc(db, "users", newUser.uid), {
      email,
      fullName,
      userType,
      companyName: companyName || "",
      inviteCode: inviteCode || "",
      createdAt: new Date().toISOString(),
    })

    // Set user with updated displayName
    setUser({ ...newUser, displayName: fullName })
  }

  // ✅ Login logic
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  // ✅ Logout logic
  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
