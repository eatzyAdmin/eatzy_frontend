export type SystemParameterType = 'percentage' | 'currency' | 'number' | 'text';

export type SystemParameter = {
  id: string;
  key: string;
  name: string;
  value: number | string;
  type: SystemParameterType;
  suffix?: string; // e.g., '%', 'đ', 'km'
  description: string;
  updatedAt: string;
  updatedBy: string;
};
