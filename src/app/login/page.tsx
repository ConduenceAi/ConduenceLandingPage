import type { Metadata } from "next";

import { LoginScreen } from "@/components/auth/LoginScreen";
import { Nav } from "@/components/landing/Nav";
import { CTA } from "@/components/landing/Sections";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to CONDUENCE.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <>
      <Nav />
      <LoginScreen />
      <CTA />
    </>
  );
}
