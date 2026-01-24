'use client';

import React, { useState } from 'react';
import { useSystemConfig, ConfigGroupKey } from '@/features/system-config/hooks/useSystemConfig';
import { ConfigHeader, ConfigGroup, ConfigSkeleton, EditConfigModal } from '@/features/system-config/components';
import { SystemParameter } from '@repo/types';

export default function SystemConfigPage() {
  const {
    groupedConfigs,
    isLoading,
    error,
    refetch,
    updateConfig
  } = useSystemConfig();

  const [selectedConfig, setSelectedConfig] = useState<SystemParameter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (config: SystemParameter) => {
    setSelectedConfig(config);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedConfig: SystemParameter) => {
    await updateConfig(updatedConfig);
  };

  if (isLoading) return <ConfigSkeleton />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-anton text-gray-800 uppercase">ĐÃ CÓ LỖI XẢY RA</h2>
          <p className="text-gray-500 font-medium">Không thể tải cấu hình hệ thống. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  const groupOrder: ConfigGroupKey[] = ['financial', 'delivery', 'operational', 'timeouts', 'general'];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <ConfigHeader
        isLoading={isLoading}
        onRefresh={() => refetch()}
      />

      <div className="px-8 mt-10 max-w-7xl mx-auto space-y-2">
        {groupOrder.map((groupKey) => (
          <ConfigGroup
            key={groupKey}
            type={groupKey}
            configs={groupedConfigs[groupKey]}
            onEdit={handleEdit}
          />
        ))}
      </div>

      <EditConfigModal
        config={selectedConfig}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
