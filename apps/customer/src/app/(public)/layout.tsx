"use client";

import { usePathname } from "next/navigation";
import LoginPageContent from "./login/LoginPageContent";
import ForgotPasswordPageContent from "./forgot-password/ForgotPasswordPageContent";
import RegisterPageContent from "./register/RegisterPageContent";
import BackgroundTransition from "@/features/home/components/BackgroundTransition";
import { getCategoryBackgroundImage } from "@/features/home/data/mockRestaurants";

/**
 * Layout Pattern from RoleManagement.jsx
 * 
 * Structure:
 * - RoleManagement renders ALL cards + ALL modals at same level
 * - Cards are always visible
 * - Modals are always in DOM, controlled by isOpen prop
 * 
 * Applied here:
 * - LoginPageContent = RoleCard (always rendered when isLoginPage)
 * - RegisterPageContent = DeleteRoleModal (always in DOM, controlled by isRegisterPage)
 * 
 * Both components handle their own AnimatePresence wrapping.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Detect which page to show based on pathname
  const isLoginPage = pathname === "/login" || pathname === "/";
  const isRegisterPage = pathname === "/register";
  const isForgotPage = pathname === "/forgot-password";

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <BackgroundTransition imageUrl={getCategoryBackgroundImage("sushi-sashimi")} categoryName="" />
      {/* LoginPageContent - like RoleCard, always renders when active */}
      {isLoginPage && <LoginPageContent />}

      {/* RegisterPageContent - like DeleteRoleModal, always in DOM, controlled by isOpen */}
      <RegisterPageContent isOpen={isRegisterPage} />
      <ForgotPasswordPageContent isOpen={isForgotPage} />

      <div className="hidden">{children}</div>
    </div>
  );
}

