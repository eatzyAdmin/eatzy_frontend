'use client';

import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  X, Building2, MapPin, Phone, Star,
  Info, Clock, Wallet as WalletIcon,
  Percent, Globe, ShieldCheck, ExternalLink,
  ChevronRight, Calendar, User, Mail,
  Play, Pause
} from 'lucide-react';
import { ImageWithFallback, LoadingSpinner } from '@repo/ui';
import { Restaurant } from '@repo/types';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useWallet } from '../hooks/useWallet';

interface RestaurantDetailsModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function RestaurantDetailsModal({ restaurant, isOpen, onClose }: RestaurantDetailsModalProps) {
  const [mounted, setMounted] = useState(false);
  const { data: wallet, isLoading: isWalletLoading } = useWallet(restaurant?.owner?.id);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const ratingStats = [
    { star: 5, count: restaurant?.fiveStarCount || 0, color: 'bg-lime-500' },
    { star: 4, count: restaurant?.fourStarCount || 0, color: 'bg-lime-400' },
    { star: 3, count: restaurant?.threeStarCount || 0, color: 'bg-amber-400' },
    { star: 2, count: restaurant?.twoStarCount || 0, color: 'bg-orange-400' },
    { star: 1, count: restaurant?.oneStarCount || 0, color: 'bg-red-400' },
  ];

  const maxCount = Math.max(...ratingStats.map(s => s.count), 1);

  return createPortal(
    <AnimatePresence>
      {isOpen && restaurant && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100]"
          />

          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40, rotateX: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#FDFDFD] w-full max-w-5xl rounded-[50px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] pointer-events-auto flex flex-col max-h-[92vh] border border-white/40"
            >
              <div className="absolute top-6 right-8 z-[120] flex gap-3">
                <button
                  onClick={onClose}
                  className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 shadow-xl"
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pb-16">
                <div className="relative h-[480px] w-full group/hero">
                  <div className="absolute inset-0 overflow-hidden">
                    <ImageWithFallback
                      src={restaurant.coverImageUrl || ''}
                      alt="Cover"
                      fill
                      className="object-cover scale-105 group-hover/hero:scale-100 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-[#FDFDFD]" />
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FDFDFD] to-transparent" />
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-end p-12">
                    <div className="flex items-end gap-10">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10 flex-shrink-0"
                      >
                        <div className="p-2 bg-white rounded-[45px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                          <div className="w-44 h-44 rounded-[38px] overflow-hidden bg-gray-50 relative border-4 border-gray-50">
                            <ImageWithFallback
                              src={restaurant.avatarUrl || ''}
                              alt={restaurant.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center
                          ${restaurant.status === 'OPEN' ? 'bg-lime-500' : 'bg-red-500'}`}>
                          {restaurant.status === 'OPEN' ? <Play className="w-4 h-4 text-white fill-current" /> : <Pause className="w-4 h-4 text-white fill-current" />}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex-1 pb-4"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-5 py-2 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                            {restaurant.restaurantTypes?.name || 'GENERIC PARTNER'}
                          </span>
                          <span className="px-5 py-2 rounded-2xl bg-primary/20 backdrop-blur-xl border border-primary/30 text-primary text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                            ID #{restaurant.id}
                          </span>
                        </div>

                        <h1 className="text-7xl font-anton text-white uppercase tracking-tighter leading-[0.9] mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                          {restaurant.name}
                        </h1>

                        <div className="flex flex-wrap gap-6 text-gray-500">
                          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/80 shadow-sm">
                            <MapPin size={18} className="text-primary" />
                            <span className="text-sm font-bold tracking-tight uppercase line-clamp-1 max-w-[400px]">{restaurant.address}</span>
                          </div>
                          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/80 shadow-sm">
                            <Star size={18} className="text-amber-400 fill-amber-400" />
                            <span className="text-lg font-anton leading-none mt-1">{restaurant.averageRating?.toFixed(1)}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{restaurant.reviewCount} REVIEWS</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid (COMPACT STYLE) */}
                <div className="px-8 grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

                  {/* Financial & Contact Card (Left) */}
                  <div className="md:col-span-2 space-y-6">

                    {/* Financial Information */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 overflow-hidden relative group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <WalletIcon size={80} className="text-primary" />
                      </div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-lime-50 text-lime-600 flex items-center justify-center shadow-sm">
                          <WalletIcon size={20} />
                        </div>
                        <h4 className="font-anton text-lg tracking-tight text-[#1A1A1A] uppercase">Financial Overview</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Wallet Balance</p>
                          <div className="flex items-baseline gap-1">
                            {isWalletLoading ? (
                              <div className="h-8 w-32 bg-gray-100 animate-pulse rounded-lg" />
                            ) : (
                              <span className="text-3xl font-anton text-[#1A1A1A]">
                                {formatCurrency(wallet?.balance || 0)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Platform Fee</p>
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                              <Percent size={18} strokeWidth={2.5} />
                            </div>
                            <span className="text-2xl font-anton text-violet-600">
                              {restaurant.commissionRate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact & Identity details */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-lime-50 text-lime-600 flex items-center justify-center shadow-sm">
                          <User size={20} />
                        </div>
                        <h4 className="font-anton text-lg tracking-tight text-[#1A1A1A] uppercase">Partner Contacts</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary/20 transition-all group/cell">
                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover/cell:text-primary transition-colors">
                              <Phone size={18} />
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Contact Number</p>
                              <p className="font-anton tracking-tight text-[#1A1A1A]">{restaurant.contactPhone}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary/20 transition-all group/cell">
                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover/cell:text-primary transition-colors">
                              <MapPin size={18} />
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Operational Region</p>
                              <p className="font-bold text-[#1A1A1A] text-xs line-clamp-1">{restaurant.address}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary/20 transition-all group/cell">
                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover/cell:text-primary transition-colors">
                              <Building2 size={18} />
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Legal Entity / Owner</p>
                              <p className="font-anton tracking-tight text-[#1A1A1A] uppercase">{restaurant.owner?.name}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary/20 transition-all group/cell">
                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover/cell:text-primary transition-colors">
                              <Globe size={18} />
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Public Landing</p>
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-[#1A1A1A] text-xs truncate max-w-[140px]">.../restaurant/{restaurant.slug}</p>
                                <ExternalLink size={12} className="text-gray-300" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-lime-50 text-lime-600 flex items-center justify-center shadow-sm">
                          <Info size={20} />
                        </div>
                        <h4 className="font-anton text-lg tracking-tight text-[#1A1A1A] uppercase">Description & Philosophy</h4>
                      </div>
                      <p className="text-sm font-medium text-gray-500 leading-relaxed italic border-l-4 border-lime-100 pl-6 bg-lime-50/20 py-4 rounded-r-2xl">
                        "{restaurant.description || 'No detailed description available for this partner. Update information in the edit section to provide brand storytelling.'}"
                      </p>
                    </div>
                  </div>

                  {/* Sidebar Stats (Performance & Schedule) */}
                  <div className="space-y-6">

                    {/* Performance Card */}
                    <div className="bg-[#1A1A1A] rounded-[32px] p-8 shadow-2xl text-white overflow-hidden relative">
                      <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />

                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Performance</p>
                          <h4 className="font-anton text-lg tracking-tight uppercase">Rating Analytics</h4>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                          <Star size={24} className="text-primary fill-primary" />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-8">
                        <div className="text-5xl font-anton text-primary leading-none">{restaurant.averageRating?.toFixed(1) || '0.0'}</div>
                        <div>
                          <div className="flex gap-0.5 mb-1">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={14} className={s <= Math.round(restaurant.averageRating || 0) ? "text-primary fill-primary" : "text-gray-700"} />
                            ))}
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">{restaurant.reviewCount || 0} Total Reviews</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {ratingStats.map(stat => (
                          <div key={stat.star} className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-400 w-3">{stat.star}</span>
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(stat.count / maxCount) * 100}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className={`h-full rounded-full ${stat.color}`}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 w-8 text-right">{stat.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operational Time Card */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-gray-50 text-gray-600 flex items-center justify-center shadow-sm">
                          <Clock size={20} />
                        </div>
                        <h4 className="font-anton text-lg tracking-tight text-[#1A1A1A] uppercase text-xs uppercase tracking-widest">Business Schedule</h4>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                          <div className="flex items-center gap-3 mb-2 text-primary">
                            <Calendar size={14} strokeWidth={2.5} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Operational Hours</span>
                          </div>
                          <p className="text-xs font-bold text-[#1A1A1A] uppercase tracking-tight">
                            {restaurant.schedule || 'Schedule not configured'}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 text-gray-400 px-4">
                          <Info size={14} />
                          <p className="text-[10px] font-medium leading-relaxed">Schedule is maintained by the partner. Admin can force close/lock account from the main dashboard.</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer / CTA Banner */}
                <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2D3436] p-1 rounded-[32px] shadow-xl overflow-hidden group mt-10 mx-8">
                  <div className="bg-white/5 rounded-[30px] p-8 flex items-center justify-between backdrop-blur-md">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/20 flex items-center justify-center text-primary">
                        <ShieldCheck size={28} />
                      </div>
                      <div>
                        <h5 className="font-anton text-lg text-white uppercase tracking-tight mb-1">Security & Policy Check</h5>
                        <p className="text-gray-400 text-xs font-medium max-w-md">This partner has agreed to Eatzy's quality of service policy. Review their metrics regularly to ensure system health.</p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-8 py-4 bg-primary text-white rounded-2xl font-anton text-sm uppercase tracking-widest hover:bg-white hover:text-[#1A1A1A] transition-all duration-300 flex items-center gap-2 group/btn"
                    >
                      Close Dossier
                      <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div >
        </>
      )
      }
    </AnimatePresence >,
    document.body
  );
}
