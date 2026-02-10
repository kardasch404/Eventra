'use client';

import { ReactNode, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
}

/**
 * Professional Modal Component
 * 
 * Features:
 * - Portal-based rendering for proper z-index stacking
 * - Keyboard accessibility (ESC to close)
 * - Click outside to close
 * - Scroll lock when open
 * - Smooth animations
 * - Multiple size variants
 * - Centered or top-aligned
 */
export function Modal({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  size = 'lg',
  centered = true,
}: ModalProps) {
  // Handle ESC key to close modal
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4',
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={`flex min-h-full ${
          centered ? 'items-center justify-center' : 'items-start justify-center pt-16'
        } p-4`}
      >
        {/* Modal Content */}
        <div
          className={`relative ${sizeClasses[size]} w-full bg-white rounded-lg shadow-xl transform transition-all`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-gray-900"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="ml-auto inline-flex items-center justify-center w-8 h-8 text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.4 12l3.5-3.5-1.4-1.4-3.5 3.5-3.5-3.5-1.4 1.4 3.5 3.5-3.5 3.5 1.4 1.4 3.5-3.5 3.5 3.5 1.4-1.4z"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal in portal to ensure proper z-index stacking
  return createPortal(modalContent, document.body);
}

/**
 * Modal Header Component
 */
export function ModalHeader({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{children}</h3>
    </div>
  );
}

/**
 * Modal Body Component
 */
export function ModalBody({ children }: { children: ReactNode }) {
  return <div className="text-gray-600">{children}</div>;
}

/**
 * Modal Footer Component
 */
export function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
      {children}
    </div>
  );
}

/**
 * Modal Button Component
 */
interface ModalButtonProps {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export function ModalButton({
  onClick,
  variant = 'primary',
  children,
  type = 'button',
  disabled = false,
}: ModalButtonProps) {
  const variantClasses = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
}
