import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, CheckCircle, AlertCircle, Clock, Banknote, Landmark, FileText } from '@repo/ui/icons';
import { Transaction } from '../data/mockWallet';

interface WithdrawalDetailsModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.abs(amount));
};

export default function WithdrawalDetailsModal({ transaction, onClose }: WithdrawalDetailsModalProps) {
  // Mock bank info since it's not fully in the transaction object yet, or use what's available
  // In a real app, this would come from the transaction details API
  const bankInfo = {
    bankName: 'Vietcombank',
    accountNumber: '**** **** **** 9988',
    holderName: 'BURGER PRINCE STORE',
    branch: 'Ho Chi Minh City'
  };

  return (
    <AnimatePresence>
      {transaction && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[80]"
          />

          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-[#F8F9FA] w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-[90vh] border border-white/20"
            >
              {/* Header */}
              <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm/50">
                <div>
                  <h3 className="text-2xl font-anton font-bold text-[#1A1A1A]">WITHDRAWAL DETAILS</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-gray-400">ID:</span>
                    <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-mono">{transaction.id}</span>
                    <span className="text-gray-300 mx-1">|</span>
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {(() => {
                    const config = {
                      success: { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-200', icon: CheckCircle, label: 'Success' },
                      failed: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: AlertCircle, label: 'Failed' },
                      pending: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', icon: Clock, label: 'Processing' },
                    }[transaction.status] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: Clock, label: transaction.status };

                    const Icon = config.icon;

                    return (
                      <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm border flex items-center gap-2 ${config.bg} ${config.text} ${config.border}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {config.label}
                      </div>
                    );
                  })()}
                  <button
                    onClick={onClose}
                    className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-700 hover:bg-gray-200 transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar pb-10">

                {/* Amount Card */}
                <div className="bg-white rounded-[32px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
                    <Banknote className="w-6 h-6 text-red-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Withdrawal Amount</span>
                  <span className="font-anton text-4xl text-gray-900 mt-1">{formatCurrency(transaction.amount)}</span>
                </div>

                {/* Bank Info Card */}
                <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                  <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
                    <Landmark className="w-5 h-5 text-gray-400" />
                    <h4 className="font-bold text-[#1A1A1A]">Destination Account</h4>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-900/5 flex items-center justify-center border border-gray-100">
                        <span className="font-bold text-green-700 text-xs">VCB</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gray-900 text-lg">{bankInfo.bankName}</span>
                          <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200">VERIFIED</span>
                        </div>
                        <div className="text-sm text-gray-500 font-medium mb-0.5">{bankInfo.holderName}</div>
                        <div className="text-sm font-mono text-gray-900 font-bold tracking-wide">{bankInfo.accountNumber}</div>
                        <div className="text-xs text-gray-400 mt-1">{bankInfo.branch}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline / Process */}
                <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                  <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <h4 className="font-bold text-[#1A1A1A]">Transaction Timeline</h4>
                  </div>
                  <div className="p-6">
                    <div className="relative pl-4 ml-2 border-l-2 border-dashed border-gray-200 space-y-8">
                      {/* Step 1 */}
                      <div className="relative">
                        <div className="absolute -left-[21px] top-0 w-3.5 h-3.5 rounded-full bg-lime-500 ring-4 ring-white shadow-sm" />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-lime-600 uppercase mb-0.5">Request Initiated</span>
                          <span className="text-gray-900 font-bold text-sm">Withdrawal Request Created</span>
                          <span className="text-xs text-gray-400 mt-0.5">
                            {new Date(transaction.date).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="relative">
                        <div className={`absolute -left-[21px] top-0 w-3.5 h-3.5 rounded-full ring-4 ring-white shadow-sm ${transaction.status === 'success' ? 'bg-lime-500' : 'bg-gray-300'}`} />
                        <div className="flex flex-col">
                          <span className={`text-xs font-bold uppercase mb-0.5 ${transaction.status === 'success' ? 'text-lime-600' : 'text-gray-400'}`}>Processing</span>
                          <span className="text-gray-900 font-bold text-sm">Bank Processing</span>
                          {transaction.status === 'success' && (
                            <span className="text-xs text-gray-400 mt-0.5">
                              {new Date(new Date(transaction.date).getTime() + 1000 * 60 * 30).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="relative">
                        <div className={`absolute -left-[21px] top-0 w-3.5 h-3.5 rounded-full ring-4 ring-white shadow-sm ${transaction.status === 'success' ? 'bg-lime-500' : transaction.status === 'failed' ? 'bg-red-500' : 'bg-gray-300'}`} />
                        <div className="flex flex-col">
                          <span className={`text-xs font-bold uppercase mb-0.5 ${transaction.status === 'success' ? 'text-lime-600' : transaction.status === 'failed' ? 'text-red-600' : 'text-gray-400'}`}>
                            {transaction.status === 'success' ? 'Completed' : transaction.status === 'failed' ? 'Failed' : 'Pending'}
                          </span>
                          <span className="text-gray-900 font-bold text-sm">
                            {transaction.status === 'success' ? 'Funds Transferred' : transaction.status === 'failed' ? 'Transaction Failed' : 'Waiting for Result'}
                          </span>
                          {transaction.status === 'success' && (
                            <span className="text-xs text-gray-400 mt-0.5">
                              {new Date(new Date(transaction.date).getTime() + 1000 * 60 * 45).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="bg-gray-50 rounded-[20px] p-4 flex items-start gap-3 border border-gray-100">
                  <AlertCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Please note that bank transfers may take up to 24 hours to appear in your account depending on banking hours and holidays. If you have any issues, please contact support with Transaction ID <strong>{transaction.id}</strong>.
                  </p>
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
