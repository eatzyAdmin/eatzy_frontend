"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, CheckCircle2, AlertCircle, Clock, ArrowUpRight, ArrowDownLeft, DollarSign } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import { WalletTransaction } from "../data/mockWalletData";

export default function TransactionDetailDrawer({
  transaction,
  open,
  onClose,
}: {
  transaction: WalletTransaction | null;
  open: boolean;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);


  if (!transaction && !open) return null;

  const isPositive = transaction?.type === "EARNING" || transaction?.type === "TOP_UP";

  // Mock specific details based on type
  const getDetails = (tx: WalletTransaction) => {
    switch (tx.type) {
      case 'WITHDRAWAL':
        return {
          title: "WITHDRAWAL DETAILS",
          items: [
            { label: "Bank Name", value: "Techcombank" },
            { label: "Account Number", value: "**** **** 8899" },
            { label: "Account Holder", value: "NGUYEN VAN A" },
            { label: "Fee", value: formatVnd(0), isCurrency: false },
          ]
        };
      case 'TOP_UP':
        return {
          title: "TOP UP DETAILS",
          items: [
            { label: "Method", value: "Momo Wallet" },
            { label: "Transaction Ref", value: "MOMO123456789" },
            { label: "Phone Number", value: "0909 *** 888" },
          ]
        };
      case 'ORDER_PAYMENT':
        return {
          title: "ORDER PAYMENT DEDUCTION",
          items: [
            { label: "Order ID", value: tx.referenceId || "N/A" },
            { label: "Type", value: "Upfront Payment (Cash Order)" },
            { label: "Balance Deduction", value: formatVnd(Math.abs(tx.amount)) },
          ]
        };
      default:
        return {
          title: "TRANSACTION DETAILS",
          items: []
        };
    }
  };

  const details = transaction ? getDetails(transaction) : { title: "", items: [] };

  return (
    <AnimatePresence>
      {open && transaction && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 18, stiffness: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[32px] overflow-hidden max-h-[90vh] flex flex-col"
          >
            {isLoading ? (
              <div className="p-8 space-y-6">
                <div className="h-8 w-1/2 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
                <div className="h-32 bg-gray-50 rounded-2xl animate-pulse" />
                <div className="space-y-3">
                  <div className="h-10 bg-gray-50 rounded-xl animate-pulse" />
                  <div className="h-10 bg-gray-50 rounded-xl animate-pulse" />
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div>
                    <h2 className="text-2xl font-bold font-anton text-[#1A1A1A] uppercase">{details.title}</h2>
                    <p className="text-gray-500 text-sm">#{transaction.id.split('-')[1]} • {new Date(transaction.timestamp).toLocaleDateString("vi-VN")}</p>
                  </div>
                  <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-6 space-y-8 pb-32">

                  {/* Stats Row */}
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                    <div className="text-center flex-1 border-r border-gray-200 last:border-0">
                      <div className="text-xs text-gray-500 mb-1">Giờ</div>
                      <div className="text-lg font-bold text-[#1A1A1A] font-anton">
                        {new Date(transaction.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="text-center flex-1 border-r border-gray-200 last:border-0">
                      <div className="text-xs text-gray-500 mb-1">Ngày</div>
                      <div className="text-lg font-bold text-[#1A1A1A] font-anton">
                        {new Date(transaction.timestamp).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                      </div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-xs text-gray-500 mb-1">Loại</div>
                      <div className="text-xs font-bold text-[#1A1A1A] font-anton uppercase truncate px-1">
                        {transaction.type === 'EARNING' ? 'Thu nhập' :
                          transaction.type === 'WITHDRAWAL' ? 'Rút tiền' :
                            transaction.type === 'TOP_UP' ? 'Nạp tiền' : 'Thanh toán'}
                      </div>
                    </div>
                  </div>

                  {/* Amount Section */}
                  <div className="bg-white rounded-[24px] p-5 shadow-sm border-2 border-gray-200 text-center relative overflow-hidden">
                    <div className="py-2">
                      <div className="mb-3">
                        {transaction.type === 'WITHDRAWAL' && <ArrowUpRight className="w-10 h-10 text-red-500 mx-auto bg-red-50 rounded-full p-2" />}
                        {transaction.type === 'TOP_UP' && <ArrowDownLeft className="w-10 h-10 text-green-500 mx-auto bg-green-50 rounded-full p-2" />}
                        {transaction.type === 'ORDER_PAYMENT' && <DollarSign className="w-10 h-10 text-purple-500 mx-auto bg-purple-50 rounded-full p-2" />}
                        {transaction.type === 'EARNING' && <DollarSign className="w-10 h-10 text-[var(--primary)] mx-auto bg-yellow-50 rounded-full p-2" />}
                      </div>

                      <p className={`text-4xl font-bold font-anton ${isPositive ? 'text-[var(--primary)]' : 'text-[#1A1A1A]'}`}>
                        {isPositive ? '+' : '-'}{formatVnd(Math.abs(transaction.amount))}
                      </p>

                      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                        {transaction.status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />}
                        {transaction.status === 'PENDING' && <Clock className="w-3.5 h-3.5 text-orange-600" />}
                        {transaction.status === 'FAILED' && <AlertCircle className="w-3.5 h-3.5 text-red-600" />}
                        <span className="uppercase">{transaction.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Info Details */}
                  {details.items.length > 0 && (
                    <div className="bg-white rounded-[24px] p-5 shadow-sm border-2 border-gray-200">
                      <h3 className="text-lg font-bold font-anton text-[#1A1A1A] mb-4">DETAILS</h3>
                      <div className="space-y-1">
                        {details.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm p-1">
                            <span className="font-bold text-gray-500">{item.label}</span>
                            <span className="font-bold text-[#1A1A1A]">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description Box */}
                  <div className="bg-white rounded-[24px] p-5 shadow-sm border-2 border-gray-200">
                    <h3 className="text-lg font-bold font-anton text-[#1A1A1A] mb-4">DESCRIPTION</h3>
                    <p className="text-sm pl-2 font-medium text-gray-600 leading-relaxed">
                      {transaction.description}.
                      {transaction.status === 'PENDING' && " This transaction is currently being processed by the system."}
                      {transaction.status === 'COMPLETED' && " The transaction has been successfully completed."}
                    </p>
                  </div>

                  {/* Footer Info */}
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Transaction ID: <span className="font-mono text-gray-600">{transaction.id}</span></p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
