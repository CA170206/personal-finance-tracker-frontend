import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action? This cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4 mb-6">
        <div
          className={`p-3 rounded-xl flex-shrink-0 ${
            isDanger
              ? 'bg-rose-500/15 text-rose-500 border border-rose-500/20'
              : 'bg-amber-500/15 text-amber-500 border border-amber-500/20'
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-brand-muted leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-border">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-brand-muted hover:text-brand-text hover:bg-brand-elevated rounded-xl transition-colors border border-transparent"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all duration-200 shadow-sm flex items-center gap-2 ${
            isDanger
              ? 'bg-brand-rose hover:bg-rose-600 active:scale-95'
              : 'bg-brand-emerald hover:bg-brand-emeraldHover active:scale-95'
          }`}
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : null}
          <span>{confirmText}</span>
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;