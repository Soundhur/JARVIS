import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, children, confirmText = "Confirm", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900/70 border border-cyan-500/50 rounded-lg shadow-[0_0_25px_rgba(0,255,255,0.2)] w-full max-w-md m-4 flex flex-col font-mono"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-cyan-500/30">
          <h2 id="modal-title" className="text-cyan-300 text-xl tracking-wider">{title}</h2>
        </div>
        <div className="p-6 text-cyan-200">
          {children}
        </div>
        <div className="p-4 flex justify-end space-x-3 bg-black/30 rounded-b-lg">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-md border border-cyan-700 text-cyan-300 hover:bg-cyan-800/50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 rounded-md bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Modal;
