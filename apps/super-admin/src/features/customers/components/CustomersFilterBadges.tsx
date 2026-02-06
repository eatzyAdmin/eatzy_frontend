'use client';

import React, { useMemo } from 'react';
import { TableFilterBadges, BadgeTheme } from '@repo/ui';
import { ShieldCheck, Lock } from '@repo/ui/icons';

interface CustomersFilterBadgesProps {
  filterQuery: string;
  onRemoveFilter: (filter: string) => void;
}

export default function CustomersFilterBadges({ filterQuery, onRemoveFilter }: CustomersFilterBadgesProps) {
  const filterBadges = useMemo(() => {
    const configs: any[] = [];

    if (filterQuery.includes('user.isActive:true')) {
      configs.push({ id: 'active', label: 'Account Status', value: 'Active Only', icon: <ShieldCheck size={16} />, theme: 'lime' as BadgeTheme, onRemove: () => onRemoveFilter('user.isActive:true') });
    }
    if (filterQuery.includes('user.isActive:false')) {
      configs.push({ id: 'locked', label: 'Account Status', value: 'Disabled Only', icon: <Lock size={16} />, theme: 'red' as BadgeTheme, onRemove: () => onRemoveFilter('user.isActive:false') });
    }

    return configs;
  }, [filterQuery, onRemoveFilter]);

  return <TableFilterBadges badges={filterBadges} />;
}
