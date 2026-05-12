export type ConfigType = 'percentage' | 'currency' | 'number' | 'text' | 'boolean';

export interface ConfigMeta {
  name: string;
  type: ConfigType;
  suffix?: string;
}

export const CONFIG_METADATA: Record<string, ConfigMeta> = {
  'RESTAURANT_COMMISSION_RATE': { name: 'Restaurant Commission', type: 'percentage', suffix: '%' },
  'DRIVER_COMMISSION_RATE': { name: 'Driver Commission', type: 'percentage', suffix: '%' },
  'DELIVERY_BASE_FEE': { name: 'Base Delivery Fee', type: 'currency', suffix: '₫' },
  'DELIVERY_BASE_DISTANCE': { name: 'Base Distance', type: 'number', suffix: 'km' },
  'DELIVERY_PER_KM_FEE': { name: 'Extra Fee per KM', type: 'currency', suffix: '₫' },
  'DELIVERY_MIN_FEE': { name: 'Min Delivery Fee', type: 'currency', suffix: '₫' },
  'DRIVER_SEARCH_RADIUS_KM': { name: 'Driver Search Radius', type: 'number', suffix: 'km' },
  'DRIVER_ACCEPT_TIMEOUT_SEC': { name: 'Driver Accept Timeout', type: 'number', suffix: 's' },
  'MAX_RESTAURANT_DISTANCE_KM': { name: 'Max Resto Distance', type: 'number', suffix: 'km' },
  'RESTAURANT_RESPONSE_TIMEOUT_MINUTES': { name: 'Resto Response Timeout', type: 'number', suffix: 'min' },
  'DRIVER_ASSIGNMENT_TIMEOUT_MINUTES': { name: 'Driver Assign Timeout', type: 'number', suffix: 'min' },
  'SUPPORT_HOTLINE': { name: 'Support Hotline', type: 'text' },
  'MAINTENANCE_MODE': { name: 'Maintenance Mode', type: 'boolean' },
};
