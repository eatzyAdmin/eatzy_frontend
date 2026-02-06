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

    // Operations
    const statusTypes = [
      { key: 'OPEN', label: 'Open Stores', icon: <Play size={16} />, theme: 'lime' as BadgeTheme },
      { key: 'CLOSED', label: 'Closed Stores', icon: <Pause size={16} />, theme: 'red' as BadgeTheme },
      { key: 'PENDING', label: 'Pending Approval', icon: <Clock size={16} />, theme: 'amber' as BadgeTheme },
    ];

    statusTypes.forEach(s => {
      if (filterQuery.includes(`'${s.key}'`)) {
        configs.push({
          id: `status-${s.key}`,
          label: 'Store Operations',
          value: s.label,
          icon: s.icon,
          theme: s.theme,
          onRemove: () => onRemoveFilter(`'${s.key}'`)
        });
      }
    });

    if (filterQuery.includes('owner.isActive:false')) {
      configs.push({
        id: 'status-locked',
        label: 'Store Operations',
        value: 'Locked / Disabled',
        icon: <Lock size={16} />,
        theme: 'red' as BadgeTheme,
        onRemove: () => onRemoveFilter('owner.isActive:false')
      });
    }

    return configs;
  }, [filterQuery, onRemoveFilter]);

  return <TableFilterBadges badges={filterBadges} />;
}
