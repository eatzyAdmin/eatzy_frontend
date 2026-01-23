'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useNotification, useLoading } from '@repo/ui';
import { motion } from '@repo/ui/motion';
import { 
  Settings, 
  RefreshCcw, 
  Search, 
  Filter,
  Edit2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { systemConfigApi } from '@repo/api';
import { SystemParameter } from '@repo/types';
import { EditConfigModal } from '@/features/system-config/components/EditConfigModal';

const CONFIG_METADATA: Record<string, { name: string; type: 'percentage' | 'currency' | 'number' | 'text' | 'boolean'; suffix?: string; icon?: string }> = {
  'RESTAURANT_COMMISSION_RATE': { name: 'Hoa hồng cửa hàng', type: 'percentage', suffix: '%' },
  'DRIVER_COMMISSION_RATE': { name: 'Hoa hồng tài xế', type: 'percentage', suffix: '%' },
  'DELIVERY_BASE_FEE': { name: 'Phí giao hàng cơ bản', type: 'currency', suffix: 'đ' },
  'DELIVERY_BASE_DISTANCE': { name: 'Khoảng cách cơ bản', type: 'number', suffix: 'km' },
  'DELIVERY_PER_KM_FEE': { name: 'Phí mỗi km thêm', type: 'currency', suffix: 'đ' },
  'DELIVERY_MIN_FEE': { name: 'Phí giao hàng tối thiểu', type: 'currency', suffix: 'đ' },
  'DRIVER_SEARCH_RADIUS_KM': { name: 'Bán kính tìm tài xế', type: 'number', suffix: 'km' },
  'DRIVER_ACCEPT_TIMEOUT_SEC': { name: 'TG tài xế chấp nhận', type: 'number', suffix: 's' },
  'MAX_RESTAURANT_DISTANCE_KM': { name: 'Khoảng cách tối đa', type: 'number', suffix: 'km' },
  'RESTAURANT_RESPONSE_TIMEOUT_MINUTES': { name: 'TG quán phản hồi', type: 'number', suffix: 'phút' },
  'DRIVER_ASSIGNMENT_TIMEOUT_MINUTES': { name: 'TG tìm tài xế', type: 'number', suffix: 'phút' },
  'SUPPORT_HOTLINE': { name: 'Hotline hỗ trợ', type: 'text' },
  'MAINTENANCE_MODE': { name: 'Chế độ bảo trì', type: 'boolean' },
};

export default function SystemConfigPage() {
  const { show, hide } = useLoading();
  const { showNotification } = useNotification();
  const [configs, setConfigs] = useState<SystemParameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConfig, setSelectedConfig] = useState<SystemParameter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchConfigs = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setLoading(true);
      show();
    }
    try {
      const res = await systemConfigApi.getAllConfigs({ size: 100 });
      if (res.data?.result) {
        setConfigs(res.data.result);
      }
    } catch (error) {
      console.error('Failed to fetch configs:', error);
      showNotification({
        message: 'Không thể tải cấu hình hệ thống',
        type: 'error',
        format: 'Config'
      });
    } finally {
      setLoading(false);
      hide();
    }
  }, [hide]);

  useEffect(() => {
    if (isMounted) {
      fetchConfigs();
    }
  }, [fetchConfigs, isMounted]);

  if (!isMounted) {
    return null;
  }

  const handleEdit = (config: SystemParameter) => {
    setSelectedConfig(config);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedConfig: SystemParameter) => {
    try {
      const res = await systemConfigApi.updateConfig({
        id: updatedConfig.id,
        configKey: updatedConfig.configKey,
        configValue: updatedConfig.configValue,
        description: updatedConfig.description
      });
      
      if (res.data) {
        showNotification({
          message: 'Cập nhật cấu hình thành công',
          type: 'success',
          format: 'Config'
        });
        await fetchConfigs(true);
      }
    } catch (error) {
      console.error('Failed to update config:', error);
      showNotification({
        message: 'Cập nhật cấu hình thất bại',
        type: 'error',
        format: 'Config'
      });
      throw error;
    }
  };

  const filteredConfigs = configs.filter(config => 
    config.configKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
    config.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (CONFIG_METADATA[config.configKey]?.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatValue = (config: SystemParameter) => {
    const meta = CONFIG_METADATA[config.configKey];
    if (!meta) return config.configValue;

    if (meta.type === 'currency') {
      return new Intl.NumberFormat('vi-VN').format(Number(config.configValue)) + (meta.suffix || '');
    }
    
    if (meta.type === 'boolean') {
      return config.configValue === 'true' ? 'Bật' : 'Tắt';
    }

    return config.configValue + (meta.suffix || '');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-transparent flex items-center gap-3">
            <Settings className="w-10 h-10 text-primary" />
            Cấu hình hệ thống
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Quản lý các tham số vận hành, hoa hồng và thiết lập nền tảng Eatzy.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={() => fetchConfigs()}
            className="p-3 bg-white hover:bg-gray-50 text-gray-600 rounded-2xl shadow-sm border border-gray-100 transition-all flex items-center gap-2 font-semibold"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </motion.div>
      </div>

      {/* Controls Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm mã cấu hình hoặc mô tả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-md border border-white/20 rounded-3xl shadow-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none text-gray-700 font-medium"
          />
        </div>
        <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-3xl shadow-lg p-1 flex items-center">
           <div className="flex-1 px-4 flex items-center gap-2 text-gray-500 font-semibold">
              <Filter className="w-5 h-5" />
              <span>Lọc:</span>
              <span className="text-primary bg-primary/10 px-3 py-1 rounded-xl text-sm">Tất cả</span>
           </div>
        </div>
      </motion.div>

      {/* Content Section */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="liquid-glass-container p-6 rounded-3xl bg-white/40 border border-white/20 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-3/4" />
                  <div className="h-3 bg-gray-100 animate-pulse rounded-lg w-1/2" />
                </div>
              </div>
              <div className="h-16 bg-gray-50 animate-pulse rounded-2xl" />
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 animate-pulse rounded-lg w-12" />
                  <div className="h-8 bg-gray-200 animate-pulse rounded-lg w-20" />
                </div>
                <div className="h-8 bg-gray-100 animate-pulse rounded-lg w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConfigs.map((config, index) => (
            <motion.div
              key={config.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="group liquid-glass-container p-6 rounded-3xl bg-white/60 backdrop-blur-md border border-white/40 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={() => handleEdit(config)}
                  className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 break-all">
                      {CONFIG_METADATA[config.configKey]?.name || config.configKey}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">{config.configKey}</p>
                  </div>
                </div>

                <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.5rem]">
                    {config.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Giá trị hiện tại</span>
                    <span className="text-2xl font-black text-gray-900">
                      {formatValue(config)}
                    </span>
                  </div>
                  
                  {config.updatedAt && (
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">Cập nhật lúc</span>
                      <span className="text-xs font-medium text-gray-600">
                        {new Date(config.updatedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredConfigs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-20 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-600">Không tìm thấy cấu hình</h3>
          <p className="text-gray-400 mt-2">Thử thay đổi từ khóa tìm kiếm của bạn</p>
        </motion.div>
      )}

      <EditConfigModal
        config={selectedConfig}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
