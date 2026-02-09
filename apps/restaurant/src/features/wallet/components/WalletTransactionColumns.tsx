import React from 'react';
import { Utensils, Landmark, FileText, Clock, ArrowDownLeft, ArrowUpRight, CheckCircle, AlertCircle } from '@repo/ui/icons';
import type { WalletTransaction } from '@repo/types';

export const getWalletTransactionColumns = () => {
  return [
    {
      label: 'TRANSACTION ID',
      key: 'id',
      className: 'w-[140px]',
      formatter: (_: unknown, item: WalletTransaction) => (
        <span className="font-mono text-[12px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm uppercase tracking-tighter">
          #{item.id.includes('-') ? item.id.split('-')[1] : item.id}
        </span>
      )
    },
    {
      label: 'TYPE & DESCRIPTION',
      key: 'description',
      className: 'min-w-[280px]',
      formatter: (_: unknown, item: WalletTransaction) => {
        const isFoodOrder = item.category === 'Food Order';
        const isWithdrawal = item.category === 'Withdrawal';

        return (
          <div className="flex items-start gap-3 py-2">
            <div className={`mt-0.5 w-9 h-9 rounded-full flex items-center justify-center border shadow-sm shrink-0 ${isFoodOrder
              ? 'bg-lime-50 text-lime-600 border-lime-100'
              : isWithdrawal
                ? 'bg-red-50 text-red-600 border-red-100'
                : 'bg-gray-50 text-gray-500 border-gray-100'
              }`}>
              {isFoodOrder && <Utensils className="w-4 h-4" />}
              {isWithdrawal && <Landmark className="w-4 h-4" />}
              {!isFoodOrder && !isWithdrawal && <FileText className="w-4 h-4" />}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className={`text-[10px] uppercase tracking-widest font-bold ${isFoodOrder ? 'text-lime-600' : isWithdrawal ? 'text-red-600' : 'text-gray-400'
                }`}>
                {item.category}
              </span>
              <span className="font-bold text-gray-900 text-sm md:text-base font-heading line-clamp-1">{item.description}</span>
            </div>
          </div>
        );
      }
    },
    {
      label: 'DATE',
      key: 'date',
      className: 'min-w-[140px]',
      formatter: (_: unknown, item: WalletTransaction) => {
        const date = new Date(item.date);
        return (
          <div className="flex flex-col py-2">
            <span className="text-[#1A1A1A] font-bold text-[13px] uppercase tracking-tight">
              {date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <Clock className="w-3 h-3 text-gray-300" />
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-none">
                {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        )
      }
    },
    {
      label: 'AMOUNT',
      key: 'amount',
      className: 'min-w-[160px]',
      formatter: (_: unknown, item: WalletTransaction) => {
        const isPositive = item.amount > 0;
        return (
          <div className="flex items-center gap-3 py-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPositive ? 'bg-lime-100 text-lime-600' : 'bg-red-50 text-red-500'}`}>
              {isPositive ? <ArrowDownLeft className="w-4 h-4" strokeWidth={2.5} /> : <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />}
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-sm ${isPositive ? 'text-lime-600' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.amount)}
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide">
                Bal: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.balanceAfter)}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      label: 'STATUS',
      key: 'status',
      formatter: (_: unknown, item: WalletTransaction) => {
        const isSuccess = item.status === 'success';
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border tracking-wide shadow-sm ${isSuccess
            ? 'bg-lime-100 text-lime-700 border-lime-200'
            : 'bg-red-100 text-red-700 border-red-200'
            }`}>
            {isSuccess ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            {isSuccess ? 'Thành công' : 'Thất bại'}
          </span>
        )
      }
    }
  ];
};
