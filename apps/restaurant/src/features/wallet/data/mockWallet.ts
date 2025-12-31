export const mockWallet = {
  balance: {
    available: 12500000,
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
  transactions: [
    {
      id: 'TRX-9982',
      date: '2025-12-31T10:30:00',
      type: 'revenue',
      description: 'Order #ORD-7721 Revenue',
      amount: 450000,
      status: 'completed',
      category: 'Food Order'
    },
    {
      id: 'TRX-9981',
      date: '2025-12-31T09:15:00',
      type: 'revenue',
      description: 'Order #ORD-7720 Revenue',
      amount: 120000,
      status: 'pending',
      category: 'Food Order'
    },
    {
      id: 'TRX-9980',
      date: '2025-12-30T15:20:00',
      type: 'withdrawal',
      description: 'Withdrawal to VCB *9988',
      amount: -5000000,
      status: 'completed',
      category: 'Payout'
    },
    {
      id: 'TRX-9979',
      date: '2025-12-30T14:10:00',
      type: 'fee',
      description: 'Commission Fee (Order #ORD-7719)',
      amount: -45000,
      status: 'completed',
      category: 'Platform Fee'
    },
    {
      id: 'TRX-9978',
      date: '2025-12-30T11:00:00',
      type: 'revenue',
      description: 'Order #ORD-7719 Revenue',
      amount: 890000,
      status: 'completed',
      category: 'Food Order'
    },
    {
      id: 'TRX-9977',
      date: '2025-12-29T20:30:00',
      type: 'revenue',
      description: 'Order #ORD-7718 Revenue',
      amount: 250000,
      status: 'completed',
      category: 'Food Order'
    },
    {
      id: 'TRX-9976',
      date: '2025-12-29T18:45:00',
      type: 'adjustment',
      description: 'Refund Adjustment #ORD-7700',
      amount: -150000,
      status: 'completed',
      category: 'Refund'
    }
  ]
};

export type WalletData = typeof mockWallet;
export type Transaction = typeof mockWallet.transactions[0];
