"use client";

import { motion, AnimatePresence } from "@repo/ui/motion";
import { useRouter } from "next/navigation";
import { useZodForm, emailVerificationSchema, type EmailVerificationData } from "@repo/lib";
import { ImageWithFallback } from "@repo/ui";
import { useState } from "react";
import { ArrowLeft, Mail, ShieldCheck, ChevronRight } from "@repo/ui/icons";
import AuthInput from "@/features/auth/components/AuthInput";

export default function ForgotPasswordPageContent({ isOpen }: { isOpen: boolean }) {
  const router = useRouter();
  const [isSent, setIsSent] = useState(false);

  const form = useZodForm<EmailVerificationData>({
    schema: emailVerificationSchema,
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const handleBack = () => {
    router.back();
  };

  const onSubmit = (data: EmailVerificationData) => {
    setIsSent(Boolean(data.email));
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
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop"
                    alt="Recovery"
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
                        Account Recovery
                      </div>
                      <div className="h-px w-24 bg-white/20" />
                      <span className="text-[10px] text-white/40 font-anton uppercase tracking-[0.5em]">Identity Protection</span>
                    </div>

                    <h1 className="text-[140px] font-anton font-bold text-white leading-[0.75] tracking-tighter uppercase mb-6 drop-shadow-2xl">
                      RE<br />
                      <span className="text-lime-500 italic">SET.</span>
                    </h1>
                    <p className="text-white/60 text-xl font-medium max-w-sm leading-relaxed italic">
                      &quot;We&apos;ll help you get back to your culinary journey in just a few steps.&quot;
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-12">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-anton text-lime-500 uppercase tracking-widest mb-2">Secure Verification</span>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-white/80" />
                        <span className="text-sm text-white/80 font-medium tracking-tight">Verified Encryption</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-white/30 font-anton uppercase tracking-[0.4em] rotate-180" style={{ writingMode: 'vertical-rl' }}>
                      Premium Support
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
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop"
                  alt="Recovery Mobile"
                  fill
                  placeholderMode="horizontal"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/20 to-transparent" />
                <div className="absolute bottom-6 left-8">
                  <h2 className="text-5xl font-anton text-black font-bold uppercase tracking-tighter leading-none">RECOVERY</h2>
                  <p className="text-gray-500 text-sm font-medium mt-1">Regain access to your account</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-8">
                <div className="max-w-xl w-full mx-auto">
                    {/* Header for Desktop */}
                    {!isSent && (
                        <div className="hidden lg:block mt-10 mb-3">
                            <h2 className="text-6xl font-anton font-bold text-black uppercase tracking-tighter leading-none mb-4">LOST <span className="text-gray-200">KEY?</span></h2>
                            <p className="text-gray-400 font-medium italic">Enter your credentials to receive a recovery link.</p>
                        </div>
                    )}

                  <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-[0_15px_50px_rgba(0,0,0,0.02)] border border-gray-100 relative group overflow-y-auto max-h-[70vh] no-scrollbar">
                    {isSent ? (
                        <div className="space-y-8 text-center py-4">
                            <div className="w-20 h-20 bg-lime-50 text-lime-600 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Mail className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-black tracking-tight mb-3">Check your inbox</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    We&apos;ve sent a recovery link to your email address. It may take a few minutes to arrive.
                                </p>
                            </div>
                            <div className="pt-4">
                                <button
                                    onClick={() => router.push("/login")}
                                    className="w-full h-14 bg-[#1A1A1A] text-white font-bold rounded-[22px] hover:bg-black hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 shadow-xl flex items-center justify-center gap-3"
                                >
                                    <span className="tracking-tight text-lg">Back to Login</span>
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
                            <AuthInput
                                label="Email Address"
                                type="email"
                                placeholder="name@example.com"
                                error={form.formState.errors.email?.message}
                                {...form.register("email")}
                            />

                            <div className="pt-2 flex flex-col gap-4">
                                <button
                                    type="submit"
                                    disabled={!form.formState.isValid}
                                    className={`w-full h-14 rounded-[22px] font-bold transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] ${
                                        !form.formState.isValid
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                        : "bg-[#1A1A1A] text-white hover:bg-black hover:scale-[1.01] hover:shadow-xl hover:shadow-black/10 shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
                                    }`}
                                >
                                    <span className="tracking-tight text-lg">Send Recovery Link</span>
                                    <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${!form.formState.isValid ? 'opacity-30' : 'group-hover:translate-x-1'}`} />
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="w-full h-14 rounded-[22px] font-bold text-gray-400 hover:text-black hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 group"
                                >
                                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                                    <span className="tracking-tight">Go Back</span>
                                </button>
                            </div>
                        </form>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Decoration */}
              <div className="mt-auto p-8 flex items-center justify-between text-[10px] text-gray-300 font-anton uppercase tracking-[0.3em] select-none">
                <span>Account Recovery Protocol v4.0</span>
                <span>Eatzy culinary group © 2026</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
