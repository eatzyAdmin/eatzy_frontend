import React from 'react';

export interface ColumnConfig {
  key: string;
  label: string;
  icon: React.ReactNode;
}

export interface ColumnGroup {
  label: string;
  icon: React.ReactNode;
  columns: ColumnConfig[];
}

export interface ExportDataModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  columnGroups: Record<string, ColumnGroup>;
  previewData: T[];
  onExport: (format: 'pdf' | 'excel', scope: 'current' | 'all', columns: string[]) => Promise<void>;
  formatCell: (item: T, key: string) => React.ReactNode;
  scopeLabels?: {
    current: { title: string; desc: string };
    all: { title: string; desc: string };
  };
  successMessage?: string;
  errorMessage?: string;
  defaultScope?: 'current' | 'all';
  defaultFormat?: 'pdf' | 'excel';
}
