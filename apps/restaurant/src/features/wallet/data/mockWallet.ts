import { mockOrderHistory } from '../../history/data/mockHistory';

// Start with a base balance (Today's final balance)
const currentAvailableBalance = 12500000;

// Create transactions from orders (Revenue)
// We take the top 10 recent orders
const orderTrxs = mockOrderHistory.slice(0, 10).map(order => {
  // If order is cancelled/refunded, usually revenue is 0 or refund transaction.
  // For simplicity, we assume successful orders generate revenue, others might be failed logic.
  // We map order status to transaction status.
  const isSuccess = order.status === 'completed';

  return {
    id: `TRX-${Math.floor(Math.random() * 10000) + 1000}`, // Random TRX ID or derive from Order ID
    date: order.createdAt,
    type: 'revenue',
    description: `Order #${order.id} Revenue`,
    amount: order.netIncome, // Use Net Income
    status: isSuccess ? 'success' : 'failed',
    category: 'Food Order',
    orderId: order.id,
    balanceAfter: 0 // Calculated below
  };
});

// Create some Withdrawals
const withdrawals = [
  {
    id: 'TRX-8890',
    date: new Date(Date.now() - 86400000 * 1.5).toISOString(), // 1.5 days ago
    type: 'withdrawal',
    description: 'Withdrawal to VCB *9988',
    amount: -5000000,
    status: 'success',
    category: 'Withdrawal',
    orderId: undefined, // No order ID for withdrawals
    balanceAfter: 0
  },
  {
    id: 'TRX-8885',
    date: new Date(Date.now() - 86400000 * 3.5).toISOString(), // 3.5 days ago
    type: 'withdrawal',
    description: 'Withdrawal to VCB *9988',
    amount: -2500000,
    status: 'success',
    category: 'Withdrawal',
    orderId: undefined,
    balanceAfter: 0
  }
];

// Combine and Sort by Date Descending (Newest first)
let allTrxs = [...orderTrxs, ...withdrawals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Calculate running balance backwards
// We start with current balance, and for each transaction (going back in time), we calculate what the balance was BEFORE it.
// Actually, 'balanceAfter' for the newest transaction is the current balance.
// 'balanceAfter' for the next (older) transaction = (Current Balance - Newest Amount).
// Wait: 
// T1 (Today): +100. BalanceAfter: 1000. => BalanceBefore: 900.
// T2 (Yesterday): +200. BalanceAfter: 900. => BalanceBefore: 700.
// So: NextTrx.balanceAfter = CurrentTrx.balanceAfter - CurrentTrx.amount.
// (Subtracting revenue, Adding withdrawal).
// Note: Only if status is 'success'. Failed transactions don't change balance.

let runningBalance = currentAvailableBalance;

allTrxs = allTrxs.map(trx => {
  const balanceSnapshot = runningBalance;

  if (trx.status === 'success') {
    // If successfully processed, it contributed to the current running balance.
    // To find the balance for the *next* (older) transaction, we reverse this transaction's effect.
    // e.g. We have 1000 now. This trx added 100. So before this, we had 900.
    // So the runningBalance for the iteration of the older transaction should be 900.
    runningBalance -= trx.amount;
  }

  return { ...trx, balanceAfter: balanceSnapshot };
});

export const mockWallet = {
  balance: {
    available: currentAvailableBalance,
    pending: 3450000,
    total_earnings_today: 1250000,
    currency: '₫'
  },
  bank_account: {
    bank_name: 'Vietcombank',
    account_number: '**** **** **** 9988',
    holder_name: 'BURGER PRINCE STORE',
    branch: 'Ho Chi Minh City'
  },
  transactions: allTrxs
};

export type WalletData = typeof mockWallet;
export type Transaction = typeof mockWallet.transactions[0];
