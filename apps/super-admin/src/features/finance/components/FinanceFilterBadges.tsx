'use client';

import React, { useMemo } from 'react';
import { TableFilterBadges, BadgeTheme } from '@repo/ui';
import {
  ArrowDownLeft, ArrowUpRight, CreditCard, RotateCcw,
  CheckCircle, Clock, AlertCircle
} from '@repo/ui/icons';

interface FinanceFilterBadgesProps {
  filterQuery: string;
  onRemoveFilter: (filter: string) => void;
}

export default function FinanceFilterBadges({ filterQuery, onRemoveFilter }: FinanceFilterBadgesProps) {
  const filterBadges = useMemo(() => {
    const configs: any[] = [];

    // Categories
    const types = [
      { value: 'DEPOSIT', label: 'Deposit', icon: <ArrowDownLeft size={16} />, theme: 'lime' },
      { value: 'WITHDRAWAL', label: 'Withdrawal', icon: <ArrowUpRight size={16} />, theme: 'lime' },
      { value: 'PAYMENT', label: 'Payment', icon: <CreditCard size={16} />, theme: 'lime' },
      { value: 'REFUND', label: 'Refund', icon: <RotateCcw size={16} />, theme: 'lime' },
      { value: 'EARNING', label: 'Earning', icon: <CheckCircle size={16} />, theme: 'lime' },
      { value: 'TOP_UP', label: 'Top Up', icon: <Clock size={16} />, theme: 'lime' },
    ];

    const activeTypes = types.filter(t => filterQuery.includes(`'${t.value}'`));
    if (activeTypes.length > 0) {
      configs.push({
        id: 'finance-types',
        label: 'Transaction Class',
        value: activeTypes.map(t => t.label).join(', '),
        icon: activeTypes.map(t => t.icon),
        theme: 'lime' as BadgeTheme,
        onRemove: () => activeTypes.forEach(t => onRemoveFilter(`'${t.value}'`))
      });
    }

    // Statuses
    const statuses = [
      { key: 'SUCCESS', label: 'Success', icon: <CheckCircle size={16} />, theme: 'lime' },
      { key: 'PENDING', label: 'Pending', icon: <Clock size={16} />, theme: 'amber' },
      { key: 'FAILED', label: 'Failed', icon: <AlertCircle size={16} />, theme: 'red' },
      { key: 'COMPLETED', label: 'Completed', icon: <CheckCircle size={16} />, theme: 'lime' },
    ];

    const activeStatuses = statuses.filter(s => filterQuery.includes(`'${s.key}'`));
    if (activeStatuses.length > 0) {
      configs.push({
        id: 'finance-statuses',
        label: 'Settlement Scope',
        value: activeStatuses.map(s => s.label).join(', '),
        icon: activeStatuses.map(s => s.icon),
        theme: activeStatuses.length === 1 ? (activeStatuses[0].theme as BadgeTheme) : 'lime',
        onRemove: () => activeStatuses.forEach(s => onRemoveFilter(`'${s.key}'`))
      });
    }

    return configs;
  }, [filterQuery, onRemoveFilter]);

  return <TableFilterBadges badges={filterBadges} />;
}
