"use client";

import { usePathname } from "next/navigation";
import LoginPageContent from "./login/LoginPageContent";
import RegisterPageContent from "./register/RegisterPageContent";

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

  return (
    <div className="relative min-h-screen">
      {/* LoginPageContent - like RoleCard, always renders when active */}
      {isLoginPage && <LoginPageContent />}

      {/* RegisterPageContent - like DeleteRoleModal, always in DOM, controlled by isOpen */}
      <RegisterPageContent isOpen={isRegisterPage} />

      {/* Hidden children - just for Next.js routing */}
      <div className="hidden">{children}</div>
    </div>
  );
}

