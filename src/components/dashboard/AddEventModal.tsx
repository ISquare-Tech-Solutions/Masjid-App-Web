'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { CloseIcon, ChevronDownIcon, CalendarIcon, UploadIcon } from '@/components/ui/Icons';
import type { Event } from '@/types';

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event?: Event | null; // If provided, we are in Edit mode
}

export default function AddEventModal({ isOpen, onClose, event }: AddEventModalProps) {
    const isEditMode = !!event;

    // Form State
    const [title, setTitle] = useState('');
    const [speaker, setSpeaker] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [venue, setVenue] = useState('Masjid Abu Bakar'); // Default as per design
    const [imageName, setImageName] = useState('');

    // Reset or Populate form when modal opens/event changes
    useEffect(() => {
        if (isOpen) {
            if (event) {
                setTitle(event.title);
                setSpeaker(event.speaker || '');
                // Parse date/time from event.date/startTime if needed
                // For now just setting placeholders or existing values
                setDate('2025-10-17');
                setTime(event.startTime);
                setDescription(event.description || '');
                setLink('');
                setVenue(event.location || 'Masjid Abu Bakar');
                setImageName('');
            } else {
                // Reset
                setTitle('');
                setSpeaker('');
                setDate('');
                setTime('');
                setDescription('');
                setLink('');
                setVenue('Masjid Abu Bakar');
                setImageName('');
            }
        }
    }, [isOpen, event]);

    const handleSave = () => {
        // Logic to save event
        console.log('Saving event:', { title, speaker, date, time, description, link, venue });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px] p-0 overflow-hidden">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <h2 className="text-[24px] font-bold font-inter text-[var(--grey-800)]">
                        {isEditMode ? 'Update Event Information' : 'Add New Event'}
                    </h2>
                    <button onClick={onClose} className="p-2 bg-[rgba(7,119,52,0.1)] rounded-[8px] hover:bg-[rgba(7,119,52,0.2)] transition-colors">
                        <CloseIcon size={20} className="text-[var(--brand)]" />
                    </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Event Title */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold font-inter text-[#4b4b4b] tracking-[0.16px]">
                            Event Title
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                className="w-full h-[48px] px-[21px] border border-[var(--border-01)] rounded-[12px] text-[16px] font-inter text-[var(--grey-800)] placeholder:text-[#8e8e8e] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                            />
                        </div>
                    </div>

                    {/* Row: Speaker & Date/Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Speaker */}
                        <div className="space-y-2">
                            <label className="block text-[16px] font-semibold font-inter text-[#4b4b4b] tracking-[0.16px]">
                                Speaker
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={speaker}
                                    onChange={(e) => setSpeaker(e.target.value)}
                                    placeholder="Speaker Name"
                                    className="w-full h-[48px] px-[21px] border border-[var(--border-01)] rounded-[12px] text-[16px] font-inter text-[var(--grey-800)] placeholder:text-[#8e8e8e] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                                />
                                <ChevronDownIcon className="absolute right-[21px] top-1/2 -translate-y-1/2 text-[#8e8e8e] pointer-events-none" size={20} />
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="space-y-2">
                            <label className="block text-[16px] font-semibold font-inter text-[#4b4b4b] tracking-[0.16px]">
                                Date & Time
                            </label>
                            <div className="relative">
                                <button className="w-full h-[48px] px-[21px] border border-[var(--border-01)] rounded-[12px] flex items-center justify-between bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[var(--brand)]">
                                    <span className="text-[16px] font-inter text-[var(--grey-800)]">
                                        {date && time ? `${date} ${time}` : 'Select Date & Time'}
                                    </span>
                                    <CalendarIcon className="text-[var(--grey-800)]" size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold font-inter text-[#4b4b4b] tracking-[0.16px]">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            className="w-full h-[120px] p-[21px] border border-[var(--border-01)] rounded-[12px] text-[16px] font-inter text-[var(--grey-800)] placeholder:text-[#8e8e8e] focus:outline-none focus:ring-1 focus:ring-[var(--brand)] resize-none"
                        />
                    </div>

                    {/* Row: Link & Venue */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Registration Link */}
                        <div className="space-y-2">
                            <label className="block text-[16px] font-semibold font-inter text-[#4b4b4b] tracking-[0.16px]">
                                Registration Link <span className="font-normal font-inter">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="Link"
                                className="w-full h-[48px] px-[21px] border border-[var(--border-01)] rounded-[12px] text-[16px] font-inter text-[var(--grey-800)] placeholder:text-[#8e8e8e] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                            />
                        </div>

                        {/* Venue */}
                        <div className="space-y-2">
                            <label className="block text-[16px] font-semibold font-inter text-[#4b4b4b] tracking-[0.16px]">
                                Venue
                            </label>
                            <input
                                type="text"
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                                placeholder="Venue"
                                className="w-full h-[48px] px-[21px] border border-[var(--border-01)] rounded-[12px] text-[16px] font-inter text-[var(--grey-800)] placeholder:text-[#8e8e8e] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                            />
                        </div>
                    </div>

                    {/* Row: Upload Image & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Upload Image */}
                        <div className="space-y-2">
                            <label className="block text-[16px] font-semibold font-inter text-[#4b4b4b] tracking-[0.16px]">
                                Upload Image <span className="font-normal font-inter">(Optional)</span>
                            </label>
                            <label className="flex items-center justify-between w-full h-[48px] px-[21px] border border-[var(--border-01)] rounded-[12px] cursor-pointer hover:bg-gray-50 transition-colors">
                                <span className={`text-[16px] font-inter ${imageName ? 'text-[var(--grey-800)]' : 'text-[#8e8e8e]'}`}>
                                    {imageName || 'Image Upload'}
                                </span>
                                <UploadIcon className="text-[#8e8e8e]" size={20} />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setImageName(e.target.files[0].name);
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        {/* Location (Hidden in design but present in list) - keeping it optional/hidden or same as venue? 
                             Design Node 261:5703 shows it opacity-0, so hidden? 
                             "Venue" handles the physical location. I'll stick to Venue.
                         */}
                    </div>

                    <p className="text-[12px] font-inter text-[#696969]">
                        *When you publish the event is goes live in the Mobile App*
                    </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-6 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="h-[44px] px-[24px] border border-[var(--border-01)] rounded-[12px] text-[16px] font-medium font-inter text-[#4b4b4b] hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <div className="flex items-center gap-6">
                        {isEditMode ? (
                            <button
                                onClick={handleSave} // Save draft logic?
                                className="h-[44px] px-[24px] border border-[var(--border-01)] rounded-[12px] text-[16px] font-medium font-inter text-[#4b4b4b] hover:bg-gray-50 transition-colors"
                            >
                                Save as Draft
                            </button>
                        ) : null}

                        <button
                            onClick={handleSave}
                            className="h-[44px] px-[24px] bg-[var(--brand)] rounded-[12px] text-[16px] font-medium font-inter text-white hover:bg-[var(--brand-06)] transition-colors shadow-sm"
                        >
                            {isEditMode ? 'Save & Publish' : 'Publish'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
