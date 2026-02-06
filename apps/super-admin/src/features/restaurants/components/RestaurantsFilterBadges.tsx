'use client';

import React, { useMemo } from 'react';
import { TableFilterBadges, BadgeTheme } from '@repo/ui';
import { Play, Pause, Lock, Clock } from '@repo/ui/icons';

interface RestaurantsFilterBadgesProps {
  filterQuery: string;
  onRemoveFilter: (filter: string) => void;
}

export default function RestaurantsFilterBadges({ filterQuery, onRemoveFilter }: RestaurantsFilterBadgesProps) {
  const filterBadges = useMemo(() => {
    const configs: any[] = [];

    // Operations Group
    const operations: { key: string; label: string; icon: React.ReactNode; theme: BadgeTheme }[] = [];
    const statusTypes = [
      { key: 'OPEN', label: 'Open Stores', icon: <Play size={16} />, theme: 'lime' },
      { key: 'CLOSED', label: 'Closed Stores', icon: <Pause size={16} />, theme: 'red' },
      { key: 'PENDING', label: 'Pending Approval', icon: <Clock size={16} />, theme: 'amber' },
    ];

    statusTypes.forEach(s => {
      if (filterQuery.includes(`'${s.key}'`)) {
        operations.push({ key: `'${s.key}'`, label: s.label, icon: s.icon, theme: s.theme as BadgeTheme });
      }
    });

    if (filterQuery.includes('owner.isActive:false')) {
      operations.push({
        key: 'owner.isActive:false',
        label: 'Locked / Disabled',
        icon: <Lock size={16} />,
        theme: 'red' as BadgeTheme
      });
    }

    if (operations.length > 0) {
      configs.push({
        id: 'restaurant-operations',
        label: 'Store Operations',
        value: operations.map(o => o.label).join(', '),
        icon: operations.map(o => o.icon),
        theme: operations.length === 1 ? operations[0].theme : 'lime' as BadgeTheme,
        onRemove: () => operations.forEach(o => onRemoveFilter(o.key))
      });
    }

    return configs;
  }, [filterQuery, onRemoveFilter]);

  return <TableFilterBadges badges={filterBadges} />;
}
