'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { MegaphoneIcon } from '@/components/ui/Icons';

interface PublishCampaignModalProps {
  isOpen: boolean;
  campaignTitle: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function PublishCampaignModal({ isOpen, campaignTitle, onClose, onConfirm }: PublishCampaignModalProps) {
  const [publishing, setPublishing] = useState(false);

  const handleConfirm = async () => {
    setPublishing(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] w-full">
      <div className="p-[24px] flex flex-col gap-[32px] items-center">
        {/* Icon + Text */}
        <div className="flex flex-col gap-[16px] items-center justify-center w-full">
          <div className="w-[48px] h-[48px] rounded-[99px] bg-white border border-[#e2e8f0] flex items-center justify-center">
            <MegaphoneIcon size={24} className="text-[#36394a]" />
          </div>
          <div className="flex flex-col gap-[6px] items-center text-center">
            <p className="text-[20px] font-bold text-[#36394a]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Publish Campaign?
            </p>
            <p className="text-[16px] text-[#666d80] font-normal max-w-[400px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              You are about to publish{' '}
              <span className="font-semibold text-[#36394a]">&ldquo;{campaignTitle}&rdquo;</span>{' '}
              to users. Please confirm all details are correct.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-[22px] items-center w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={publishing}
            className="flex-1 h-[43px] border border-[#e2e8f0] rounded-[8px] text-[16px] font-bold text-[#4b4b4b] hover:bg-[var(--neutral-50)] transition-colors disabled:opacity-50"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={publishing}
            className="flex-1 h-[43px] bg-[var(--brand)] rounded-[8px] text-[16px] font-bold text-white hover:bg-[#046c4e] transition-colors disabled:opacity-50"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {publishing ? 'Publishing...' : 'Create & Publish'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
