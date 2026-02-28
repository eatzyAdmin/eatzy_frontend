"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "@repo/ui/motion";
import RegisterForm from "@/components/auth/RegisterForm";
import { Utensils, ShieldCheck, Bike } from "@repo/ui/icons";
import { ImageWithFallback } from "@repo/ui";

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
        <div className="min-h-screen w-full bg-[#fafafa] flex items-center justify-center p-0 md:p-6 lg:py-8 lg:px-12 overflow-hidden selection:bg-lime-500 selection:text-black">
          <motion.div
            layoutId="auth-container"
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full md:h-auto max-w-[1440px] bg-white md:rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col lg:flex-row-reverse relative"
          >
            {/* Full Container Background Texture - Clearly visible */}
            <div className="absolute inset-0 opacity-[0.4] pointer-events-none z-0">
              <ImageWithFallback
                src=""
                alt="Container Texture"
                placeholderMode="horizontal"
                fill
                className="object-cover grayscale contrast-125"
              />
            </div>

            {/* Right Column (Hero on Register) - Editorial Hero */}
            <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-black/20 z-10 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gray-900">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop"
                  alt="Healthy Food"
                  fill
                  className="object-cover opacity-70 grayscale hover:grayscale-0 transition-all duration-[2s] scale-110 hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
              </div>

              <div className="relative z-10 w-full p-12 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="px-4 py-1.5 bg-lime-500 text-black font-anton font-bold text-xs tracking-widest uppercase rounded-full">
                      Join Our Club
                    </div>
                    <div className="h-px w-24 bg-white/20" />
                    <span className="text-[10px] text-white/40 font-anton uppercase tracking-[0.5em]">Membership Series</span>
                  </div>

                  <h1 className="text-[100px] font-anton font-bold text-white leading-[0.75] tracking-tighter uppercase mb-4 drop-shadow-2xl">
                    NEW<br />
                    <span className="text-lime-500 italic">VIBE.</span>
                  </h1>
                  <p className="text-white/60 text-lg font-medium max-w-sm leading-relaxed italic">
                    &quot;Unlock exclusive access to the city&apos;s most prestigious dining destinations.&quot;
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-12">
                  <div className="flex flex-col text-right ml-auto">
                    <span className="text-[10px] font-anton text-lime-500 uppercase tracking-widest mb-2 text-right">Privacy Priority</span>
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-white/80 font-medium tracking-tight">GDPR Compliant</span>
                      <ShieldCheck className="w-5 h-5 text-white/80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Column (Form on Register) - Refined Form with Glassmorphism */}
            <div className="flex-1 flex flex-col bg-white/30 backdrop-blur-xl relative overflow-y-auto max-h-screen custom-scrollbar overflow-hidden z-10 border-r border-white/20">
              {/* Mobile Header Image Overlay */}
              <div className="lg:hidden h-40 md:h-60 relative overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop"
                  alt="Healthy Food Mobile"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-8">
                  <h2 className="text-4xl font-anton text-black font-bold uppercase tracking-tighter leading-none">JOIN US</h2>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center px-8 py-8 md:px-16 md:py-12 max-w-xl mx-auto w-full">
                <div className="hidden lg:block mb-8">
                  <div className="text-[10px] text-lime-600 font-anton font-bold uppercase tracking-[0.4em] mb-4 flex items-center">
                    <span className="w-8 h-px bg-lime-500 mr-3" />
                    Creation Portal
                  </div>
                  <h2 className="text-5xl font-anton font-bold text-black uppercase tracking-tighter leading-none mb-4">SIGN <span className="text-gray-200">UP</span></h2>
                  <p className="text-gray-400 font-medium italic">Join thousands of food enthusiasts today.</p>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100 relative group">
                  <RegisterForm onBack={handleBack} onSuccess={handleSuccess} />
                </div>

                <div className="mt-8 text-center lg:text-left flex flex-col gap-4">
                  <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <span className="text-[9px] font-anton text-gray-300 uppercase tracking-widest">Eatzy Membership Program</span>
                    <div className="h-px flex-1 bg-gray-100" />
                  </div>
                </div>
              </div>

              {/* Footer Decoration */}
              <div className="mt-auto p-6 flex items-center justify-between text-[8px] text-gray-300 font-anton uppercase tracking-[0.3em] select-none">
                <span>Interface v4.0 Registration</span>
                <span>Eatzy culinary group © 2026</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

