"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ArrowLeft, ShieldCheck } from "@repo/ui/icons";
import { ImageWithFallback } from "@repo/ui";
import RegisterForm from "@/components/auth/RegisterForm";

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
        <div className="h-screen w-full bg-[#fafafa] flex items-center justify-center overflow-hidden selection:bg-lime-500 selection:text-black">
          <motion.div
            layoutId="auth-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full bg-[#fafafa] flex flex-col lg:flex-row relative"
          >
            {/* Left Column - Editorial Hero (Recessed with padding and rounding) */}
            <div className="hidden lg:flex w-[49%] p-2 h-full z-10 relative">
              <div className="w-full h-full relative rounded-[16px] overflow-hidden bg-gray-900 border border-gray-100/10">
                {/* Background Image and Filters */}
                <div className="absolute inset-0">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop"
                    alt="Fresh Food"
                    fill
                    placeholderMode="horizontal"
                    className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-[2s] scale-110 hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                </div>

                {/* Text Content */}
                <div className="relative z-10 w-full p-16 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-4 mb-12">
                      <div className="px-4 py-1.5 bg-lime-500 text-black font-anton font-bold text-xs tracking-widest uppercase rounded-full">
                        New Member
                      </div>
                      <div className="h-px w-24 bg-white/20" />
                      <span className="text-[10px] text-white/40 font-anton uppercase tracking-[0.5em]">Exclusive Network</span>
                    </div>

                    <h1 className="text-[140px] font-anton font-bold text-white leading-[0.75] tracking-tighter uppercase mb-6 drop-shadow-2xl">
                      JOIN<br />
                      <span className="text-lime-500 italic">CLUB.</span>
                    </h1>
                    <p className="text-white/60 text-xl font-medium max-w-sm leading-relaxed italic">
                      &quot;Embark on a culinary journey designed for the modern enthusiast.&quot;
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-12">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-lime-500 uppercase tracking-[0.2em] mb-4">Already a member?</span>
                      <button 
                        onClick={() => router.push("/login")}
                        className="flex items-center gap-4 group transition-all"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-lime-500 transition-all duration-500 shadow-xl border border-white/5">
                          <ArrowLeft className="w-6 h-6 text-white group-hover:text-black transition-colors" />
                        </div>
                        <span className="text-xl text-white font-black tracking-tight border-b-2 border-white/20 group-hover:border-lime-500 group-hover:text-lime-500 transition-all duration-500">Sign in to account</span>
                      </button>
                    </div>
                    <div className="text-[10px] text-white/30 font-anton uppercase tracking-[0.4em] rotate-180" style={{ writingMode: 'vertical-rl' }}>
                      Premium Access
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form Area (Centered and non-scrolling) */}
            <div className="flex-1 flex flex-col h-full bg-[#fafafa] relative overflow-hidden z-10">
              {/* Mobile Header Image Overlay */}
              <div className="lg:hidden h-64 md:h-80 relative overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop"
                  alt="Fresh Food Mobile"
                  fill
                  placeholderMode="horizontal"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/20 to-transparent" />
                <div className="absolute bottom-6 left-8">
                  <h2 className="text-5xl font-anton text-black font-bold uppercase tracking-tighter leading-none">SIGN UP</h2>
                  <p className="text-gray-500 text-sm font-medium mt-1">Start your Eatzy experience</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-0 pb-4">
                <div className="max-w-xl w-full mx-auto">
                  <div className="hidden lg:block mt-10 mb-3">
                    <h2 className="text-6xl font-anton font-bold text-black uppercase tracking-tighter leading-none mb-4">SIGN UP <span className="text-gray-200">NOW</span></h2>
                    <p className="text-gray-400 font-medium italic">Join our network of curated dining destinations.</p>
                  </div>

                  <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-[0_15px_50px_rgba(0,0,0,0.02)] border border-gray-100 relative group overflow-y-auto max-h-[85vh] no-scrollbar">
                    <RegisterForm onBack={handleBack} onSuccess={handleSuccess} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

