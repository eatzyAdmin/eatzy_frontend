"use client";

import { LoginForm, LoginIllustration } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useZodForm, loginSchema, type LoginFormData } from "@repo/lib";
import { motion, AnimatePresence } from "@repo/ui/motion";

/**
 * Login Page Content - Pattern from RoleCard.jsx
 * 
 * Structure (line 108-289 of RoleCard):
 * <AnimatePresence mode="wait">
 *   <motion.div layoutId={`role-card-${role.id}`}>
 *     content with buttons that have their own layoutId
 *   </motion.div>
 * </AnimatePresence>
 * 
 * Applied here: Wraps entire component in AnimatePresence, card has layoutId
 */
export default function LoginPageContent() {
  const router = useRouter();

  const form = useZodForm<LoginFormData>({
    schema: loginSchema,
    mode: "onChange",
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <AnimatePresence mode="wait">
      <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8">
        <motion.div
          layoutId="auth-container" // Shared element key - same as RegisterPageContent
          className="w-full max-w-5xl rounded-[32px] md:rounded-[40px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden text-white"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.5,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px] lg:min-h-[640px]">
            {/* Left Column - Illustration */}
            <div className="hidden lg:flex relative overflow-hidden bg-white/5 backdrop-blur-md">
              {/* Decorative gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-[var(--secondary)]/10"></div>
              
              {/* Floating orbs */}
              <div className="absolute top-10 right-10 w-24 h-24 bg-[var(--primary)]/20 rounded-full blur-2xl animate-pulse-slow"></div>
              <div className="absolute bottom-20 left-10 w-32 h-32 bg-[var(--secondary)]/20 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
              
              <LoginIllustration />
            </div>

            {/* Right Column - Login Form */}
            <div className="bg-white rounded-r-[32px] md:rounded-r-[40px] shadow-xl relative">
              {/* Form Content */}
              <div className="relative z-10">
                <LoginForm
                  form={form}
                  onForgotPassword={() => router.push("/forgot-password")}
                  onSuccess={() => router.push("/home")}
                  onRegister={handleRegisterClick}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

