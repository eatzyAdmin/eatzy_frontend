import React from 'react';
import { ExternalLink, MapPin, Phone, Star, ShieldCheck, Lock } from 'lucide-react';
import { ImageWithFallback } from '@repo/ui';
import { Restaurant } from '@repo/types';

export const getRestaurantsColumns = () => {
  return [
    {
      label: 'RESTAURANT INFO',
      key: 'name',
      formatter: (_: any, r: Restaurant) => {
        return (
          <div className="flex items-center gap-4 py-2">
            <div className="relative group/avatar">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden shadow-lg shadow-black/5 border border-gray-100 transition-transform group-hover/avatar:scale-105 duration-300">
                <ImageWithFallback
                  src={r.avatarUrl || ''}
                  alt={r.name}
                  fill
                  className="object-cover rounded-[inherit]"
                  containerClassName="rounded-[inherit]"
                />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${r.status === 'OPEN' ? 'bg-lime-500' : 'bg-gray-400'}`} />
            </div>
            <div>
              <div className="font-anton text-lg text-[#1A1A1A] uppercase tracking-tight leading-none mb-1 flex items-center gap-2">
                {r.name}
                {r.slug && (
                  <a href={`/restaurant/${r.slug}`} target="_blank" className="text-gray-300 hover:text-primary transition-colors" rel="noreferrer">
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                ID: {r.id} <span className="text-gray-200">|</span> Owner: {r.owner?.name || 'Admin'}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      label: 'LOCATION & CONTACT',
      key: 'address',
      formatter: (_: any, r: Restaurant) => (
        <div className="py-2 flex flex-col gap-1.5 max-w-[200px]">
          <div className="flex items-start gap-2 text-gray-500">
            <MapPin size={12} className="mt-0.5 text-gray-400 shrink-0" />
            <span className="text-xs font-semibold line-clamp-1">{r.address}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={12} className="text-gray-400 shrink-0" />
            <span className="text-[13px] font-anton tracking-tight">{r.contactPhone || 'N/A'}</span>
          </div>
        </div>
      )
    },
    {
      label: 'PERFORMANCE',
      key: 'averageRating',
      formatter: (_: any, r: Restaurant) => {
        const rating = r.averageRating || 0;
        const reviews = r.reviewCount || 0;
        return (
          <div className="flex items-center gap-4 py-2">
            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl border border-amber-100 shadow-sm shrink-0">
              <Star size={14} fill="currentColor" strokeWidth={0} />
              <span className="text-lg font-anton leading-none mt-0.5">{rating.toFixed(1)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                {reviews} Reviews
              </span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <div key={s} className={`w-1.5 h-1.5 rounded-full ${s <= Math.round(rating) ? 'bg-amber-400' : 'bg-gray-100'}`} />
                ))}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      label: 'COMMISSION',
      key: 'commissionRate',
      formatter: (_: any, r: Restaurant) => (
        <div className="flex items-center gap-2">
          <div className="font-anton text-lg text-[#1A1A1A]">
            {Math.round(r.commissionRate || 0)}%
          </div>
        </div>
      )
    },
    {
      label: 'STATUS',
      key: 'status',
      formatter: (_: any, r: Restaurant) => {
        const isActive = r.owner?.isActive ?? true;
        return (
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${isActive
            ? 'bg-lime-100 text-lime-600 border border-lime-100 shadow-sm'
            : 'bg-red-100 text-red-600 border border-red-100 shadow-sm'
            }`}>
            {isActive ? (
              <>
                <ShieldCheck size={12} strokeWidth={3.2} />
                Unlocked
              </>
            ) : (
              <>
                <Lock size={12} strokeWidth={3.2} />
                Locked
              </>
            )}
          </span>
        );
      }
    }
  ];
};
