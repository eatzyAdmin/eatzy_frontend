"use client";

import { motion } from "@repo/ui/motion";
import { HelpCircle, MessageSquare, Phone, ChevronRight, Search, ArrowRight, Play } from "@repo/ui/icons";

export default function HelpCenterSection() {
  const faqs = [
    { q: "How to redeem rewards from points?", a: "Go to 'Rewards' in the main menu, select the reward you want and redeem the voucher code.", id: "01" },
    { q: "Can I cancel my order?", a: "If the order hasn't been confirmed by the restaurant, you can cancel it in the order details.", id: "02" },
    { q: "What is the average delivery time?", a: "Under 30 minutes from the time the dish is completed by the kitchen.", id: "03" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <HelpCircle size={12} />
            Support & FAQ
          </span>
        </div>
        <h2 className="text-[56px] font-bold leading-none text-[#1A1A1A] uppercase" style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>
          RESOURCES
        </h2>
        <p className="text-gray-500 font-medium">We are always ready to support you 24/7</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FAQs Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative mb-8 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-lime-500 transition-colors" />
            <input
              type="text"
              placeholder="How can we help you?"
              className="w-full py-5 pl-14 pr-6 bg-slate-50 border-2 border-transparent focus:border-lime-500/20 rounded-[28px] text-lg font-bold font-anton uppercase tracking-tight text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.03)]"
            />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="group p-6 bg-white border border-gray-100 rounded-[32px] hover:border-lime-500/30 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="flex items-start gap-6">
                  <div className="text-4xl font-anton text-slate-100 group-hover:text-lime-500/20 transition-colors shrink-0">{faq.id}</div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold uppercase tracking-tight text-[#1A1A1A] group-hover:text-lime-600 transition-colors mb-2" style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>{faq.q}</h4>
                    <p className="text-gray-500 font-medium leading-relaxed max-w-xl opacity-0 group-hover:opacity-100 transition-all duration-500 h-0 group-hover:h-auto overflow-hidden">
                      {faq.a}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-gray-400 group-hover:bg-[#1A1A1A] group-hover:text-lime-500 transition-all transform group-hover:rotate-90">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Options */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1A1A1A] p-10 rounded-[40px] text-white relative overflow-hidden flex flex-col justify-between h-[380px] shadow-2xl group cursor-pointer hover:scale-[1.02] transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-lime-500/20 transition-all" />

            <div className="flex justify-between items-start relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <MessageSquare className="w-7 h-7 text-lime-400" />
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Live Chat</span>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-anton uppercase leading-none tracking-tight mb-4">Live Chat</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">Connect now with our customer care team for answers to your questions.</p>
            </div>

            <button className="relative z-10 w-full py-5 bg-lime-500 text-black font-anton text-base uppercase tracking-widest rounded-2xl hover:bg-white transition-colors flex items-center justify-center gap-3 active:scale-95 group/btn">
              Start Support
              <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center group-hover/btn:bg-lime-500/20">
                <Play className="w-3 h-3 fill-current" />
              </div>
            </button>
          </div>

          <div className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 flex items-center gap-6 group cursor-pointer">
            <div className="w-14 h-14 bg-slate-50 text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-lime-500 group-hover:text-white transition-all">
              <Phone className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Hotline 24/7</span>
              <h4 className="text-2xl font-anton text-[#1A1A1A] uppercase leading-none tracking-tight">1900-EATZY-HQ</h4>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-200 group-hover:text-lime-500 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
