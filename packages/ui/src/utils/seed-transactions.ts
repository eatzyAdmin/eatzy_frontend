/**
 * ========================================
 * DRIVER WALLET & TRANSACTIONS
 * ========================================
 * Transactions must match with delivered orders
 */

import type { Transaction } from './localStorage-manager';

export const SEED_TRANSACTIONS: Transaction[] = [
  // EARNING từ ord-1004 (delivered)
  {
    id: 'tx-1',
    driverId: 'drv-1',
    type: 'EARNING',
    amount: 18000, // 15000 fee * 1.2 = 18000
    description: 'Thu nhập đơn EZ-1004',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'COMPLETED',
    orderId: 'ord-1004',
  },

  // EARNING từ ord-1005 (delivered)
  {
    id: 'tx-2',
    driverId: 'drv-1',
    type: 'EARNING',
    amount: 21600, // 18000 fee * 1.2 = 21600
    description: 'Thu nhập đơn EZ-1005',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    status: 'COMPLETED',
    orderId: 'ord-1005',
  },

  // EARNING từ ord-1006 (delivered)
  {
    id: 'tx-3',
    driverId: 'drv-1',
    type: 'EARNING',
    amount: 36000, // 30000 fee * 1.2 = 36000
    description: 'Thu nhập đơn EZ-1006',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(),
    status: 'COMPLETED',
    orderId: 'ord-1006',
  },

  // E ARNING từ ord-1007 (delivered)
  {
    id: 'tx-4',
    driverId: 'drv-1',
    type: 'EARNING',
    amount: 18000, // 15000 fee * 1.2 = 18000
    description: 'Thu nhập đơn EZ-1007',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 71).toISOString(),
    status: 'COMPLETED',
    orderId: 'ord-1007',
  },

  // EARNING từ ord-1008 (delivered)
  {
    id: 'tx-5',
    driverId: 'drv-1',
    type: 'EARNING',
    amount: 24000, // 20000 fee * 1.2 = 24000
    description: 'Thu nhập đơn EZ-1008',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 119).toISOString(),
    status: 'COMPLETED',
    orderId: 'ord-1008',
  },

  // COD_REMITTANCE - Nộp tiền COD
  {
    id: 'tx-6',
    driverId: 'drv-1',
    type: 'COD_REMITTANCE',
    amount: -500000,
    description: 'Nộp tiền COD về hệ thống',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'COMPLETED',
  },

  // WITHDRAWAL - Rút tiền (pending)
  {
    id: 'tx-7',
    driverId: 'drv-1',
    type: 'WITHDRAWAL',
    amount: -2000000,
    description: 'Rút tiền về Techcombank',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: 'PENDING',
  },

  // TOP_UP - Nạp tiền
  {
    id: 'tx-8',
    driverId: 'drv-1',
    type: 'TOP_UP',
    amount: 1000000,
    description: 'Nạp tiền vào ví',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    status: 'COMPLETED',
  },
];

// Calculate wallet balances
const completedTransactions = SEED_TRANSACTIONS.filter(t => t.status === 'COMPLETED');
const pendingTransactions = SEED_TRANSACTIONS.filter(t => t.status === 'PENDING');

export const CALCULATED_AVAILABLE_BALANCE = completedTransactions.reduce((sum, t) => sum + t.amount, 0) + 2500000; // 2500000 là số dư ban đầu
export const CALCULATED_PENDING_BALANCE = Math.abs(pendingTransactions.reduce((sum, t) => sum + t.amount, 0));
export const TOTAL_EARNINGS = SEED_TRANSACTIONS
  .filter(t => t.type === 'EARNING' && t.status === 'COMPLETED')
  .reduce((sum, t) => sum + t.amount, 0);
