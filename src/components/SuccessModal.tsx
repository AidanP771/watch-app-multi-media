import React, { useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, message }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div
        ref={modalRef}
        className="bg-primary-light rounded-lg p-6 max-w-sm w-full mx-4 relative animate-slide-up"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-light hover:text-white transition"
          aria-label="Close success message"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
            <Check className="w-8 h-8 text-secondary" />
          </div>
          <p className="text-center text-white text-lg">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;