import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, ChevronRight, ChevronLeft, AlertTriangle, Wallet } from '@repo/ui/icons';
import { SwipeToConfirm } from '@repo/ui';
import { mockWallet } from '../data/mockWallet';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function WithdrawModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: (amount: number) => void }) {
  const [step, setStep] = useState<'input' | 'confirm'>('input');
  const [amountStr, setAmountStr] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Reset state on open
  useMemo(() => {
    if (isOpen) {
      setStep('input');
      setAmountStr('');
      setIsProcessing(false);
      setIsCompleted(false);
    }
  }, [isOpen]);

  const maxAmount = mockWallet.balance.available;

  const handleNext = () => {
    const val = parseInt(amountStr.replace(/\D/g, ''), 10);
    if (!val || val < 50000) return; // Min 50k
    if (val > maxAmount) return;
    setStep('confirm');
  };

  const handleSwipeComplete = () => {
    setIsProcessing(true);
    setIsCompleted(true);
    setTimeout(() => {
      onConfirm(parseInt(amountStr.replace(/\D/g, ''), 10));
      onClose();
    }, 1500);
  };

  const currentAmount = parseInt(amountStr.replace(/\D/g, ''), 10) || 0;
  const isValid = currentAmount >= 50000 && currentAmount <= maxAmount;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
              <div>
                <h3 className="text-3xl font-bold font-anton uppercase text-[#1A1A1A]">Withdraw Funds</h3>
                <p className="text-sm text-gray-500">Fast payouts to your linked bank account</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                {step === 'input' ? (
                  <motion.div
                    key="step-input"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Balance Info */}
                    <div className="bg-gray-100 rounded-3xl p-4 flex justify-between items-center border-2 border-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <Wallet className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Available Balance</div>
                          <div className="text-lg font-bold text-[#1A1A1A]">{formatCurrency(maxAmount)}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setAmountStr(new Intl.NumberFormat('vi-VN').format(maxAmount))}
                        className="h-9 px-4 flex items-center gap-1.5 rounded-xl bg-white border border-gray-200 shadow-sm text-xs font-bold text-gray-900 hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all"
                      >
                        <span className="text-amber-500">⚡</span>
                        WITHDRAW ALL
                      </button>
                    </div>

                    {/* Input Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Amount to withdraw</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₫</span>
                        <input
                          type="text"
                          value={amountStr}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, '');
                            if (!rawValue) {
                              setAmountStr('');
                              return;
                            }
                            const formatted = new Intl.NumberFormat('vi-VN').format(parseInt(rawValue, 10));
                            setAmountStr(formatted);
                          }}
                          placeholder="0"
                          className="w-full pl-12 pr-4 py-4 text-3xl font-bold text-[#1A1A1A] bg-white border-4 border-gray-100 rounded-3xl focus:ring-4 focus:ring-[var(--primary)]/10 transition-all outline-none placeholder:text-gray-200"
                          autoFocus
                        />
                      </div>
                      {currentAmount > maxAmount && (
                        <div className="text-red-500 text-sm font-medium flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-4 h-4" />
                          Insufficient balance
                        </div>
                      )}
                      {currentAmount > 0 && currentAmount < 50000 && (
                        <div className="text-orange-500 text-sm font-medium flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-4 h-4" />
                          Minimum withdrawal is 50,000đ
                        </div>
                      )}
                    </div>

                    {/* Bank Selection (Mock) */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">To Bank Account</label>
                      <div className="p-4 border-2 border-gray-200 rounded-3xl flex items-center gap-4 hover:border-blue-500 cursor-pointer transition-colors bg-white group">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                          <span className="font-bold text-xs">VCB</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-800 flex items-center gap-2">
                            Vietcombank
                            <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded font-bold">VERIFIED</span>
                          </div>
                          <div className="text-sm text-gray-500 font-mono">**** **** **** 9988</div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-blue-500 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={!isValid}
                      onClick={handleNext}
                      className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl font-semibold font-anton text-3xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:opacity-70 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                    >
                      NEXT STEP <ChevronRight className="w-8 h-8" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6 pt-4"
                  >
                    <div className="text-center space-y-2 mb-8">
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">Total Withdrawal</div>
                      <div className="text-5xl font-anton text-[#1A1A1A] tracking-tight">
                        {formatCurrency(currentAmount)}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">To Account</span>
                        <span className="font-medium text-gray-900">Vietcombank •••• 9988</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fee</span>
                        <span className="font-medium text-gray-900">0đ (Free)</span>
                      </div>
                      <div className="border-t border-gray-200 my-2 pt-2 flex justify-between">
                        <span className="text-gray-500">Estimated Arrival</span>
                        <span className="font-bold text-green-600">Instantly</span>
                      </div>
                    </div>

                    <div className="py-4">
                      <div className="flex items-center justify-center">
                        <SwipeToConfirm
                          text={isCompleted ? "Processing..." : "Swipe to withdraw"}
                          onComplete={handleSwipeComplete}
                          disabled={isProcessing || isCompleted}
                          isLoading={isProcessing}
                        />
                      </div>
                      <p className="text-center text-xs text-gray-400 mt-4">
                        By swiping, you agree to the Terms of Service.
                      </p>
                    </div>

                    {!isProcessing && !isCompleted && (
                      <button
                        onClick={() => setStep('input')}
                        className="w-full py-3 text-gray-500 hover:text-gray-800 font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Back to change amount
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
