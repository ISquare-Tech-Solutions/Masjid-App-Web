'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { TrashIcon } from '@/components/ui/Icons';

export type EventConfirmType = 'cancelled' | 'upcoming' | 'past' | 'draft';

interface ConfirmModalProps {
  isOpen: boolean;
  eventType: EventConfirmType;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  /** Override the default title derived from eventType */
  title?: string;
  /** Override the default description derived from eventType */
  description?: string;
  /** Override the default confirm button label */
  confirmLabel?: string;
  /** Label shown on the confirm button while the async action is running */
  submittingLabel?: string;
  /**
   * 'danger'  → red confirm button  (default — backwards-compatible)
   * 'primary' → brand-green confirm button
   */
  confirmVariant?: 'danger' | 'primary';
  /** Swap the icon inside the coloured circle. Defaults to <TrashIcon>. */
  iconNode?: React.ReactNode;
  /** Tailwind bg + border classes for the icon container circle. */
  iconContainerClassName?: string;
}

const EVENT_CONFIRM_CONFIG: Record<
  EventConfirmType,
  { title: string; description: string; confirmLabel: string }
> = {
  cancelled: {
    title: 'Cancel Cancelled Event?',
    description:
      'This event has already been cancelled. No further changes will be made.',
    confirmLabel: 'Confirm',
  },
  upcoming: {
    title: 'Cancel Upcoming Event?',
    description:
      'This event is scheduled to take place. If cancelled, it will be moved to the Cancelled Events tab and members will no longer see it in the Community App.',
    confirmLabel: 'Cancel Event',
  },
  past: {
    title: 'Cancel Past Event?',
    description:
      'This event has already taken place. If cancelled, it will be moved to the Cancelled Events tab. All event data will be preserved.',
    confirmLabel: 'Cancel Event',
  },
  draft: {
    title: 'Cancel Draft Event?',
    description:
      'This draft has not been published yet. If cancelled, it will be moved to the Cancelled Events tab.',
    confirmLabel: 'Cancel Draft',
  },
};

export default function ConfirmModal({
  isOpen,
  eventType,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  submittingLabel,
  confirmVariant = 'danger',
  iconNode,
  iconContainerClassName,
}: ConfirmModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const config = EVENT_CONFIRM_CONFIG[eventType];
  const finalTitle = title ?? config.title;
  const finalDescription = description ?? config.description;
  const finalConfirmLabel = confirmLabel ?? config.confirmLabel;
  const finalSubmittingLabel = submittingLabel ?? 'Processing...';

  // Icon defaults
  const finalIcon = iconNode ?? <TrashIcon size={24} className="text-white" />;
  const finalIconContainerClassName =
    iconContainerClassName ?? 'bg-[#fca5a5] border-[#fee2e2]';

  // Confirm button styles
  const confirmBtnClass =
    confirmVariant === 'primary'
      ? 'bg-[var(--brand)] hover:bg-[#065d29]'
      : 'bg-[#ec2d30] hover:bg-[#d62629]';

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[500px] w-full"
      style={{
        borderRadius: '12px',
        boxShadow: '0px 4px 21px 0px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="p-[24px] flex flex-col gap-[32px]">
        {/* Icon and text */}
        <div className="flex gap-[16px] items-start w-full">
          <div
            className={`w-[48px] h-[48px] rounded-[28px] border-[6px] flex items-center justify-center shrink-0 ${finalIconContainerClassName}`}
          >
            {finalIcon}
          </div>
          <div className="flex flex-col gap-[6px] flex-1 min-w-0">
            <p
              className="text-[20px] font-bold text-[var(--grey-800)] leading-normal"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {finalTitle}
            </p>
            <p
              className="text-[16px] font-normal text-[var(--grey-100)] leading-normal"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {finalDescription}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-[22px] items-center w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 h-[43px] border border-[var(--border-01)] rounded-[8px] text-[16px] font-bold text-[var(--neutral-600)] hover:bg-gray-50 transition-colors disabled:opacity-50"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className={`w-[251px] h-[43px] rounded-[8px] text-[16px] font-bold text-white transition-colors disabled:opacity-50 ${confirmBtnClass}`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {submitting ? finalSubmittingLabel : finalConfirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
