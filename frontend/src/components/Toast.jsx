import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, ShoppingCart, Heart, Info, X } from 'lucide-react';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  cart: ShoppingCart,
  wishlist: Heart,
  info: Info,
};

const TONES = {
  success: {
    bar: 'bg-emerald-500',
    icon: 'text-emerald-600',
    bg: 'bg-white',
    border: 'border-gray-200',
  },
  error: {
    bar: 'bg-red-500',
    icon: 'text-red-500',
    bg: 'bg-white',
    border: 'border-gray-200',
  },
  cart: {
    bar: 'bg-gray-950',
    icon: 'text-gray-950',
    bg: 'bg-white',
    border: 'border-gray-200',
  },
  wishlist: {
    bar: 'bg-pink-500',
    icon: 'text-pink-500',
    bg: 'bg-white',
    border: 'border-gray-200',
  },
  info: {
    bar: 'bg-sky-500',
    icon: 'text-sky-500',
    bg: 'bg-white',
    border: 'border-gray-200',
  },
};

const Toast = ({ message, type = 'success', onClose, product }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = setTimeout(() => setVisible(true), 10);

    // Auto-dismiss
    const dismissTimer = setTimeout(() => {
      handleClose();
    }, 3500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
    };
  }, []);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const tone = TONES[type] || TONES.success;
  const Icon = ICONS[type] || ICONS.success;
  const productImage = product?.image || product?.images?.[0];

  return (
    <div
      className={`fixed right-5 top-5 z-[9999] w-[380px] max-w-[calc(100vw-40px)] overflow-hidden border shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out ${tone.bg} ${tone.border} ${
        visible && !exiting
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
      role="alert"
    >
      {/* Accent bar at top */}
      <div className={`h-[3px] w-full ${tone.bar}`} />

      <div className="flex items-start gap-4 p-4">
        {/* Product thumbnail or icon */}
        {productImage ? (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border border-gray-100 bg-gray-50">
            <img
              src={productImage}
              alt={product?.name || ''}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center ${tone.icon}`}>
            <Icon size={24} strokeWidth={2} />
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gray-400">
            {type === 'cart'
              ? 'Shopping Cart'
              : type === 'wishlist'
              ? 'Wishlist'
              : type === 'error'
              ? 'Error'
              : 'BeautyBliss'}
          </p>
          <p className="mt-1 text-sm font-bold leading-snug text-gray-950">
            {message}
          </p>
          {product?.name && (
            <p className="mt-0.5 truncate text-xs text-gray-500">
              {product.name}
            </p>
          )}
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="shrink-0 p-1 text-gray-400 transition hover:text-gray-950"
          aria-label="Close notification"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] w-full bg-gray-100">
        <div
          className={`h-full ${tone.bar} transition-none`}
          style={{
            animation: 'toast-progress 3.5s linear forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Toast;
