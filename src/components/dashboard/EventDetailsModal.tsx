'use client';

import Modal from '@/components/ui/Modal';
import { CloseIcon, EditIcon } from '@/components/ui/Icons';
import type { Event } from '@/types';

interface EventDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event | null;
    onEdit: (event: Event) => void;
}

export default function EventDetailsModal({ isOpen, onClose, event, onEdit }: EventDetailsModalProps) {
    if (!event) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px] p-0 overflow-hidden">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <h2 className="text-[24px] font-bold font-inter text-[var(--grey-800)]">
                        Event Details
                    </h2>
                    <button onClick={onClose} className="p-2 bg-[rgba(7,119,52,0.1)] rounded-[8px] hover:bg-[rgba(7,119,52,0.2)] transition-colors">
                        <CloseIcon size={20} className="text-[var(--brand)]" />
                    </button>
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
                            {event.location || 'Masjid Abu Bakar'}
                        </div>
                    </div>

                    {/* Registration Link */}
                    <div className="flex items-start gap-4">
                        <div className="w-[175px] shrink-0 text-[16px] font-medium font-inter text-[#666d80]">
                            Registration Link
                        </div>
                        <div className="text-[16px] font-medium font-inter text-[var(--grey-800)]">
                            No
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
                            {/* Placeholder for image if exists */}
                            {/* 
                            <div className="w-[183px] h-[137px] bg-gray-100 rounded-[8px] overflow-hidden">
                                <img src="/placeholder-event.jpg" alt="Event" className="w-full h-full object-cover" />
                            </div> 
                            */}
                        </div>
                    </div>

                    <p className="text-[12px] font-inter text-[#696969] mt-4">
                        *When you Save the date & Time it'll Automatically send the message at the schedule time*
                    </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-6 pt-4 border-t border-gray-100">
                    <button
                        onClick={() => onEdit(event)}
                        className="flex items-center gap-2 h-[44px] px-[24px] border border-[var(--border-01)] rounded-[12px] text-[16px] font-medium font-inter text-[#4b4b4b] hover:bg-gray-50 transition-colors"
                    >
                        <EditIcon size={20} />
                        Edit
                    </button>

                    <button
                        onClick={onClose}
                        className="h-[44px] px-[24px] bg-[var(--brand)] rounded-[12px] text-[16px] font-medium font-inter text-white hover:bg-[var(--brand-06)] transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}
