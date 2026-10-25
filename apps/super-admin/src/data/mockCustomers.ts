import type { Customer } from '@repo/types';
import { MOCK_CUSTOMERS_LIST } from '@repo/mock';

/**
 * Unified mock customer data for Eatzy Super Admin sourced from @repo/mock
 */
export const mockCustomers: Customer[] = MOCK_CUSTOMERS_LIST;

/**
 * Get customer by ID
 */
export function getCustomerById(id: number): Customer | undefined {
  return mockCustomers.find((customer) => customer.id === id);
}

/**
 * Get customers by status
 */
export function getCustomersByStatus(status: Customer['status']): Customer[] {
  return mockCustomers.filter((customer) => customer.status === status);
}

/**
 * Get active customers
 */
export function getActiveCustomers(): Customer[] {
  return getCustomersByStatus('active');
}

/**
 * Get disabled customers
 */
export function getDisabledCustomers(): Customer[] {
  return getCustomersByStatus('disabled');
}
