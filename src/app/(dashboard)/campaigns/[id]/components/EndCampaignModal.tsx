'use client';

import Modal from '@/components/ui/Modal';
import { CloseIcon } from '@/components/ui/Icons';

interface EndCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function EndCampaignModal({ isOpen, onClose, onConfirm }: EndCampaignModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[440px] w-full">
      <div className="p-[24px] flex flex-col gap-[20px]">
        <div className="flex items-start justify-between">
          <h2 className="text-[18px] font-bold text-[var(--grey-800)] leading-tight pr-[16px]">
            Are you sure you want to end this campaign?
          </h2>
          <button type="button" onClick={onClose} className="p-1 hover:bg-[var(--neutral-100)] rounded-[8px] transition-colors text-[var(--neutral-500)] shrink-0">
            <CloseIcon size={20} />
          </button>
        </div>

        <p className="text-[14px] text-[#667085] leading-[1.5]">
          Once ended, campaign will be removed from the mobile app
          <br />
          you can still view its donation history any time.
        </p>

        <div className="flex items-center gap-[16px] pt-[8px]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-[12px] text-[14px] font-medium text-[var(--grey-800)] bg-white border border-[var(--border-01)] rounded-[8px] hover:bg-[var(--neutral-100)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 py-[12px] text-[14px] font-medium text-white bg-[var(--error)] rounded-[8px] hover:bg-red-600 transition-colors"
          >
            Yes
          </button>
        </div>
      </div>
    </Modal>
  );
}
