'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { CloseIcon } from '@/components/ui/Icons';
import TimePicker from '@/components/ui/TimePicker';
import type { Announcement } from '@/types';
import { createAnnouncement, updateAnnouncement, type CreateAnnouncementData } from '@/lib/api/announcements';

interface AddAnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    announcement?: Announcement | null; // For editing if needed in the future
}

/* ── Helper: parse "10:30 AM" → "10:30" (24h) ── */
function parseTime12to24(t: string): string {
    if (!t) return '';
    const match = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return '';
    let h = parseInt(match[1], 10);
    const m = match[2];
    const p = match[3].toUpperCase();
    if (p === 'PM' && h < 12) h += 12;
    if (p === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${m}`;
}

export default function AddAnnouncementModal({ isOpen, onClose, announcement }: AddAnnouncementModalProps) {
    const isEditMode = !!announcement;

    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [scheduleMode, setScheduleMode] = useState(false);
    const [scheduleDate, setScheduleDate] = useState(''); // YYYY-MM-DD
    const [scheduleTime, setScheduleTime] = useState(''); // HH:MM

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset or Populate form when modal opens
    useEffect(() => {
        if (isOpen) {
            setError(null);
            if (announcement) {
                setTitle(announcement.title || '');
                setMessage(announcement.message || announcement.description || '');
                if (announcement.scheduledAt || announcement.status === 'scheduled') {
                    setScheduleMode(true);
                    try {
                        const d = new Date(announcement.scheduledAt || announcement.date || Date.now());
                        if (!isNaN(d.getTime())) {
                            setScheduleDate(d.toISOString().split('T')[0]);
                        } else {
                            setScheduleDate('');
                        }
                    } catch {
                        setScheduleDate('');
                    }
                    setScheduleTime(parseTime12to24(announcement.time || ''));
                } else {
                    setScheduleMode(false);
                    setScheduleDate('');
                    setScheduleTime('');
                }
            } else {
                setTitle('');
                setMessage('');
                setScheduleMode(false);
                setScheduleDate('');
                setScheduleTime('');
            }
        }
    }, [isOpen, announcement]);

    const submitAnnouncement = async (status: 'sent' | 'scheduled') => {
        if (!title || !message) {
            setError("Title and Message are required.");
            return;
        }

        let isoDateTime: string | undefined = undefined;

        if (status === 'scheduled') {
            if (!scheduleDate) {
                setError("Schedule Date is required when scheduling.");
                return;
            }
            const timePart = scheduleTime ? `${scheduleTime}:00` : '00:00:00';
            isoDateTime = `${scheduleDate}T${timePart}Z`;
        } else {
            // If sending now, we can omit scheduledAt or set it to current UTC
            isoDateTime = new Date().toISOString(); 
        }

        setIsSaving(true);
        setError(null);

        try {
            const data: CreateAnnouncementData = {
                title,
                message,
                status,
            };
            
            if (isoDateTime) {
                data.scheduledAt = isoDateTime;
            }

            if (isEditMode && announcement?.id) {
                await updateAnnouncement(announcement.id, data);
            } else {
                await createAnnouncement(data);
            }
            onClose();
        } catch (err: any) {
            setError(err?.message || "An error occurred while saving the announcement.");
            console.error('Failed to save announcement:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSend = () => {
        submitAnnouncement('sent');
    };

    const handleSave = () => {
        submitAnnouncement('scheduled');
    };

    const handleScheduleClick = () => {
        setScheduleMode(true);
    };

    const handleCancel = () => {
        if (scheduleMode && !isEditMode) {
            // If we just clicked 'Schedule' from a new blank form, go back to immediate send view
            setScheduleMode(false);
        } else {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[680px] p-0">
            <div className="bg-white rounded-[24px] p-[24px] flex flex-col gap-[24px]">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <h2 className="font-inter font-bold text-[24px] text-[var(--grey-800)] leading-normal">
                        {isEditMode ? 'Update Announcement' : (scheduleMode ? 'Schedule for later' : 'Add New Announcements')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-[36px] h-[36px] flex items-center justify-center bg-[rgba(7,119,52,0.1)] rounded-[8px] hover:bg-[rgba(7,119,52,0.2)] transition-colors shrink-0"
                        disabled={isSaving}
                    >
                        <CloseIcon size={24} className="text-[var(--grey-800)]" />
                    </button>
                </div>
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {/* Title Field */}
                <div className="flex flex-col gap-[8px]">
                    <label className="font-inter font-semibold text-[16px] text-[var(--grey-800)] tracking-[0.16px] leading-none">
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Masjid Maintanence Work Tomorrow"
                        className="w-full h-[48px] px-[21px] border border-[var(--border-01)] rounded-[12px] font-inter font-normal text-[16px] text-[var(--grey-800)] placeholder:text-[#666d80] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                    />
                </div>

                {/* Message Field */}
                <div className="flex flex-col gap-[8px]">
                    <label className="font-inter font-semibold text-[16px] text-[var(--grey-800)] tracking-[0.16px] leading-none">
                        Message
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please note that the masjid will undego light maintanence tomorrow from 10 AM to 1 PM. Prayer halls will remain accessiblw"
                        className="w-full h-[168px] px-[21px] py-[16px] border border-[var(--border-01)] rounded-[12px] font-inter font-normal text-[16px] text-[var(--grey-800)] placeholder:text-[#666d80] focus:outline-none focus:ring-1 focus:ring-[var(--brand)] resize-none"
                    />
                </div>

                {/* Date & Time — only visible in schedule mode */}
                {scheduleMode && (
                    <div className="flex gap-[24px]">
                        {/* Date */}
                        <div className="flex-1 flex flex-col gap-[8px]">
                            <label className="font-inter font-semibold text-[16px] text-[var(--grey-800)] tracking-[0.16px] leading-none">
                                Date
                            </label>
                            <input
                                type="date"
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                className="w-full h-[48px] px-[21px] border border-[var(--border-01)] rounded-[12px] font-inter font-normal text-[16px] text-[var(--grey-800)] placeholder:text-[#666d80] focus:outline-none focus:ring-1 focus:ring-[var(--brand)] appearance-none"
                                style={{ colorScheme: 'light' }}
                            />
                        </div>
                        {/* Time */}
                        <div className="flex-1 flex flex-col gap-[8px]">
                            <label className="font-inter font-semibold text-[16px] text-[var(--grey-800)] tracking-[0.16px] leading-none">
                                Time
                            </label>
                            <TimePicker
                                value={scheduleTime}
                                onChange={setScheduleTime}
                                placeholder="00:00"
                            />
                        </div>
                    </div>
                )}

                {/* Note */}
                <p className="font-inter font-normal text-[12px] text-[#666d80] leading-normal">
                    {scheduleMode
                        ? "*When you Save the date & Time it'll Automatically send the mesage on the schedule time**"
                        : '*When you publish the event in goes live in the Mobile App**'}
                </p>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-[24px]">
                    <button
                        onClick={handleCancel}
                        className="h-[44px] px-[24px] flex items-center justify-center border border-[var(--border-01)] rounded-[12px] font-inter font-medium text-[16px] text-[var(--grey-800)] text-center hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    {scheduleMode ? (
                        /* Schedule mode: just Save */
                        <button
                            onClick={handleSave}
                            className="h-[44px] px-[24px] flex items-center justify-center bg-[var(--brand)] rounded-[12px] font-inter font-medium text-[16px] text-white text-center hover:bg-[#065d29] transition-colors"
                        >
                            Save
                        </button>
                    ) : (
                        /* Default mode: Schedule + Send Now */
                        <div className="flex items-center gap-[24px]">
                            <button
                                onClick={handleScheduleClick}
                                className="h-[44px] px-[24px] flex items-center justify-center border border-[var(--border-01)] rounded-[12px] font-inter font-medium text-[16px] text-[var(--grey-800)] text-center hover:bg-gray-50 transition-colors"
                            >
                                Schedule
                            </button>
                            <button
                                onClick={handleSend}
                                className="h-[44px] px-[24px] flex items-center justify-center bg-[var(--brand)] rounded-[12px] font-inter font-medium text-[16px] text-white text-center hover:bg-[#065d29] transition-colors"
                            >
                                Send Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
