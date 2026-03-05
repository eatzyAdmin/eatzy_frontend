"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LandingPageV2 } from "../components/landing-v2";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile) {
      router.replace("/home");
    }
  }, [router]);

  return <LandingPageV2 />;
}
