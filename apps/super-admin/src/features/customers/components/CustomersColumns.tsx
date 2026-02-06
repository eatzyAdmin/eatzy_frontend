import React from 'react';
import { Phone, MapPin, ShieldCheck, Lock } from 'lucide-react';
import { ImageWithFallback } from '@repo/ui';
import { ResCustomerProfileDTO } from '@repo/types';

export const getCustomersColumns = () => {
  return [
    {
      label: 'CUSTOMER IDENTITY',
      key: 'user.name',
      formatter: (_: any, customer: ResCustomerProfileDTO) => (
        <div className="flex items-center gap-4 py-3 group/info pl-4">
          <div className="relative shrink-0 transition-transform duration-300 group-hover/info:scale-105">
            <div className="w-12 h-12 rounded-[20px] overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100 relative bg-gray-50">
              <ImageWithFallback
                src={customer.user.avatar || ''}
                alt={customer.user.name}
                fill
                className="object-cover"
              />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg border-2 border-white flex items-center justify-center shadow-sm
              ${customer.user.isActive ? 'bg-lime-500' : 'bg-gray-400'}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <div>
            <div className="font-anton text-[15px] text-[#1A1A1A] uppercase tracking-tight leading-none mb-1.5 flex items-center gap-2">
              {customer.user.name}
              <span className="text-[9px] font-mono text-gray-300 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                #{customer.user.id}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 px-2 py-0.5 rounded-md border border-gray-100/30">
                <Phone size={10} className="text-primary" />
                {customer.user.phoneNumber}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'LOCATION & BIO',
      key: 'hometown',
      formatter: (value: string) => (
        <div className="py-2">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <MapPin size={14} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-tight line-clamp-1">
              {value || 'Not specified'}
            </span>
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] leading-none opacity-60">
            Hometown Region
          </div>
        </div>
      )
    },
    {
      label: 'STATUS',
      key: 'user.isActive',
      formatter: (isActive: boolean) => (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${isActive
          ? 'bg-lime-100 text-lime-600 border border-lime-100'
          : 'bg-red-100 text-red-600 border border-red-100'
          }`}>
          {isActive ? (
            <>
              <ShieldCheck size={12} strokeWidth={3.2} />
              Active
            </>
          ) : (
            <>
              <Lock size={12} strokeWidth={3.2} />
              Disabled
            </>
          )}
        </span>
      )
    }
  ];
};
