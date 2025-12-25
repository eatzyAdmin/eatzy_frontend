export interface SystemParameter {
  id: string;
  name: string;
  value: number;
  unit: string;
  description: string;
}

export const mockSystemParameters: SystemParameter[] = [
  {
    id: 'driver_commission',
    name: 'Hoa hồng tài xế',
    value: 20,
    unit: '%',
    description: 'Phần trăm chiết khấu trên mỗi cuốc xe',
  },
  {
    id: 'restaurant_commission',
    name: 'Hoa hồng quán ăn',
    value: 15,
    unit: '%',
    description: 'Phần trăm chiết khấu trên mỗi đơn hàng',
  },
  {
    id: 'delivery_fee_per_km',
    name: 'Giá giao hàng / 1km',
    value: 5000,
    unit: 'đ',
    description: 'Đơn giá vận chuyển tính theo mỗi km',
  }
];
