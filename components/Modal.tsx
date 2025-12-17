import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-zeith-black border border-white/10 p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h3 className="text-lg font-semibold text-white tracking-wide uppercase">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-zeith-metal transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
