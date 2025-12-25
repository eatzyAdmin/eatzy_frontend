/**
 * ========================================
 * EATZY DATA INITIALIZER COMPONENT
 * ========================================
 * Use this component in your app root to initialize localStorage data
 */

'use client';

import { useEffect, useState } from 'react';
import { initializeEatzyData, isDataInitialized, getDataSummary } from '../utils/init-data';

export function EatzyDataInitializer({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    // Only initialize once
    if (isDataInitialized()) {
      console.log('ℹ️ Eatzy data already initialized');
      const summary = getDataSummary();
      console.log('📊 Data summary:', summary);
      setInitialized(true);
      return;
    }

    // Initialize data
    setInitializing(true);
    try {
      initializeEatzyData();
      setInitialized(true);
    } catch (error) {
      console.error('Failed to initialize Eatzy data:', error);
    } finally {
      setInitializing(false);
    }
  }, []);

  if (initializing) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{ fontSize: '24px' }}>🚀</div>
        <div>Initializing Eatzy data...</div>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{ fontSize: '48px' }}>🍽️</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Welcome to Eatzy</div>
        <div style={{ fontSize: '14px', color: '#666' }}>Preparing your experience...</div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Simple hook to check if data is ready
 */
export function useEatzyData() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(isDataInitialized());
  }, []);

  return { ready };
}
