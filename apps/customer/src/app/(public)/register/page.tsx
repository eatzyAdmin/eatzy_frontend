"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "@repo/ui/motion";
import { useTransitionStore } from "@/store/transitionStore";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  const router = useRouter();
  const { isTransitioning } = useTransitionStore();

  useEffect(() => {
    // Prevent scrolling during transition
    if (isTransitioning) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isTransitioning]);

  const handleBack = () => {
    router.push("/login");
  };

  const handleSuccess = () => {
    router.push("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: isTransitioning ? 0.6 : 0 }}
      className="min-h-screen"
    >
      <RegisterForm onBack={handleBack} onSuccess={handleSuccess} />
    </motion.div>
  );
}

