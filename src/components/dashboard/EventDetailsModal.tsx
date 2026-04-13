import Modal from '@/components/ui/Modal';
import { EditIcon } from '@/components/ui/Icons';
import ModalCloseButton from '@/components/ui/ModalCloseButton';
import type { Event } from '@/types';

interface EventDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event | null;
    onEdit: (event: Event) => void;
    onCancelRequest?: (event: Event) => void;
}

export default function EventDetailsModal({ isOpen, onClose, event, onEdit, onCancelRequest }: EventDetailsModalProps) {
    if (!event) return null;

    const isCancelled = event.status?.toLowerCase() === 'cancelled';

    const handleCancel = () => {
        if (!onCancelRequest || !event.id) return;
        onCancelRequest(event);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[680px] p-0 overflow-hidden">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <h2 className="text-[24px] font-bold font-inter text-[var(--grey-800)]">
                        Event Details
                    </h2>
                    <ModalCloseButton onClick={onClose} />
                </div>

                {/* Details Grid */}
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Title */}
                    <div className="flex items-start gap-4">
                        <div className="w-[175px] shrink-0 text-[16px] font-medium font-inter text-[#666d80]">
                            Event Title
                        </div>
                        <div className="text-[16px] font-medium font-inter text-[var(--grey-800)]">
                            {event.title}
                        </div>
                    </div>

                    {/* Speaker */}
                    <div className="flex items-start gap-4">
                        <div className="w-[175px] shrink-0 text-[16px] font-medium font-inter text-[#666d80]">
                            Speaker
                        </div>
                        <div className="text-[16px] font-medium font-inter text-[var(--grey-800)]">
                            {event.speaker || '-'}
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-start gap-4">
                        <div className="w-[175px] shrink-0 text-[16px] font-medium font-inter text-[#666d80]">
                            Date & Time
                        </div>
                        <div className="text-[16px] font-medium font-inter text-[var(--grey-800)]">
                            {event.date} {event.startTime}
                        </div>
                    </div>

                    {/* Venue */}
                    <div className="flex items-start gap-4">
                        <div className="w-[175px] shrink-0 text-[16px] font-medium font-inter text-[#666d80]">
                            Venue
                        </div>
                        <div className="text-[16px] font-medium font-inter text-[var(--grey-800)]">
                            {event.venue || event.location || 'Masjid Abu Bakar'}
                        </div>
                    </div>

                    {/* Registration Link */}
                    <div className="flex items-start gap-4">
                        <div className="w-[175px] shrink-0 text-[16px] font-medium font-inter text-[#666d80]">
                            Registration Link
                        </div>
                        <div className="text-[16px] font-medium font-inter text-[var(--grey-800)]">
                            {event.link || 'None'}
                        </div>
                    </div>

                    {/* Message / Description */}
                    <div className="flex items-start gap-4">
                        <div className="w-[175px] shrink-0 text-[16px] font-medium font-inter text-[#666d80]">
                            Message
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="text-[16px] font-medium font-inter text-[var(--grey-800)] whitespace-pre-wrap">
                                {event.description || 'No description provided.'}
                            </div>
                            {event.images && event.images.length > 0 && (
                                <img
                                    src={event.images[0]}
                                    alt={event.title}
                                    className="w-full max-h-[300px] object-cover rounded-[12px]"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-6 pt-4 border-t border-gray-100">
                    {onCancelRequest && !isCancelled && (
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 h-[44px] px-[24px] border border-red-200 text-red-600 rounded-[12px] text-[16px] font-medium font-inter hover:bg-red-50 transition-colors mr-auto"
                        >
                            Cancel Event
                        </button>
                    )}

                    {!isCancelled && (
                        <button
                            onClick={() => onEdit(event)}
                            className="flex items-center gap-2 h-[44px] px-[24px] border border-[var(--border-01)] rounded-[12px] text-[16px] font-medium font-inter text-[#4b4b4b] hover:bg-gray-50 transition-colors"
                        >
                            <EditIcon size={20} />
                            Edit
                        </button>
                    )}

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
