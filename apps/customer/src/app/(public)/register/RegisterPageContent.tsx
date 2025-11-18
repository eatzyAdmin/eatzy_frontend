"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "@repo/ui/motion";
import RegisterForm from "@/components/auth/RegisterForm";

/**
 * Register Page Content - Pattern from DeleteRoleModal.jsx
 * 
 * Structure (line 123-138 of DeleteRoleModal):
 * <AnimatePresence mode="wait">
 *   {isOpen && (
 *     <motion.div className="backdrop">
 *       <motion.div layoutId={`delete-role-${role.id}`}>
 *         content
 *       </motion.div>
 *     </motion.div>
 *   )}
 * </AnimatePresence>
 * 
 * Applied here: Always in DOM, but only visible when isOpen={true}
 */
export default function RegisterPageContent({ isOpen }: { isOpen: boolean }) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSuccess = () => {
    router.push("/login");
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          layoutId="auth-container" // Same layoutId as login card
          className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.5,
          }}
        >
          <RegisterForm onBack={handleBack} onSuccess={handleSuccess} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

