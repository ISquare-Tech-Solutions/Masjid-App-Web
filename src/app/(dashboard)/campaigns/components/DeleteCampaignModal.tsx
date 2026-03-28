'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { TrashIcon } from '@/components/ui/Icons';

interface DeleteCampaignModalProps {
  isOpen: boolean;
  campaignTitle: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteCampaignModal({ isOpen, campaignTitle, onClose, onConfirm }: DeleteCampaignModalProps) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] w-full">
      <div className="p-[24px] flex flex-col gap-[32px] items-center">
        {/* Icon + Text */}
        <div className="flex flex-col gap-[16px] items-center justify-center w-full">
          <div className="w-[48px] h-[48px] rounded-[99px] bg-[#fff5f5] border border-[#fecdd3] flex items-center justify-center">
            <TrashIcon size={24} className="text-[#f64c4c]" />
          </div>
          <div className="flex flex-col gap-[6px] items-center text-center">
            <p className="text-[20px] font-bold text-[#36394a]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Delete Campaign?
            </p>
            <p className="text-[16px] text-[#666d80] font-normal max-w-[400px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              You are about to permanently delete{' '}
              <span className="font-semibold text-[#36394a]">&ldquo;{campaignTitle}&rdquo;</span>.
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-[22px] items-center w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex-1 h-[43px] border border-[#e2e8f0] rounded-[8px] text-[16px] font-bold text-[#4b4b4b] hover:bg-[var(--neutral-50)] transition-colors disabled:opacity-50"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 h-[43px] bg-[#f64c4c] rounded-[8px] text-[16px] font-bold text-white hover:bg-red-600 transition-colors disabled:opacity-50"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
