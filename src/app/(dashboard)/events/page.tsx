'use client';

import { useState } from 'react';
import {
    CalendarIcon,
    PlusIcon,
    ListIcon,
    FilterIcon,
    EditIcon,
    EyeIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@/components/ui/Icons';
import type { Event as EventType, Announcement } from '@/types';
import AnnouncementItem from '@/components/dashboard/AnnouncementItem';
import CalendarView from '@/components/dashboard/CalendarView';
import AddEventModal from '@/components/dashboard/AddEventModal';
import EventDetailsModal from '@/components/dashboard/EventDetailsModal';

// Mock Data
const mockEvents: EventType[] = [
    {
        id: '1',
        title: 'Friday Community Gathering',
        category: 'Community',
        description: 'Please note that the masjid will undergo light maintenance during this time.',
        date: '17 Oct 2025',
        startTime: '09:00 AM',
        endTime: '',
        status: 'sent',
        speaker: 'Ustadh Sultan Ahmed',
        location: 'Masjid Abu Bakar'
    },
    {
        id: '2',
        title: 'Ramadan Prep Talk',
        category: 'Religious',
        description: 'Preparing for the holy month with Sheikh Ahmed.',
        date: '20 Oct 2025',
        startTime: '06:30 PM',
        endTime: '',
        status: 'draft',
        speaker: 'Sheikh Ahmed',
        location: 'Main Hall'
    },
    {
        id: '3',
        title: 'Youth Sports Day',
        category: 'Social',
        description: 'Football and Cricket tournament for local youth.',
        date: '15 Sep 2025',
        startTime: '10:00 AM',
        endTime: '',
        status: 'past',
        location: 'Sports Complex'
    },
];

const mockAnnouncements: Announcement[] = [
    {
        id: '1',
        title: 'Parking Renovation',
        description: 'The main parking lot will be closed for renovation from 10th to 15th March.',
        date: '08 Mar 2026',
    },
    {
        id: '2',
        title: 'New Carpet Installation',
        description: 'We are installing new carpets in the main prayer hall.',
        date: '12 Mar 2026',
    },
];

export default function EventsPage() {
    const [activeTab, setActiveTab] = useState<'events' | 'announcements'>('events');
    const [activeFilter, setActiveFilter] = useState<'All' | 'Upcoming' | 'Past' | 'Drafts'>('All');
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
    const [viewEvent, setViewEvent] = useState<EventType | null>(null);

    const handleAddEvent = () => {
        setEditingEvent(null);
        setIsAddModalOpen(true);
    };

    const handleEditEvent = (event: EventType) => {
        if (viewEvent) setViewEvent(null); // Close view modal if open
        setEditingEvent(event);
        setIsAddModalOpen(true);
    };

    const handleViewEvent = (event: EventType) => {
        setViewEvent(event);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setEditingEvent(null);
    };

    const handleCloseViewModal = () => {
        setViewEvent(null);
    };


    const filteredEvents = mockEvents.filter((event) => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Upcoming') return event.status === 'sent';
        if (activeFilter === 'Past') return event.status === 'past';
        if (activeFilter === 'Drafts') return event.status === 'draft';
        return true;
    });

    return (
        <div className="space-y-[24px]">
            {/* Header */}
            <div className="flex justify-between items-center h-[52px]">
                <div>
                    <h1 className="text-[28px] font-inter font-bold text-[var(--grey-800)] leading-none tracking-tight">
                        Event & Announcements
                    </h1>
                </div>
                <button
                    onClick={handleAddEvent}
                    className="flex items-center gap-[10px] bg-[var(--brand)] text-white px-[24px] py-[16px] rounded-[12px] hover:bg-[#065d29] transition-all duration-200 h-[44px] shadow-sm hover:shadow-md active:scale-95"
                >
                    <PlusIcon size={20} className="stroke-[2]" />
                    <span className="font-inter font-medium text-[16px] leading-none">New Event</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center bg-[rgba(7,119,52,0.05)] h-[69px] w-full rounded-t-[12px] border-b border-[var(--brand-10)]">
                <button
                    onClick={() => setActiveTab('events')}
                    className={`
                        w-[250px] h-full flex items-center justify-center 
                        font-inter text-[18px] transition-all duration-300 relative
                        ${activeTab === 'events'
                            ? 'text-[var(--brand)] font-semibold border-b-[2px] border-[var(--brand)] bg-white/50'
                            : 'text-[var(--grey-800)] font-normal border-b-[2px] border-transparent hover:text-[var(--brand)] hover:bg-white/30'
                        }
                    `}
                >
                    Events
                </button>
                <button
                    onClick={() => setActiveTab('announcements')}
                    className={`
                        w-[250px] h-full flex items-center justify-center 
                        font-inter text-[18px] transition-all duration-300 relative
                        ${activeTab === 'announcements'
                            ? 'text-[var(--brand)] font-semibold border-b-[2px] border-[var(--brand)] bg-white/50'
                            : 'text-[var(--grey-800)] font-normal border-b-[2px] border-transparent hover:text-[var(--brand)] hover:bg-white/30'
                        }
                    `}
                >
                    Announcements
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'events' ? (
                <>
                    {viewMode === 'list' ? (
                        <div className="border border-[var(--border-01)] rounded-[24px] p-[24px] bg-white shadow-[0px_4px_21px_0px_rgba(0,0,0,0.05)]">
                            {/* Controls */}
                            <div className="flex justify-between items-center mb-[24px] h-[40px]">
                                <div className="flex items-center">
                                    {['All', 'Upcoming', 'Past', 'Drafts'].map((filter, index, arr) => (
                                        <button
                                            key={filter}
                                            onClick={() => setActiveFilter(filter as any)}
                                            className={`
                                        h-[40px] px-[16px] py-[10px] font-inter text-[14px] 
                                        border border-[var(--border-01)] bg-[#fafbfb]
                                        transition-all duration-200 flex items-center justify-center gap-[8px]
                                        hover:bg-gray-50
                                        ${activeFilter === filter ? 'font-bold text-[var(--grey-800)] bg-white shadow-sm ring-1 ring-black/5 z-10' : 'font-normal text-[#667085]'}
                                        ${index === 0 ? 'rounded-l-[8px]' : ''}
                                        ${index === arr.length - 1 ? 'rounded-r-[8px]' : ''}
                                        ${index !== 0 ? '-ml-[1px]' : ''}
                                    `}
                                        >
                                            {filter === 'All' && (
                                                <div className="w-[6px] h-[6px] bg-[var(--grey-800)] rounded-full mb-[1px]" />
                                            )}
                                            {filter}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-[7px]">
                                    <div className="flex items-center gap-[16px] mr-[7px]">
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`w-[36px] h-[36px] flex items-center justify-center rounded-[8px] transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-[var(--grey-800)]' : 'text-[var(--grey-400)] hover:bg-gray-50'}`}
                                        >
                                            <ListIcon size={24} className="stroke-[1.5]" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('calendar')}
                                            className={`w-[36px] h-[36px] flex items-center justify-center rounded-[8px] transition-colors ${(viewMode as string) === 'calendar' ? 'bg-gray-100 text-[var(--grey-800)]' : 'text-[var(--grey-400)] hover:bg-gray-50'}`}
                                        >
                                            <CalendarIcon size={24} className="stroke-[1.5]" />
                                        </button>
                                    </div>
                                    <div className="relative w-[258px] h-[40px]">
                                        <input
                                            type="text"
                                            placeholder="Search Events"
                                            className="w-full h-full pl-[38px] pr-[14px] border border-[var(--border-01)] rounded-[11px] font-inter text-[12px] text-[#666d80] placeholder-[#666d80] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-all"
                                        />
                                        <div className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[var(--grey-400)]">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="h-[2px] bg-[#f6f6f6] rounded-[2px] w-full mb-[24px]" />

                            {/* Table */}
                            <div className="w-full overflow-hidden rounded-[12px] border border-[var(--border-01)]">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#fafbfb] border-b border-[var(--border-01)] h-[48px]">
                                        <tr>
                                            <th className="w-[52px] px-[16px] py-[14px] border-r border-[var(--border-01)]">
                                                <input type="checkbox" className="w-[20px] h-[20px] rounded-[4px] border-[#e6e6e6] text-[var(--brand)] focus:ring-0 checked:bg-[var(--brand)] cursor-pointer transition-colors" />
                                            </th>
                                            <th className="px-[16px] py-[14px] font-inter font-medium text-[12px] text-[#667085] uppercase tracking-wide border-r border-[var(--border-01)]">Title</th>
                                            <th className="px-[16px] py-[14px] font-inter font-medium text-[12px] text-[#667085] uppercase tracking-wide border-r border-[var(--border-01)]">Date & Time</th>
                                            <th className="px-[16px] py-[14px] font-inter font-medium text-[12px] text-[#667085] uppercase tracking-wide border-r border-[var(--border-01)]">Message</th>
                                            <th className="px-[16px] py-[14px] font-inter font-medium text-[12px] text-[#667085] uppercase tracking-wide border-r border-[var(--border-01)]">Type</th>
                                            <th className="px-[16px] py-[14px] font-inter font-medium text-[12px] text-[#667085] uppercase tracking-wide border-r border-[var(--border-01)]">Status</th>
                                            <th className="px-[16px] py-[14px] font-inter font-medium text-[12px] text-[#667085] uppercase tracking-wide">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-none bg-white">
                                        {filteredEvents.map((event) => (
                                            <tr key={event.id} className="group hover:bg-[#fafbfb] transition-colors duration-150">
                                                <td className="w-[52px] h-[70px] border-b border-[var(--border-01)] px-[16px] py-[22px] border-r">
                                                    <input type="checkbox" className="w-[20px] h-[20px] rounded-[4px] border-[#e6e6e6] text-[var(--brand)] focus:ring-0 checked:bg-[var(--brand)] cursor-pointer transition-colors" />
                                                </td>
                                                <td className="h-[70px] px-[16px] py-[22px] border-b border-r border-[var(--border-01)] font-inter font-medium text-[14px] text-[#36394a]">
                                                    {event.title}
                                                </td>
                                                <td className="h-[70px] px-[16px] py-[22px] border-b border-r border-[var(--border-01)] font-inter font-medium text-[14px] text-[#666d80]">
                                                    {event.date}  <span className="ml-1 text-[#666d80] opacity-80">{event.startTime}</span>
                                                </td>
                                                <td className="h-[70px] px-[16px] py-[22px] border-b border-r border-[var(--border-01)] font-inter font-medium text-[14px] text-[#666d80] truncate max-w-[200px]" title={event.description}>
                                                    {event.description}
                                                </td>
                                                <td className="h-[70px] px-[16px] py-[22px] border-b border-r border-[var(--border-01)] font-inter font-medium text-[14px] text-[#666d80]">
                                                    {event.category}
                                                </td>
                                                <td className="h-[70px] px-[16px] py-[22px] border-b border-r border-[var(--border-01)]">
                                                    <span className={`
                                                inline-flex items-center px-[8px] py-[4px] rounded-[8px] text-[12px] font-inter font-normal capitalize border
                                                ${event.status === 'sent' ? 'bg-[#ECFDF3] text-[#47b881] border-[#6bc497]' : ''}
                                                ${event.status === 'draft' ? 'bg-[#F9FAFB] text-[#344054] border-[#D0D5DD]' : ''}
                                                ${event.status === 'past' ? 'bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]' : ''}
                                            `}>
                                                        {event.status}
                                                    </span>
                                                </td>
                                                <td className="h-[70px] px-[16px] py-[22px] border-b border-[var(--border-01)]">
                                                    <div className="flex items-center gap-[12px] opacity-70 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleViewEvent(event)}
                                                            className="text-[var(--grey-500)] hover:text-[var(--brand)] transition-colors p-1 hover:bg-[var(--brand-05)] rounded"
                                                        >
                                                            <EyeIcon size={20} className="stroke-[1.5]" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditEvent(event)}
                                                            className="text-[var(--grey-500)] hover:text-[var(--brand)] transition-colors p-1 hover:bg-[var(--brand-05)] rounded"
                                                        >
                                                            <EditIcon size={20} className="stroke-[1.5]" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination Footer */}
                                <div className="flex items-center justify-between h-[48px] px-0 mt-0 border-t border-[var(--border-01)] bg-white relative w-full">
                                    <p className="absolute left-[16px] top-[14px] font-dm-sans text-[14px] text-[#4b4b4b]">
                                        1-3 of 3 items
                                    </p>
                                    <div className="absolute right-[80px] top-[12px] flex items-center gap-[8px]">
                                        <div className="bg-[#f5f5f5] h-[23px] px-[11px] rounded-[8px] flex items-center justify-center gap-[8px] border border-transparent hover:border-[#e1e1e1] transition-colors cursor-pointer">
                                            <span className="font-dm-sans text-[14px] text-[#8e8e8e]">1</span>
                                            <ChevronDownIcon size={16} className="text-[#8e8e8e]" />
                                        </div>
                                        <span className="font-dm-sans text-[14px] text-[#4b4b4b]">of 1 pages</span>
                                    </div>
                                    <div className="absolute right-[16px] top-[14px] flex items-center gap-[8px]">
                                        <button className="rotate-180 flex items-center justify-center p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-30">
                                            <ChevronLeftIcon size={16} className="text-[#4b4b4b] stroke-[1.5]" />
                                        </button>
                                        <button className="flex items-center justify-center p-1 hover:bg-gray-100 rounded transition-colors">
                                            <ChevronRightIcon size={16} className="text-[#4b4b4b] stroke-[1.5]" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <CalendarView
                            events={filteredEvents}
                            currentDate={new Date()}
                            onDateChange={() => { }}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            onEventClick={handleViewEvent}
                        />
                    )}
                </>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockAnnouncements.map((announcement) => (
                        <AnnouncementItem key={announcement.id} announcement={announcement} />
                    ))}
                </div>
            )}

            {/* Modals */}
            <AddEventModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                event={editingEvent}
            />
            <EventDetailsModal
                isOpen={!!viewEvent}
                onClose={handleCloseViewModal}
                event={viewEvent}
                onEdit={handleEditEvent}
            />
        </div>
    );
}
