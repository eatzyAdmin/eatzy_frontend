import React from 'react';
import { User, Clock, CreditCard, RotateCcw, CheckCircle, AlertCircle, Bike } from '@repo/ui/icons';
import { OrderHistoryItem } from '@repo/types';

export const getOrderHistoryColumns = () => {
  return [
    {
      label: 'ORDER ID',
      key: 'id',
      className: 'w-[140px]',
      formatter: (_: any, item: OrderHistoryItem) => (
        <span className="font-mono text-[12px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm uppercase tracking-tighter">
          #{item.id.replace('ORD-', '')}
        </span>
      )
    },
    {
      label: 'CUSTOMER',
      key: 'customerName',
      className: 'min-w-[220px]',
      formatter: (_: any, item: OrderHistoryItem) => (
        <div className="flex items-center gap-4 py-2">
          <div className="w-10 h-10 rounded-2xl bg-lime-50 border border-lime-100 shadow-sm flex items-center justify-center text-lime-500 overflow-hidden group-hover:scale-105 transition-transform">
            {item.customerAvatar ? (
              <img src={item.customerAvatar} alt={item.customerName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#1A1A1A] text-[13px] tracking-tight leading-tight">{item.customerName}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{item.customerPhone}</span>
          </div>
        </div>
      )
    },
    {
      label: 'ITEMS',
      key: 'itemsCount',
      className: 'max-w-[350px]',
      formatter: (_: any, item: OrderHistoryItem) => (
        <div className="flex flex-col gap-1 py-2">
          <div className="w-full truncate" title={item.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}>
            {item.items.map((i, idx) => (
              <div key={idx} className="inline-flex items-center gap-1.5 mr-3 align-middle">
                <span className="flex-shrink-0 min-w-[32px] h-8 px-2 rounded-xl bg-lime-50 text-lime-700 font-bold text-xs flex items-center justify-center border border-lime-100 shadow-sm">
                  {i.quantity}x
                </span>
                <span className="text-sm text-gray-700 font-bold whitespace-nowrap">
                  {i.name}{idx < item.items.length - 1 ? ',' : ''}
                </span>
              </div>
            ))}
          </div>
          <span className="text-[10px] text-gray-400 font-medium tracking-wide leading-none uppercase tracking-widest mt-1">
            {item.itemsCount} items total
          </span>
        </div>
      )
    },
    {
      label: 'DATE',
      key: 'createdAt',
      className: 'min-w-[160px]',
      formatter: (_: any, item: OrderHistoryItem) => {
        const date = new Date(item.createdAt);
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
      label: 'TOTAL',
      key: 'totalAmount',
      className: 'min-w-[140px]',
      formatter: (_: any, item: OrderHistoryItem) => (
        <div className="flex flex-col py-2">
          <span className="font-bold text-[#1A1A1A] text-sm tracking-tighter">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalAmount)}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="px-1.5 py-0.5 rounded-md bg-gray-50 border border-gray-100 flex items-center gap-1">
              <CreditCard className="w-2.5 h-2.5 text-gray-400" />
              <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">{item.paymentMethod}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'STATUS',
      key: 'status',
      formatter: (_: any, item: OrderHistoryItem) => {
        const statusKey = item.status.toUpperCase();
        const config: any = {
          PENDING: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', icon: Clock, label: 'Chờ xử lý' },
          PREPARING: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: RotateCcw, label: 'Đang chuẩn bị' },
          READY: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', icon: CheckCircle, label: 'Chờ giao hàng' },
          DRIVER_ASSIGNED: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200', icon: User, label: 'Đã có tài xế' },
          PICKED_UP: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200', icon: Bike, label: 'Đang giao hàng' },
          ARRIVED: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle, label: 'Đã đến nơi' },
          DELIVERED: { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-200', icon: CheckCircle, label: 'Hoàn thành' },
          COMPLETED: { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-200', icon: CheckCircle, label: 'Hoàn thành' },
          REJECTED: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: AlertCircle, label: 'Đã hủy' },
          CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: AlertCircle, label: 'Đã hủy' },
          REFUNDED: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', icon: RotateCcw, label: 'Đã hoàn tiền' },
        }[statusKey] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: Clock, label: statusKey };

        const Icon = config.icon || Clock;

        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border tracking-wide shadow-sm ${config.bg} ${config.text} ${config.border}`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
          </span>
        )
      }
    }
  ];
};
