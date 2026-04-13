'use client';

import Modal from '@/components/ui/Modal';
import ModalCloseButton from '@/components/ui/ModalCloseButton';
import type { Announcement } from '@/types';

interface AnnouncementViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    announcement: Announcement | null;
}

export default function AnnouncementViewModal({ isOpen, onClose, announcement }: AnnouncementViewModalProps) {
    if (!announcement) return null;

    const statusLabel =
        announcement.status === 'scheduled' ? 'Scheduled'
        : announcement.status === 'draft' ? 'Draft'
        : 'Sent';

    const statusColor =
        announcement.status === 'scheduled' ? 'text-[#ff8156] border-[#ffa487]'
        : announcement.status === 'draft' ? 'text-[#ffad0d] border-[#ffc62b]'
        : 'text-[#47b881] border-[#6bc497]';

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[680px] p-0 overflow-hidden">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <h2 className="text-[24px] font-bold font-inter text-[var(--grey-800)]">
                        Announcement Details
                    </h2>
                    <ModalCloseButton onClick={onClose} />
                </div>

                {/* Details */}
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Title */}
                    <div className="flex items-start gap-4">
                        <div className="w-[175px] shrink-0 text-[16px] font-medium font-inter text-[#666d80]">
                            Title
                        </div>
                        <div className="text-[16px] font-medium font-inter text-[var(--grey-800)]">
                            {announcement.title}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-start gap-4">
                        <div className="w-[175px] shrink-0 text-[16px] font-medium font-inter text-[#666d80]">
                            Status
                        </div>
                        <span
                            className={`inline-flex items-center px-[8px] py-[4px] rounded-[8px] font-inter text-[12px] capitalize border bg-white ${statusColor}`}
                        >
                            {statusLabel}
                        </span>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-start gap-4">
                        <div className="w-[175px] shrink-0 text-[16px] font-medium font-inter text-[#666d80]">
                            {announcement.status === 'sent' ? 'Date Sent' : 'Scheduled For'}
                        </div>
                        <div className="text-[16px] font-medium font-inter text-[var(--grey-800)]">
                            {announcement.date
                                ? `${announcement.date}${announcement.time ? `  ${announcement.time}` : ''}`
                                : '—'}
                        </div>
                    </div>

                    {/* Message */}
                    <div className="flex items-start gap-4">
                        <div className="w-[175px] shrink-0 text-[16px] font-medium font-inter text-[#666d80]">
                            Message
                        </div>
                        <div className="flex-1 text-[16px] font-medium font-inter text-[var(--grey-800)] whitespace-pre-wrap leading-relaxed">
                            {announcement.message || announcement.description || 'No message provided.'}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-6 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="h-[44px] px-[24px] bg-[var(--brand)] rounded-[12px] text-[16px] font-medium font-inter text-white hover:bg-[#065d29] transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}
