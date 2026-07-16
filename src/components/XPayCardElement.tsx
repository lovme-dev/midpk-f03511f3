import React, { useEffect, useRef, useState } from 'react';
import { useXpay } from './XPayProvider';

interface XPayCardElementProps {
  onReady?: (event: any) => void;
  onError?: (error: string) => void;
  containerId?: string;
}

const XPayCardElement: React.FC<XPayCardElementProps> = ({
  onReady,
  onError,
  containerId = 'xpay-card-element',
}) => {
  const { xpay, isReady } = useXpay();
  const [elementReady, setElementReady] = useState(false);
  const elementRef = useRef<any>(null);

  useEffect(() => {
    if (!isReady || !xpay || elementReady) return;

    const options = {
      override: true,
      paymentMethods: ['card'],
      fields: {
        creditCard: {
          placeholder: '1234 1234 1234 1234',
          label: 'Card Number',
        },
        exp: {
          placeholder: 'MM/YY',
          label: 'Expiry',
        },
        cvc: {
          placeholder: 'CVC',
          label: 'Security Code',
        },
      },
      style: {
        '.input': {
          'border': '1px solid #e5e7eb',
          'border-radius': '6px',
          'padding': '12px',
          'font-size': '14px',
          'background-color': '#f9fafb',
          'transition': 'border-color 0.2s ease',
        },
        '.input:focus': {
          'border-color': '#3e82ff',
          'box-shadow': '0 0 0 2px rgba(62, 130, 255, 0.1)',
          'outline': 'none',
        },
        '.invalid': {
          'border-color': '#ef4444',
        },
        '.label': {
          'font-size': '10px',
          'font-weight': '700',
          'color': '#6b7280',
          'text-transform': 'uppercase',
          'letter-spacing': '-0.02em',
          'margin-bottom': '4px',
        },
        '::placeholder': {
          'color': '#d1d5db',
        },
      },
    };

    try {
      const element = xpay.element(`#${containerId}`, options);
      elementRef.current = element;
      setElementReady(true);
      onReady?.({ ready: true });
      console.log('[XPay] Card element mounted');
    } catch (error: any) {
      console.error('[XPay] Failed to mount card element:', error);
      onError?.(error.message || 'Failed to load payment form');
    }

    return () => {
      // Cleanup if needed
      elementRef.current = null;
    };
  }, [isReady, xpay, containerId, onReady, onError, elementReady]);

  return (
    <div className="xpay-card-element-wrapper">
      <div 
        id={containerId} 
        className="xpay-card-element min-h-[200px]"
        style={{ minHeight: '200px' }}
      />
      {!elementReady && isReady && (
        <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2" />
          Loading secure payment form...
        </div>
      )}
    </div>
  );
};

export default XPayCardElement;
