'use client';

import React, { useMemo } from 'react';
import { TableFilterBadges, BadgeTheme } from '@repo/ui';
import {
  Play, Navigation, Pause, ShieldCheck, Lock,
  Bike, Truck, FileText
} from '@repo/ui/icons';

interface DriversFilterBadgesProps {
  filterQuery: string;
  onRemoveFilter: (filter: string) => void;
}

export default function DriversFilterBadges({ filterQuery, onRemoveFilter }: DriversFilterBadgesProps) {
  const filterBadges = useMemo(() => {
    const configs: any[] = [];

    // Delivery Status
    const pulses: { key: string; label: string; icon: React.ReactNode; theme: BadgeTheme }[] = [
      { key: 'AVAILABLE', label: 'Ready to Work', icon: <Play size={16} />, theme: 'lime' },
      { key: 'BUSY', label: 'Busy (In Delivery)', icon: <Navigation size={16} />, theme: 'amber' },
      { key: 'OFFLINE', label: 'Offline / Rest', icon: <Pause size={16} />, theme: 'red' },
    ];
    const activePulses = pulses.filter(s => filterQuery.includes(`'${s.key}'`));
    if (activePulses.length > 0) {
      configs.push({
        id: 'driver-pulses',
        label: 'Current Pulse',
        value: activePulses.map(p => p.label).join(', '),
        icon: activePulses.map(p => p.icon),
        theme: activePulses.length === 1 ? (activePulses[0].theme as BadgeTheme) : 'lime',
        onRemove: () => activePulses.forEach(p => onRemoveFilter(`'${p.key}'`))
      });
    }

    // Account Status
    const trusts: { key: string; label: string; icon: React.ReactNode; theme: BadgeTheme }[] = [];
    if (filterQuery.includes('user.isActive:true')) trusts.push({ key: 'user.isActive:true', label: 'Active (Unlocked)', icon: <ShieldCheck size={16} />, theme: 'lime' });
    if (filterQuery.includes('user.isActive:false')) trusts.push({ key: 'user.isActive:false', label: 'Locked Accounts', icon: <Lock size={16} />, theme: 'red' });
    if (trusts.length > 0) {
      configs.push({
        id: 'driver-trusts',
        label: 'Account Trust',
        value: trusts.map(t => t.label).join(', '),
        icon: trusts.map(t => t.icon),
        theme: trusts.length === 1 ? (trusts[0].theme as BadgeTheme) : 'lime',
        onRemove: () => trusts.forEach(t => onRemoveFilter(t.key))
      });
    }

    // Verification
    const compliance: { key: string; label: string; icon: React.ReactNode }[] = [];
    if (filterQuery.includes("national_id_status == 'APPROVED'")) compliance.push({ key: "national_id_status == 'APPROVED'", label: 'Verified ID Card', icon: <FileText size={16} /> });
    if (filterQuery.includes("driver_license_status == 'APPROVED'")) compliance.push({ key: "driver_license_status == 'APPROVED'", label: 'Valid Driving License', icon: <Bike size={16} /> });
    if (compliance.length > 0) {
      configs.push({
        id: 'driver-compliance',
        label: 'Compliance',
        value: compliance.map(c => c.label).join(', '),
        icon: compliance.map(c => c.icon),
        theme: 'orange' as BadgeTheme,
        onRemove: () => compliance.forEach(c => onRemoveFilter(c.key))
      });
    }

    // Vehicle
    const vehicles: { key: string; label: string; icon: React.ReactNode }[] = [];
    if (filterQuery.includes("'Motorcycle'")) vehicles.push({ key: "'Motorcycle'", label: 'Gas Motorcycle', icon: <Bike size={16} /> });
    if (filterQuery.includes("'Electric Bike'")) vehicles.push({ key: "'Electric Bike'", label: 'Electric Bike', icon: <Truck size={16} /> });
    if (vehicles.length > 0) {
      configs.push({
        id: 'driver-fleet',
        label: 'Fleet Type',
        value: vehicles.map(v => v.label).join(', '),
        icon: vehicles.map(v => v.icon),
        theme: 'lime' as BadgeTheme,
        onRemove: () => vehicles.forEach(v => onRemoveFilter(v.key))
      });
    }

    return configs;
  }, [filterQuery, onRemoveFilter]);

  return <TableFilterBadges badges={filterBadges} />;
}
