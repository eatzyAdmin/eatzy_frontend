'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import SwipeConfirmationModal from '../modals/SwipeConfirmationModal';

interface SwipeConfirmationContextType {
  confirm: (config: SwipeConfirmationConfig) => void;
  abort: () => void;
}

interface SwipeConfirmationConfig {
  title: string;
  description: string;
  confirmText?: string;
  onConfirm: () => void | Promise<void>;
  type?: 'warning' | 'success' | 'danger' | 'info';
  processingDuration?: number;
}

const SwipeConfirmationContext = createContext<SwipeConfirmationContextType | undefined>(undefined);

export function SwipeConfirmationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<SwipeConfirmationConfig>({
    title: '',
    description: '',
    onConfirm: () => { }
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const confirm = useCallback((newConfig: SwipeConfirmationConfig) => {
    setConfig(newConfig);
    setIsOpen(true);
    setIsProcessing(false);
  }, []);

  const abort = useCallback(() => {
    setIsProcessing(false);
    setIsOpen(false);
  }, []);

  const handleConfirm = async () => {
    setIsProcessing(true);

    try {
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, config.processingDuration ?? 2000));

      if (config?.onConfirm) {
        await config.onConfirm();
      }
    } finally {
      setIsProcessing(false);
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    if (isProcessing) return; // Prevent closing during processing
    setIsOpen(false);
  };

  return (
    <SwipeConfirmationContext.Provider value={{ confirm, abort }}>
      {children}
      <SwipeConfirmationModal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={config.title}
        description={config.description}
        confirmText={config.confirmText || 'Xác nhận'}
        type={config.type || 'warning'}
        isProcessing={isProcessing}
      />
    </SwipeConfirmationContext.Provider>
  );
}

export function useSwipeConfirmation() {
  const context = useContext(SwipeConfirmationContext);
  if (!context) {
    throw new Error('useSwipeConfirmation must be used within SwipeConfirmationProvider');
  }
  return context;
}
