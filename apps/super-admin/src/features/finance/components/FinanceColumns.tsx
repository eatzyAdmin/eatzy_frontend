import React from 'react';
import { Wallet, User, Calendar, CheckCircle2, Clock, AlertCircle, Info, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { WalletTransactionResponse, WalletTransactionStatus } from '@repo/types';
import { format } from 'date-fns';

export const getTransactionTypeStyle = (type: string) => {
  const isCredit = ['DEPOSIT', 'REFUND', 'DELIVERY_EARNING', 'RESTAURANT_EARNING', 'EARNING', 'TOP_UP'].includes(type);
  return {
    isCredit,
    color: isCredit ? 'text-lime-600 bg-lime-50 border-lime-100' : 'text-orange-600 bg-orange-50 border-orange-100',
    icon: isCredit ? <ArrowDownLeft size={14} className="stroke-[2.5]" /> : <ArrowUpRight size={14} className="stroke-[3]" />
  };
};

export const getStatusBadge = (status: WalletTransactionStatus) => {
  switch (status) {
    case 'SUCCESS':
    case 'COMPLETED':
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit bg-lime-100 text-lime-600 border border-lime-100/50">
          <CheckCircle2 size={12} strokeWidth={3.2} />
          Success
        </span>
      );
    case 'PENDING':
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit bg-amber-100 text-amber-600 border border-amber-100/50">
          <Clock size={12} strokeWidth={3.2} className="animate-pulse" />
          Pending
        </span>
      );
    case 'FAILED':
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit bg-red-100 text-red-600 border border-red-100/50">
          <AlertCircle size={12} strokeWidth={3.2} />
          Failed
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit bg-gray-100 text-gray-400 border border-gray-100/50">
          <Info size={10} />
          {status}
        </span>
      );
  }
};

export const getFinanceColumns = () => {
  return [
    {
      label: 'TRANSACTION & ENTITY',
      key: 'id',
      formatter: (_: any, tx: WalletTransactionResponse) => {
        const typeStyle = getTransactionTypeStyle(tx.transactionType as string);
        return (
          <div className="flex items-center gap-4 py-3 group/info">
            <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm border ${typeStyle.color}`}>
                <Wallet size={20} strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <div className="font-anton text-lg text-[#1A1A1A] uppercase tracking-tight leading-none mb-1 flex items-center gap-2">
                TX-{tx.id.toString().padStart(6, '0')}
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black border ${typeStyle.color}`}>
                  {tx.transactionType.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                <User size={10} /> {tx.wallet.user.name}
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="truncate max-w-[150px]">{tx.description}</span>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      label: 'FINANCIAL IMPACT',
      key: 'amount',
      formatter: (_: any, tx: WalletTransactionResponse) => {
        const typeStyle = getTransactionTypeStyle(tx.transactionType as string);
        return (
          <div className="py-2 flex items-center gap-6">
            <div className="flex flex-col">
              <div className={`flex items-center gap-1.5 mb-0.5 font-anton text-lg ${typeStyle.isCredit ? 'text-lime-600' : 'text-orange-600'}`}>
                {typeStyle.isCredit ? '+' : '-'}{new Intl.NumberFormat('vi-VN').format(tx.amount)}đ
              </div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Transaction Value</span>
            </div>

            <div className="h-8 w-px bg-gray-100" />

            <div className="flex flex-col">
              <span className="font-anton text-sm text-gray-900 mb-0.5">
                {new Intl.NumberFormat('vi-VN').format(tx.balanceAfter)}đ
              </span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Running Balance</span>
            </div>
          </div>
        )
      }
    },
    {
      label: 'TIMELINE',
      key: 'createdAt',
      formatter: (val: string) => {
        const date = new Date(val);
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center shadow-sm">
              <Calendar size={16} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-anton text-gray-900 uppercase tracking-tight">
                {format(date, 'MMM d, yyyy')}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {format(date, 'HH:mm:ss')}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      label: 'SETTLEMENT STATUS',
      key: 'status',
      formatter: (val: WalletTransactionStatus) => getStatusBadge(val)
    }
  ];
};
