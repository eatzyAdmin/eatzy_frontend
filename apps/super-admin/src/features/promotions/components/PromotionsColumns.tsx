import React from 'react';
import { Truck, Tag, FileText, Calendar, Globe, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { Voucher, DiscountType } from '@repo/types';
import { format } from 'date-fns';

interface GetPromotionsColumnsProps {
  hoveredVoucherId: number | null;
  setHoveredVoucherId: (id: number | null) => void;
}

export const getPromotionsColumns = ({ hoveredVoucherId, setHoveredVoucherId }: GetPromotionsColumnsProps) => {
  return [
    {
      label: 'CAMPAIGN INFO',
      key: 'code',
      formatter: (_: any, promo: Voucher) => {
        const isActive = promo.active ?? false;
        const isFreeShip = promo.discountType === DiscountType.FREESHIP;
        const copyToClipboard = (e: React.MouseEvent) => {
          e.stopPropagation();
          navigator.clipboard.writeText(promo.code);
        };

        return (
          <div className="flex items-center gap-4 py-2 group/info">
            <div className={`w-12 h-12 rounded-2xl ${isActive ? 'bg-lime-100 text-lime-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center shadow-lg shadow-black/5`}>
              {isFreeShip ? <Truck size={20} className="stroke-[2.5]" /> : <Tag size={20} className="stroke-[2.5]" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="font-anton text-lg text-[#1A1A1A] uppercase tracking-tight leading-none mb-1">{promo.code}</div>
                <button
                  onClick={copyToClipboard}
                  className="opacity-0 group-hover/info:opacity-100 p-1 hover:bg-gray-100 rounded-md transition-all text-gray-400 hover:text-primary"
                  title="Copy code"
                >
                  <FileText size={12} />
                </button>
              </div>
              <div className="text-xs text-gray-400 font-medium line-clamp-1">{promo.description}</div>
            </div>
          </div>
        );
      }
    },
    {
      label: 'VALUE',
      key: 'discountValue',
      formatter: (_: any, promo: Voucher) => {
        const dValue = promo.discountValue ?? 0;
        const minOrder = promo.minOrderValue ?? 0;
        let displayValue = '';
        let typeLabel = '';

        if (promo.discountType === DiscountType.PERCENTAGE) {
          displayValue = `${dValue}%`;
          typeLabel = 'PERCENTAGE';
        } else if (promo.discountType === DiscountType.FIXED) {
          displayValue = `${new Intl.NumberFormat('vi-VN').format(dValue)}đ`;
          typeLabel = 'FIXED AMOUNT';
        } else if (promo.discountType === DiscountType.FREESHIP) {
          displayValue = `FREE`;
          typeLabel = 'SHIPPING';
        }

        return (
          <div className="py-2">
            <div className="font-anton text-xl text-[#1A1A1A]">
              {displayValue}
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">
                {typeLabel}
              </div>
              <div className="text-[9px] font-bold text-primary uppercase tracking-tight flex items-center gap-1 mt-1">
                Min Order: {new Intl.NumberFormat('vi-VN').format(minOrder)}đ
              </div>
            </div>
          </div>
        );
      }
    },
    {
      label: 'USAGE & LIMIT',
      key: 'remainingQuantity',
      formatter: (_: any, promo: Voucher) => {
        const total = promo.totalQuantity ?? 0;
        const remaining = promo.remainingQuantity ?? 0;
        const used = total - remaining;
        const percent = total > 0 ? Math.min(100, (used / total) * 100) : 0;
        const isNearFull = percent > 80;
        return (
          <div className="w-[120px]">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className={isNearFull ? "text-orange-500" : "text-gray-600"}>{used} used</span>
              <span className="text-gray-400">/ {total}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${isNearFull ? 'bg-orange-500' : 'bg-lime-500'}`}
              />
            </div>
          </div>
        );
      }
    },
    {
      label: 'PERIOD & SCOPE',
      key: 'startDate',
      formatter: (_: any, promo: Voucher) => {
        const start = promo.startDate ? new Date(promo.startDate) : new Date();
        const end = promo.endDate ? new Date(promo.endDate) : new Date();
        const applyToAll = (promo as any).applyToAll ?? (!promo.restaurants || promo.restaurants.length === 0);
        const restaurantCount = promo.restaurants?.length || 0;

        return (
          <div className="py-2 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-gray-800">
              <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center shadow-sm">
                <Calendar size={14} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Duration</span>
                <span className="text-xs font-anton tracking-tight leading-none">
                  {format(start, start.getFullYear() !== end.getFullYear() ? 'MMM d, yyyy' : 'MMM d')} - {format(end, 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            <div className="relative group/scope">
              {applyToAll ? (
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50/50 px-3 py-1.5 rounded-xl border border-blue-100/50 w-fit shadow-sm">
                  <Globe size={12} strokeWidth={2.5} />
                  <span className="text-[10px] font-anton uppercase tracking-wider">Global System</span>
                </div>
              ) : (
                <div
                  onMouseEnter={() => setHoveredVoucherId(promo.id)}
                  onMouseLeave={() => setHoveredVoucherId(null)}
                  className="flex items-center gap-2 text-primary bg-gray-50/50 px-3 py-1.5 rounded-xl border border-gray-100/20 w-fit cursor-default hover:bg-gray-100/50 transition-colors"
                >
                  <Building2 size={12} strokeWidth={2.5} />
                  <span className="text-[10px] font-anton uppercase tracking-wider underline decoration-primary/30 decoration-dashed underline-offset-2">
                    {restaurantCount} Restaurants
                  </span>

                  <AnimatePresence>
                    {hoveredVoucherId === promo.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 350 }}
                        className="absolute bottom-full left-0 mb-4 bg-[#1A1A1A] text-white p-5 rounded-[28px] shadow-2xl z-[100] min-w-[240px] border border-white/10 pointer-events-none origin-bottom-left"
                      >
                        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                              <Building2 size={12} strokeWidth={2.5} />
                            </div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Locations</div>
                          </div>
                          <div className="text-[11px] font-anton text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                            {restaurantCount}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
                          {promo.restaurants?.map(r => (
                            <div key={r.id} className="text-[12px] truncate flex items-center gap-2.5 font-bold text-gray-100 group/item">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(132,204,22,0.4)]" />
                              {r.name}
                            </div>
                          ))}
                        </div>

                        <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-[#1A1A1A] transform rotate-45 border-r border-b border-white/10" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        );
      }
    },
    {
      label: 'STATUS',
      key: 'active',
      formatter: (_: any, promo: Voucher) => {
        const isActive = (promo as any).active ?? false;
        return (
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${isActive ? 'bg-lime-100 text-lime-600 border border-lime-100' : 'bg-gray-100 text-gray-400 border border-gray-100'}`}>
            {isActive ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-lime-600" />
                Running
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                Paused
              </>
            )}
          </span>
        );
      }
    }
  ];
};
