'use client';

import { useState, useEffect } from 'react';
import { Reorder, AnimatePresence, motion } from '@repo/ui/motion';
import { Dish, OptionGroup, OptionChoice } from '@repo/types';
import { Plus, Trash2, GripVertical, X, ChevronDown, ChevronUp } from '@repo/ui/icons';

interface DishEditModalProps {
  dish: Dish;
  onDraftChange?: (updates: Partial<Dish>) => void;
  onClose: () => void;
  // onUpdate: any; // Removed unused prop
}

export default function DishEditModal({ dish, onDraftChange, onClose }: DishEditModalProps) {
  const optionGroups = dish.optionGroups || [];
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Initialize expanded state only once or when new groups are added
  useEffect(() => {
    // We don't overwrite expanded state on every render, just ensure we have keys? 
    // Actually, let's just keep expandedGroups local.
    // If a new group is added, we set it to expanded in the handler.
  }, []);

  const updateGroups = (newGroups: OptionGroup[]) => {
    if (onDraftChange) {
      onDraftChange({ optionGroups: newGroups });
    }
  };

  const handleAddGroup = () => {
    const newGroup: OptionGroup = {
      id: `group-${Date.now()}`,
      title: 'Nhóm tùy chọn mới',
      minSelect: 0,
      maxSelect: 1,
      required: false,
      options: [],
      type: 'addon'
    };
    const newGroups = [...optionGroups, newGroup];
    updateGroups(newGroups);
    setExpandedGroups(prev => ({ ...prev, [newGroup.id]: true }));
  };

  const handleRemoveGroup = (groupId: string) => {
    const newGroups = optionGroups.filter(g => g.id !== groupId);
    updateGroups(newGroups);
  };

  const handleUpdateGroup = (groupId: string, updates: Partial<OptionGroup>) => {
    const newGroups = optionGroups.map(g => g.id === groupId ? { ...g, ...updates } : g);
    updateGroups(newGroups);
  };

  const handleSetVariant = (groupId: string) => {
    // Logic: Toggle variant status for the target group.
    // If turning ON: Turn OFF on all others (enforce single variant).
    const targetGroup = optionGroups.find(g => g.id === groupId);
    const isCurrentlyVariant = targetGroup?.type === 'variant';

    const newGroups = optionGroups.map(g => {
      if (g.id === groupId) {
        // Toggle
        if (!isCurrentlyVariant) {
          return { ...g, type: 'variant', minSelect: 1, maxSelect: 1 };
        } else {
          return { ...g, type: 'addon' };
        }
      } else {
        // If we are enabling variant on groupId, disable on others
        if (!isCurrentlyVariant) {
          return { ...g, type: 'addon' };
        }
        return g;
      }
    });
    updateGroups(newGroups);
  };

  const toggleExpand = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Option Choices Logic
  const handleAddChoice = (groupId: string) => {
    const newChoice: OptionChoice = {
      id: `opt-${Date.now()}`,
      name: 'Tùy chọn mới',
      price: 0
    };
    const newGroups = optionGroups.map(g => {
      if (g.id === groupId) {
        return { ...g, options: [...(g.options || []), newChoice] };
      }
      return g;
    });
    updateGroups(newGroups);
  };

  const handleRemoveChoice = (groupId: string, choiceId: string) => {
    const newGroups = optionGroups.map(g => {
      if (g.id === groupId) {
        return { ...g, options: (g.options || []).filter(o => o.id !== choiceId) };
      }
      return g;
    });
    updateGroups(newGroups);
  };

  const handleUpdateChoice = (groupId: string, choiceId: string, updates: Partial<OptionChoice>) => {
    const newGroups = optionGroups.map(g => {
      if (g.id === groupId) {
        const newOptions = (g.options || []).map(o => o.id === choiceId ? { ...o, ...updates } : o);
        return { ...g, options: newOptions };
      }
      return g;
    });
    updateGroups(newGroups);
  };

  const handleReorderChoices = (groupId: string, newOptions: OptionChoice[]) => {
    const newGroups = optionGroups.map(g => {
      if (g.id === groupId) {
        return { ...g, options: newOptions };
      }
      return g;
    });
    updateGroups(newGroups);
  };

  return (
    <div className="bg-[#F7F7F7] rounded-[32px] h-full flex flex-col shadow-2xl border border-white/50 overflow-hidden relative">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 bg-white/50 backdrop-blur-sm flex items-center justify-between sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-anton font-bold text-[#1A1A1A]">TUỲ CHỌN MÓN</h2>
          <p className="text-xs text-gray-500">Quản lý các nhóm tùy chọn (Size, Topping...)</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddGroup}
            className="bg-[var(--primary)] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide shadow-lg hover:bg-[var(--primary)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm nhóm</span>
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-100 transition-all border border-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* List content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
        {optionGroups.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl">
            <p className="text-sm font-medium">Chưa có nhóm tùy chọn nào</p>
            <p className="text-xs mt-1">Bấm &quot;Thêm nhóm&quot; để bắt đầu</p>
          </div>
        ) : (
          <Reorder.Group axis="y" values={optionGroups} onReorder={updateGroups} className="space-y-6">
            {optionGroups.map((group) => {
              const isVariant = group.type === 'variant';
              return (
                <Reorder.Item
                  key={group.id}
                  value={group}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${isVariant ? 'bg-[var(--primary)]/5 border-2 border-[var(--primary)] shadow-md' : 'bg-white border border-gray-200 shadow-sm'} rounded-3xl overflow-hidden`}
                >
                  {/* Group Header */}
                  <div className={`p-4 border-b ${isVariant ? 'bg-[var(--primary)]/10 border-[var(--primary)]/20' : 'bg-gray-50/50 border-gray-100'}`}>
                    <div className="flex items-start gap-4">
                      <div className="text-gray-400 p-2 cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          {isVariant && (
                            <span className="bg-[var(--primary)] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                              Phân loại chính
                            </span>
                          )}
                          <input
                            type="text"
                            value={group.title}
                            onChange={(e) => handleUpdateGroup(group.id, { title: e.target.value })}
                            className={`flex-1 bg-transparent text-lg font-bold placeholder-gray-400 focus:outline-none border-b border-transparent py-1 ${isVariant ? 'text-[var(--primary)] focus:border-[var(--primary)]' : 'text-[#1A1A1A] focus:border-[var(--primary)]'}`}
                            placeholder="Tên nhóm (VD: Size, Topping)"
                          />
                          <button onClick={() => handleRemoveGroup(group.id)} className="text-gray-400 hover:text-red-500 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {/* Expand/Collapse Chevron */}
                          <button onClick={() => toggleExpand(group.id)} className="text-gray-400 hover:text-gray-600 p-1">
                            {expandedGroups[group.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Variant Toggle Button */}
                          <button
                            onClick={() => handleSetVariant(group.id)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${isVariant
                              ? 'bg-white text-[var(--primary)] border-[var(--primary)]/30 hover:bg-[var(--primary)]/5'
                              : 'bg-white text-gray-500 border-gray-200 hover:text-[var(--primary)] hover:border-[var(--primary)]'
                              }`}
                          >
                            {isVariant ? '✓ Đang là phân loại' : 'Đặt làm phân loại'}
                          </button>

                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 text-xs font-bold uppercase">Tối thiểu</span>
                              <input
                                type="number"
                                min={0}
                                value={group.minSelect || 0}
                                onChange={(e) => handleUpdateGroup(group.id, { minSelect: parseInt(e.target.value) || 0 })}
                                className="w-12 bg-white border border-gray-200 rounded-lg px-2 py-1 text-center font-bold text-sm focus:outline-none focus:border-[var(--primary)]"
                                disabled={isVariant} // Variant enforces 1
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 text-xs font-bold uppercase">Tối đa</span>
                              <input
                                type="number"
                                min={0}
                                value={group.maxSelect || 0}
                                onChange={(e) => handleUpdateGroup(group.id, { maxSelect: parseInt(e.target.value) || 0 })}
                                className="w-12 bg-white border border-gray-200 rounded-lg px-2 py-1 text-center font-bold text-sm focus:outline-none focus:border-[var(--primary)]"
                                disabled={isVariant} // Variant enforces 1
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Choices List */}
                  <AnimatePresence initial={false}>
                    {expandedGroups[group.id] && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-white/50">
                          <Reorder.Group
                            axis="y"
                            values={group.options || []}
                            onReorder={(newOrder) => handleReorderChoices(group.id, newOrder)}
                            className="space-y-2"
                          >
                            {(group.options || []).map((option) => (
                              <Reorder.Item
                                key={option.id}
                                value={option}
                                className="bg-white rounded-xl border border-gray-100 p-2 flex items-center gap-3 cursor-grab active:cursor-grabbing hover:border-gray-300 transition-colors shadow-sm"
                              >
                                <div className="text-gray-400 p-1">
                                  <GripVertical className="w-4 h-4 cursor-grab" />
                                </div>

                                <div className="flex-1 grid grid-cols-[1fr_120px] gap-3">
                                  <input
                                    type="text"
                                    value={option.name}
                                    onChange={(e) => handleUpdateChoice(group.id, option.id, { name: e.target.value })}
                                    className="bg-transparent text-sm font-semibold text-[#1A1A1A] placeholder-gray-400 focus:outline-none"
                                    placeholder="Tên lựa chọn"
                                  />
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500 font-medium">+</span>
                                    <input
                                      type="number"
                                      value={option.price || 0}
                                      onChange={(e) => handleUpdateChoice(group.id, option.id, { price: parseFloat(e.target.value) || 0 })}
                                      className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs font-mono text-right focus:outline-none focus:border-[var(--primary)]"
                                      placeholder="Giá"
                                    />
                                    <span className="text-xs text-gray-400">đ</span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleRemoveChoice(group.id, option.id)}
                                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </Reorder.Item>
                            ))}
                          </Reorder.Group>

                          <button
                            onClick={() => handleAddChoice(group.id)}
                            className="mt-3 w-full border-2 border-dashed border-gray-200 rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 hover:text-[var(--primary)] hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/5 transition-all"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Thêm lựa chọn</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        )}
      </div>
    </div>
  );
}
