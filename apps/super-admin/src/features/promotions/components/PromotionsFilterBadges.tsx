'use client';

import React, { useMemo } from 'react';
import { TableFilterBadges, BadgeTheme } from '@repo/ui';
import {
  CheckCircle, Ban, Percent, Tag, Truck,
  DollarSign
} from '@repo/ui/icons';
import { DiscountType } from '@repo/types';

interface PromotionsFilterBadgesProps {
  filterQuery: string;
  onRemoveFilter: (filter: string) => void;
}

export default function PromotionsFilterBadges({ filterQuery, onRemoveFilter }: PromotionsFilterBadgesProps) {
  const filterBadges = useMemo(() => {
    const configs: any[] = [];

    // Execution Group
    const execution: { key: string; label: string; icon: React.ReactNode; theme: BadgeTheme }[] = [];
    if (filterQuery.includes('active:true')) execution.push({ key: 'active:true', label: 'Currently Running', icon: <CheckCircle size={16} />, theme: 'lime' });
    if (filterQuery.includes('active:false')) execution.push({ key: 'active:false', label: 'Paused / Draft', icon: <Ban size={16} />, theme: 'amber' });
    if (execution.length > 0) {
      configs.push({
        id: 'promo-execution',
        label: 'Execution State',
        value: execution.map(e => e.label).join(', '),
        icon: execution.map(e => e.icon),
        theme: execution.length === 1 ? (execution[0].theme as BadgeTheme) : 'lime',
        onRemove: () => execution.forEach(e => onRemoveFilter(e.key))
      });
    }

    // Logic Group
    const logics: { key: string; label: string; icon: React.ReactNode }[] = [];
    const discountTypes = [DiscountType.PERCENTAGE, DiscountType.FIXED, DiscountType.FREESHIP];
    discountTypes.forEach(t => {
      if (filterQuery.includes(`discountType:'${t}'`)) {
        let value = '';
        let icon = <Tag size={16} />;
        if (t === DiscountType.PERCENTAGE) { value = 'Percentage Off'; icon = <Percent size={16} />; }
        else if (t === DiscountType.FIXED) { value = 'Fixed Amount'; icon = <Tag size={16} />; }
        else if (t === DiscountType.FREESHIP) { value = 'Free Delivery'; icon = <Truck size={16} />; }

        logics.push({ key: `discountType:'${t}'`, label: value, icon });
      }
    });

    if (logics.length > 0) {
      configs.push({
        id: 'promo-logic',
        label: 'Promotion Logic',
        value: logics.map(l => l.label).join(', '),
        icon: logics.map(l => l.icon),
        theme: 'lime' as BadgeTheme,
        onRemove: () => logics.forEach(l => onRemoveFilter(l.key))
      });
    }

    const minOrderMatch = filterQuery.match(/minOrderValue >= (\d+)/);
    if (minOrderMatch) {
      configs.push({
        id: 'min-order',
        label: 'Minimum Threshold',
        value: `≥ ${Number(minOrderMatch[1]).toLocaleString()} Đ`,
        icon: <DollarSign size={16} />,
        theme: 'amber' as BadgeTheme,
        onRemove: () => onRemoveFilter(minOrderMatch[0])
      });
    }

    return configs;
  }, [filterQuery, onRemoveFilter]);

  return <TableFilterBadges badges={filterBadges} />;
}
