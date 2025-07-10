import { AuthCheck } from "@/components/auth-check"
import { LandingPage } from "@/components/landing-page"
import { PersonalDashboard } from "@/components/personal-dashboard"
import { EstateDashboard } from "@/components/estate-dashboard"
import { OfficeDashboard } from "@/components/office-dashboard"

export default function Home() {
  return (
    <AuthCheck>
      {({ user }) => {
        if (!user) return <LandingPage />

        switch (user.userType) {
          case "estate":
            return <EstateDashboard />
          case "office":
            return <OfficeDashboard />
          case "factory":
            return <OfficeDashboard /> // Same as office for now
          default:
            return <PersonalDashboard />
        }
      }}
    </AuthCheck>
  )
}
