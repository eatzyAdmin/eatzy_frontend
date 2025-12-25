/**
 * ========================================
 * INITIALIZATION FUNCTION
 * ========================================
 * Main function to initialize all data in localStorage
 */

import { STORAGE_KEYS, SEED_USERS, SYSTEM_PARAMS } from './localStorage-manager';
import { SEED_RESTAURANTS } from './seed-restaurants';
import { SEED_DISHES } from './seed-dishes';
import { MAIN_CUSTOMER, MAIN_DRIVER, OTHER_CUSTOMERS, OTHER_DRIVERS } from './seed-users';
import { SEED_ORDERS, CUSTOMER_TOTAL_SPENT, DRIVER_EARNINGS_FROM_ORDERS } from './seed-orders';
import { SEED_TRANSACTIONS, CALCULATED_AVAILABLE_BALANCE, TOTAL_EARNINGS } from './seed-transactions';

/**
 * Initialize all Eatzy data in localStorage
 * Should only run once when app first loads
 */
export function initializeEatzyData(): void {
  console.log('🚀 Initializing Eatzy localStorage data...');

  try {
    // Update calculated fields
    MAIN_CUSTOMER.totalSpent = CUSTOMER_TOTAL_SPENT;
    MAIN_DRIVER.totalEarnings = TOTAL_EARNINGS;
    MAIN_DRIVER.availableBalance = CALCULATED_AVAILABLE_BALANCE;
    MAIN_DRIVER.totalTrips = SEED_ORDERS.filter(o => o.driverId === 'drv-1' && o.status === 'DELIVERED').length;

    // 1. Users
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    console.log('✅ Users initialized:', SEED_USERS.length);

    // 2. Restaurants (NO VOUCHERS)
    localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(SEED_RESTAURANTS));
    console.log('✅ Restaurants initialized:', SEED_RESTAURANTS.length);

    // 3. Dishes
    localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(SEED_DISHES));
    console.log('✅ Dishes initialized:', SEED_DISHES.length);

    // 3. Customers
    const allCustomers = [MAIN_CUSTOMER, ...OTHER_CUSTOMERS];
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(allCustomers));
    console.log('✅ Customers initialized:', allCustomers.length);

    // 4. Drivers
    const allDrivers = [MAIN_DRIVER, ...OTHER_DRIVERS];
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(allDrivers));
    console.log('✅ Drivers initialized:', allDrivers.length);

    // 5. Orders
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
    console.log('✅ Orders initialized:', SEED_ORDERS.length);

    //  6. Transactions
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
    console.log('✅ Transactions initialized:', SEED_TRANSACTIONS.length);

    // 7. System Parameters
    localStorage.setItem(STORAGE_KEYS.SYSTEM_PARAMS, JSON.stringify(SYSTEM_PARAMS));
    console.log('✅ System Parameters initialized:', SYSTEM_PARAMS.length);

    // 8. Mark as initialized
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    localStorage.setItem('eatzy_data_version', '1.0.0');
    localStorage.setItem('eatzy_initialized_at', new Date().toISOString());

    console.log('🎉 Eatzy data initialization complete!');
    console.log('📊 Summary:');
    console.log(`  - Users: ${SEED_USERS.length}`);
    console.log(`  - Restaurants: ${SEED_RESTAURANTS.length}`);
    console.log(`  - Dishes: ${SEED_DISHES.length}`);
    console.log(`  - Customers: ${allCustomers.length}`);
    console.log(`  - Drivers: ${allDrivers.length}`);
    console.log(`  - Orders: ${SEED_ORDERS.length}`);
    console.log(`  - Transactions: ${SEED_TRANSACTIONS.length}`);
    console.log(`  - System Params: ${SYSTEM_PARAMS.length}`);
    console.log('');
    console.log('💰 Main Customer Total Spent:', CUSTOMER_TOTAL_SPENT.toLocaleString(), 'đ');
    console.log('💰 Main Driver Total Earnings:', TOTAL_EARNINGS.toLocaleString(), 'đ');
    console.log('💰 Main Driver Available Balance:', CALCULATED_AVAILABLE_BALANCE.toLocaleString(), 'đ');

  } catch (error) {
    console.error('❌ Error initializing Eatzy data:', error);
    throw error;
  }
}

/**
 * Clear all Eatzy data from localStorage
 */
export function clearEatzyData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  localStorage.removeItem('eatzy_data_version');
  localStorage.removeItem('eatzy_initialized_at');
  console.log('🧹 Eatzy data cleared');
}

/**
 * Check if data is initialized
 */
export function isDataInitialized(): boolean {
  return localStorage.getItem(STORAGE_KEYS.INITIALIZED) === 'true';
}

/**
 * Get data summary
 */
export function getDataSummary() {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const restaurants = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESTAURANTS) || '[]');
  const customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]');
  const drivers = JSON.parse(localStorage.getItem(STORAGE_KEYS.DRIVERS) || '[]');
  const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');

  return {
    initialized: isDataInitialized(),
    version: localStorage.getItem('eatzy_data_version'),
    initializedAt: localStorage.getItem('eatzy_initialized_at'),
    counts: {
      users: users.length,
      restaurants: restaurants.length,
      customers: customers.length,
      drivers: drivers.length,
      orders: orders.length,
      transactions: transactions.length,
    },
  };
}

/**
 * Login helper - set current user
 */
export function loginUser(username: string, password: string): any | null {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const user = users.find((u: any) => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    console.log('✅ Logged in as:', user.fullName, `(${user.role})`);
    return user;
  }

  console.log('❌ Login failed: Invalid credentials');
  return null;
}

/**
 * Logout helper
 */
export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  console.log('👋 Logged out');
}

/**
 * Get current user
 */
export function getCurrentUser(): any | null {
  const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userStr ? JSON.parse(userStr) : null;
}
