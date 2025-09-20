"use client";
import { AuthProvider } from "@/components/auth-provider";
import { AuthCheck } from "@/components/auth-check";

export default function HomePage() {
  return (
    <AuthProvider>
      <AuthCheck />
    </AuthProvider>
  );
}
