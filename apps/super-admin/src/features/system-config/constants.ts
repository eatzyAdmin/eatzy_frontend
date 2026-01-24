export type ConfigType = 'percentage' | 'currency' | 'number' | 'text' | 'boolean';

export interface ConfigMeta {
  name: string;
  type: ConfigType;
  suffix?: string;
}

export const CONFIG_METADATA: Record<string, ConfigMeta> = {
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
