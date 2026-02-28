"use client";

import { motion, AnimatePresence } from "@repo/ui/motion";
import { useRouter } from "next/navigation";
import { useZodForm, emailVerificationSchema, type EmailVerificationData } from "@repo/lib";
import { FloatingLabelInput, Button, ImageWithFallback } from "@repo/ui";
import { useState } from "react";
import { ArrowLeft, Mail, ShieldCheck } from "@repo/ui/icons";

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
        <div className="min-h-screen w-full bg-[#fafafa] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden selection:bg-lime-500 selection:text-black">
          <motion.div
            layoutId="auth-container"
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full md:h-auto max-w-[1440px] bg-white md:rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col lg:flex-row relative"
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

            {/* Left Column - Editorial Hero */}
            <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-black/20 z-10 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gray-900">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop"
                  alt="Coffee"
                  fill
                  className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-[2s] scale-110 hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
              </div>

              <div className="relative z-10 w-full p-16 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-4 mb-12">
                    <div className="px-4 py-1.5 bg-lime-500 text-black font-anton font-bold text-xs tracking-widest uppercase rounded-full">
                      Support Centre
                    </div>
                    <div className="h-px w-24 bg-white/20" />
                    <span className="text-[10px] text-white/40 font-anton uppercase tracking-[0.5em]">Account Recovery</span>
                  </div>

                  <h1 className="text-[100px] font-anton font-bold text-white leading-[0.75] tracking-tighter uppercase mb-6 drop-shadow-2xl">
                    RE<br />
                    <span className="text-lime-500 italic">SET.</span>
                  </h1>
                  <p className="text-white/60 text-xl font-medium max-w-sm leading-relaxed italic">
                    &quot;We&apos;ll help you get back to your culinary journey in just a few steps.&quot;
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-12">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-white/80" />
                    <span className="text-sm text-white/80 font-medium tracking-tight">Identity Protection</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Refined Form with Glassmorphism */}
            <div className="flex-1 flex flex-col bg-white/30 backdrop-blur-xl relative overflow-hidden z-10 border-l border-white/20">
              {/* Mobile Header Image Overlay */}
              <div className="lg:hidden h-40 md:h-60 relative overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop"
                  alt="Coffee Mobile"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-8">
                  <h2 className="text-4xl font-anton text-black font-bold uppercase tracking-tighter leading-none">RECOVERY</h2>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center px-8 py-12 md:px-16 md:py-20 max-w-xl mx-auto w-full">
                <div className="hidden lg:block mb-12">
                  <div className="text-[10px] text-lime-600 font-anton font-bold uppercase tracking-[0.4em] mb-4 flex items-center">
                    <span className="w-8 h-px bg-lime-500 mr-3" />
                    Security Access
                  </div>
                  <h2 className="text-6xl font-anton font-bold text-black uppercase tracking-tighter leading-none mb-4">LOST <span className="text-gray-200">KEY?</span></h2>
                  <p className="text-gray-400 font-medium italic">Enter your credentials to receive a recovery link.</p>
                </div>

                <div className="bg-white/70 backdrop-blur-md p-8 md:p-10 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-white/40 relative group">
                  {isSent ? (
                    <div className="space-y-6 text-center">
                      <div className="w-16 h-16 bg-lime-100 text-lime-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-anton text-black uppercase tracking-tight">Email Sent Successfully</h3>
                      <p className="text-gray-500 font-medium leading-relaxed">
                        Please check your inbox for instructions to reset your password.
                      </p>
                      <button
                        onClick={() => router.push("/login")}
                        className="w-full h-14 bg-black text-white font-anton text-base font-bold rounded-2xl hover:bg-gray-800 transition-all uppercase tracking-widest"
                      >
                        Back to Login
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-8">
                      <FloatingLabelInput
                        label="Email Address"
                        type="email"
                        error={form.formState.errors.email?.message}
                        {...form.register("email")}
                      />

                      <div className="flex flex-col gap-4">
                        <button
                          type="submit"
                          className="w-full h-14 bg-lime-500 text-black font-anton text-base font-bold rounded-2xl hover:bg-lime-400 transition-all uppercase tracking-widest shadow-lg shadow-lime-500/20"
                        >
                          Send Recovery Link
                        </button>
                        <button
                          type="button"
                          onClick={handleBack}
                          className="w-full h-14 border-4 border-gray-100 text-gray-400 font-anton text-base font-bold rounded-2xl hover:border-black hover:text-black transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                          <ArrowLeft size={16} />
                          <span>Go Back</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Footer Decoration */}
              <div className="mt-auto p-8 flex items-center justify-between text-[8px] text-gray-300 font-anton uppercase tracking-[0.3em] select-none">
                <span>Account security protocol v1.2</span>
                <span>Eatzy culinary group © 2026</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
