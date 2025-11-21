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
        <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8">
          <motion.div
            layoutId="auth-container"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.5,
            }}
            className="w-full max-w-4xl rounded-[32px] md:rounded-[40px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden"
          >
            <div className="bg-white">
              <RegisterForm onBack={handleBack} onSuccess={handleSuccess} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

