'use client';

import { motion } from '@repo/ui/motion';
import { SystemParameter } from '@repo/types';
import { Edit2, Wallet, Truck, Activity, Clock, Sliders } from 'lucide-react';
import { CONFIG_METADATA } from '../constants';

const GROUP_TITLES = {
  financial: { title: 'FINANCIAL & COMMISSION', icon: Wallet },
  delivery: { title: 'DELIVERY CONFIG', icon: Truck },
  operational: { title: 'SYSTEM OPERATION', icon: Activity },
  timeouts: { title: 'TIMEOUTS', icon: Clock },
  general: { title: 'GENERAL CONFIG', icon: Sliders },
};

interface ConfigGroupProps {
  type: keyof typeof GROUP_TITLES;
  configs: SystemParameter[];
  onEdit: (config: SystemParameter) => void;
}

export function ConfigGroup({ type, configs, onEdit }: ConfigGroupProps) {
  const { title, icon: Icon } = GROUP_TITLES[type];

  if (!configs || configs.length === 0) return null;

  const formatValue = (config: SystemParameter) => {
    const meta = CONFIG_METADATA[config.configKey];
    if (!meta) return config.configValue;

    if (meta.type === 'currency') {
      return new Intl.NumberFormat('vi-VN').format(Number(config.configValue)) + (meta.suffix || '');
    }

    if (meta.type === 'boolean') {
      return config.configValue === 'true' ? 'Đang bật' : 'Đang tắt';
    }

    return config.configValue + (meta.suffix || '');
  };

  return (
    <div className="bg-white rounded-[40px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-gray-100/50 overflow-hidden mb-8">
      <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <h4 className="font-anton font-semibold text-2xl text-gray-900 tracking-tight">{title}</h4>
        </div>
        <span className="text-xs font-bold bg-[#1A1A1A] text-white px-4 py-1.5 rounded-xl uppercase tracking-wider">
          {configs.length} items
        </span>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configs.map((config) => (
          <motion.div
            key={config.id}
            whileHover={{ y: -6 }}
            className="group bg-[#F8F9FA] rounded-[32px] p-6 border-2 border-transparent hover:border-primary/30 hover:bg-white hover:shadow-[0_0_80px_rgba(0,0,0,0.12)] transition-all duration-500 relative"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  {config.configKey}
                </h5>
                <h3 className="font-bold text-[#1A1A1A] text-base line-clamp-1 group-hover:text-primary transition-colors">
                  {CONFIG_METADATA[config.configKey]?.name || config.configKey}
                </h3>
              </div>
              <button
                onClick={() => onEdit(config)}
                className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-primary shadow-lg hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Value</div>
                <div className="text-xl font-anton text-gray-900 tracking-tight">
                  {formatValue(config)}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[9px] font-medium text-gray-400 uppercase tracking-tight">Last Update</div>
                <div className="text-[10px] font-bold text-gray-500">
                  {new Date(config.updatedAt || '').toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed italic">
                {config.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
