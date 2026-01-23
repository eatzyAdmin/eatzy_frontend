export type SystemParameterType = 'percentage' | 'currency' | 'number' | 'text';

export type SystemParameter = {
  id: number;
  configKey: string;
  configValue: string;
  description: string;
  updatedAt?: string;
  lastUpdatedBy?: {
    id: number;
    name: string;
    email: string;
  };
  // UI helpers
  name?: string;
  type?: SystemParameterType;
  suffix?: string;
};
