'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    PlusIcon,
    GridViewIcon,
    CalendarViewIcon,
    EditIcon,
    EyeIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@/components/ui/Icons';
import type { Event as EventType, Announcement } from '@/types';
import CalendarView from '@/components/dashboard/CalendarView';
import AddEventModal from '@/components/dashboard/AddEventModal';
import AddAnnouncementModal from '@/components/dashboard/AddAnnouncementModal';
import EventDetailsModal from '@/components/dashboard/EventDetailsModal';
import { getEvents, deleteEvent } from '@/lib/api/events';
import { getAnnouncements, deleteAnnouncement } from '@/lib/api/announcements';

// Date/Time helper functions
function formatDate(isoString: string) {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
        return '';
    }
}

function formatTime(isoString: string) {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
        return '';
    }
}

// Time filter options
type TimeFilterOption = 'ALL' | 'Upcoming' | 'Ongoing' | 'Past';
type AnnouncementTimeFilterOption = 'ALL' | 'Upcoming' | 'Past';

const EVENT_TIME_OPTIONS: TimeFilterOption[] = ['ALL', 'Upcoming', 'Ongoing', 'Past'];
const ANNOUNCEMENT_TIME_OPTIONS: AnnouncementTimeFilterOption[] = ['ALL', 'Upcoming', 'Past'];

export default function EventsPage() {
    const [activeTab, setActiveTab] = useState<'events' | 'announcements'>('events');
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    
    // --- Events State ---
    const [events, setEvents] = useState<EventType[]>([]);
    const [eventsLoading, setEventsLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'All' | 'Upcoming' | 'Past' | 'Drafts'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [eventsPage, setEventsPage] = useState(1);
    const [eventsPagination, setEventsPagination] = useState({ totalPages: 1, totalElements: 0, size: 10 });
    
    // --- Time Filter State ---
    const [timeFilter, setTimeFilter] = useState<TimeFilterOption>('ALL');
    const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
    const [announcementTimeFilter, setAnnouncementTimeFilter] = useState<AnnouncementTimeFilterOption>('ALL');
    const [announcementTimeDropdownOpen, setAnnouncementTimeDropdownOpen] = useState(false);
    const timeDropdownRef = useRef<HTMLDivElement>(null);
    const announcementTimeDropdownRef = useRef<HTMLDivElement>(null);

    // --- Announcements State ---
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [announcementsLoading, setAnnouncementsLoading] = useState(false);
    const [announcementFilter, setAnnouncementFilter] = useState<'All' | 'Scheduled' | 'Sent'>('All');
    const [announcementSearchQuery, setAnnouncementSearchQuery] = useState('');
    const [announcementsPage, setAnnouncementsPage] = useState(1);
    const [announcementsPagination, setAnnouncementsPagination] = useState({ totalPages: 1, totalElements: 0, size: 10 });

    // --- Modal State ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
    const [viewEvent, setViewEvent] = useState<EventType | null>(null);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

    // --- Click outside handler for time dropdowns ---
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target as Node)) {
                setTimeDropdownOpen(false);
            }
            if (announcementTimeDropdownRef.current && !announcementTimeDropdownRef.current.contains(event.target as Node)) {
                setAnnouncementTimeDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- API Fetching: Events ---
    const fetchEvents = useCallback(async () => {
        setEventsLoading(true);
        try {
            // Determine status filter parameter based on UI activeFilter
            let statusParam;
            let upcomingParam;
            let pastParam;

            if (activeFilter === 'Drafts') statusParam = 'draft';
            if (activeFilter === 'Upcoming') upcomingParam = true;
            if (activeFilter === 'Past') pastParam = true;

            // Apply time filter (overrides status-based upcoming/past if set)
            if (timeFilter === 'Upcoming') upcomingParam = true;
            if (timeFilter === 'Past') pastParam = true;

            const response = await getEvents({
                page: eventsPage - 1, // backend is 0-indexed
                size: 10,
                search: searchQuery || undefined,
                status: statusParam as any,
                upcoming: upcomingParam,
                past: pastParam,
            });

            // Process backend data for UI display
            const processedEvents = response.content.map(evt => ({
                ...evt,
                // Assign UI helper fields derived from backend ISO date representations
                date: evt.date ? formatDate(evt.date) : '',
                startTime: evt.date ? formatTime(evt.date) : '',
                // If backend does not provide endTime yet natively, keep it blank or derived.
                endTime: '',
            }));

            setEvents(processedEvents);
            setEventsPagination({
                totalPages: response.pagination.totalPages,
                totalElements: response.pagination.totalElements,
                size: response.pagination.size,
            });
        } catch (error) {
            console.error('Failed to fetch events:', error);
            // Optionally set error state here
        } finally {
            setEventsLoading(false);
        }
    }, [eventsPage, searchQuery, activeFilter, timeFilter]);

    // --- API Fetching: Announcements ---
    const fetchAnnouncements = useCallback(async () => {
        setAnnouncementsLoading(true);
        try {
            let statusParam;
            if (announcementFilter === 'Scheduled') statusParam = 'scheduled';
            if (announcementFilter === 'Sent') statusParam = 'sent';

            const response = await getAnnouncements({
                page: announcementsPage - 1, // backend is 0-indexed
                size: 10,
                search: announcementSearchQuery || undefined,
                status: statusParam as any,
            });

             let processedAnnouncements = response.content.map(ann => ({
                ...ann,
                // Map Backend DTO field "scheduledAt" to "date" and "time" for UI table
                date: ann.scheduledAt ? formatDate(ann.scheduledAt) : (ann.createdAt ? formatDate(ann.createdAt) : ''),
                time: ann.scheduledAt ? formatTime(ann.scheduledAt) : (ann.createdAt ? formatTime(ann.createdAt) : ''),
            }));

            // Client-side time filtering for announcements (backend doesn't support startDate/endDate)
            if (announcementTimeFilter === 'Upcoming') {
                const now = new Date();
                processedAnnouncements = processedAnnouncements.filter(ann => {
                    const annDate = ann.scheduledAt ? new Date(ann.scheduledAt) : (ann.createdAt ? new Date(ann.createdAt) : null);
                    return annDate && annDate > now;
                });
            } else if (announcementTimeFilter === 'Past') {
                const now = new Date();
                processedAnnouncements = processedAnnouncements.filter(ann => {
                    const annDate = ann.scheduledAt ? new Date(ann.scheduledAt) : (ann.createdAt ? new Date(ann.createdAt) : null);
                    return annDate && annDate <= now;
                });
            }

            setAnnouncements(processedAnnouncements);
            setAnnouncementsPagination({
                totalPages: response.pagination.totalPages,
                totalElements: response.pagination.totalElements,
                size: response.pagination.size,
            });
        } catch (error) {
            console.error('Failed to fetch announcements:', error);
        } finally {
            setAnnouncementsLoading(false);
        }
    }, [announcementsPage, announcementSearchQuery, announcementFilter, announcementTimeFilter]);

    // --- Fetch Triggers ---
    useEffect(() => {
        if (activeTab === 'events') {
            // Debounce search
            const timer = setTimeout(() => {
                fetchEvents();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [fetchEvents, activeTab]);

    useEffect(() => {
        if (activeTab === 'announcements') {
            const timer = setTimeout(() => {
                fetchAnnouncements();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [fetchAnnouncements, activeTab]);


    // --- Handlers ---
    const handleAddEvent = () => {
        if (activeTab === 'announcements') {
            setEditingAnnouncement(null);
            setIsAddAnnouncementOpen(true);
        } else {
            setEditingEvent(null);
            setIsAddModalOpen(true);
        }
    };

    const handleEditEvent = (event: EventType) => {
        if (viewEvent) setViewEvent(null); 
        setEditingEvent(event);
        setIsAddModalOpen(true);
    };

    const handleViewEvent = (event: EventType) => {
        setViewEvent(event);
    };

    const handleDeleteEvent = async (id: string) => {
        await deleteEvent(id);
        fetchEvents();
    };

    const handleEditAnnouncement = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setIsAddAnnouncementOpen(true);
    };

    const handleDeleteAnnouncement = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            try {
                await deleteAnnouncement(id);
                fetchAnnouncements();
            } catch (err) {
                console.error("Failed to delete announcement", err);
                alert("Failed to delete announcement.");
            }
        }
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setEditingEvent(null);
        // Refresh after create/edit
        fetchEvents();
    };

    const handleCloseAddAnnouncement = () => {
        setIsAddAnnouncementOpen(false);
        setEditingAnnouncement(null);
        fetchAnnouncements();
    }

    const handleCloseViewModal = () => {
        setViewEvent(null);
    };

    // --- Pagination Computations ---
    const eventsRangeStart = eventsPagination.totalElements === 0 ? 0 : (eventsPage - 1) * eventsPagination.size + 1;
    const eventsRangeEnd = Math.min(eventsPage * eventsPagination.size, eventsPagination.totalElements);

    const announcementsRangeStart = announcementsPagination.totalElements === 0 ? 0 : (announcementsPage - 1) * announcementsPagination.size + 1;
    const announcementsRangeEnd = Math.min(announcementsPage * announcementsPagination.size, announcementsPagination.totalElements);

    return (
        <div className="space-y-[24px]">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-[24px] font-urbanist font-semibold text-[var(--grey-800)] leading-normal">
                        Event & Announcements
                    </h1>
                </div>
                <button
                    onClick={handleAddEvent}
                    className="flex items-center gap-[10px] bg-[var(--brand)] text-white px-[24px] py-[16px] rounded-[12px] hover:bg-[#065d29] transition-all duration-200 h-[44px] shadow-sm hover:shadow-md active:scale-95"
                >
                    <PlusIcon size={20} className="stroke-[2]" />
                    <span className="font-inter font-medium text-[16px] leading-normal">
                        {activeTab === 'announcements' ? 'New Announcements' : 'New Event'}
                    </span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center bg-[rgba(7,119,52,0.05)] w-full">
                <button
                    onClick={() => setActiveTab('events')}
                    className={`
                        w-[250px] h-full flex items-center justify-center p-[16px]
                        font-urbanist text-[18px] transition-all duration-300 relative
                        ${activeTab === 'events'
                            ? 'text-[var(--brand)] font-semibold border-b-2 border-[var(--brand)]'
                            : 'text-[var(--grey-800)] font-normal'
                        }
                    `}
                >
                    Events
                </button>
                <button
                    onClick={() => setActiveTab('announcements')}
                    className={`
                        w-[250px] h-full flex items-center justify-center p-[16px]
                        font-urbanist text-[18px] transition-all duration-300 relative
                        ${activeTab === 'announcements'
                            ? 'text-[var(--brand)] font-semibold border-b-2 border-[var(--brand)]'
                            : 'text-[var(--grey-800)] font-normal'
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
                        <div className="border border-[var(--border-01)] rounded-[24px] p-[24px] bg-white">
                            {/* Controls */}
                            <div className="flex justify-between items-center mb-[24px] h-[40px]">
                                <div className="flex items-center">
                                    {['All', 'Upcoming', 'Past', 'Drafts'].map((filter, index, arr) => (
                                        <button
                                            key={filter}
                                            onClick={() => { setActiveFilter(filter as any); setEventsPage(1); }}
                                            className={`
                                        h-[40px] px-[16px] py-[10px] font-urbanist text-[14px] 
                                        border border-[var(--border-01)]
                                        transition-all duration-200 flex items-center justify-center gap-[8px]
                                        ${activeFilter === filter ? 'font-bold text-white bg-[var(--brand)] z-10 hover:bg-[#065d29]' : 'font-normal text-[var(--grey-800)] bg-white hover:bg-[rgba(7,119,52,0.05)] hover:text-[var(--brand)]'}
                                        ${index === 0 ? 'rounded-l-[8px]' : ''}
                                        ${index === arr.length - 1 ? 'rounded-r-[8px]' : ''}
                                        ${index !== 0 ? '-ml-[1px]' : ''}
                                    `}
                                        >
                                            {filter === 'All' && activeFilter === 'All' && (
                                                <div className="w-[10px] h-[10px] rounded-full"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" fill="white" stroke="white" strokeWidth="1" /></svg></div>
                                            )}
                                            {filter}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-[7px]">
                                    {/* Time Filter Dropdown */}
                                    <div className="relative" ref={timeDropdownRef}>
                                        <button
                                            id="events-time-filter-trigger"
                                            onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
                                            className={`flex items-center gap-[8px] bg-white border border-solid px-[12px] py-[8px] rounded-[12px] h-[42px] cursor-pointer transition-all duration-200 hover:shadow-sm ${
                                                timeFilter !== 'ALL'
                                                    ? 'border-[rgba(7,119,52,0.5)]'
                                                    : 'border-[rgba(7,119,52,0.1)]'
                                            }`}
                                        >
                                            <span className="font-inter font-medium text-[12px] leading-[18px] text-[#666d80] whitespace-nowrap">
                                                Time: {timeFilter === 'ALL' ? 'ALL' : timeFilter.toLowerCase()}
                                            </span>
                                            <svg
                                                width="18" height="18" viewBox="0 0 18 18" fill="none"
                                                className={`transition-transform duration-200 ${timeDropdownOpen ? 'rotate-180' : ''}`}
                                            >
                                                <path d="M14.94 6.71252L10.05 11.6025C9.4725 12.18 8.5275 12.18 7.95 11.6025L3.06 6.71252" stroke="#666d80" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                        {/* Dropdown Menu */}
                                        {timeDropdownOpen && (
                                            <div
                                                id="events-time-filter-dropdown"
                                                className="absolute top-[calc(100%+4px)] left-0 z-50 bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden shadow-md min-w-[160px] animate-in fade-in duration-150"
                                            >
                                                {EVENT_TIME_OPTIONS.map((option, index) => (
                                                    <button
                                                        key={option}
                                                        id={`events-time-option-${option.toLowerCase()}`}
                                                        onClick={() => {
                                                            setTimeFilter(option);
                                                            setTimeDropdownOpen(false);
                                                            setEventsPage(1);
                                                        }}
                                                        className={`w-full text-left px-[12px] py-[8px] font-inter font-normal text-[12px] transition-colors duration-150 ${
                                                            timeFilter === option
                                                                ? 'bg-[#077734] text-white'
                                                                : 'text-[#666d80] hover:bg-[rgba(7,119,52,0.05)]'
                                                        } ${
                                                            index === EVENT_TIME_OPTIONS.length - 1 ? 'rounded-b-[12px]' : ''
                                                        } ${
                                                            index === 0 ? 'rounded-t-[12px]' : ''
                                                        }`}
                                                    >
                                                        Time: {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative w-[342px] h-[40px]">
                                        <input
                                            type="text"
                                            placeholder="Search Events"
                                            value={searchQuery}
                                            onChange={(e) => { setSearchQuery(e.target.value); setEventsPage(1); }}
                                            className="w-full h-full pl-[38px] pr-[14px] border border-[var(--border-01)] rounded-[11px] font-urbanist text-[12px] text-[#666d80] placeholder-[#666d80] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-all"
                                        />
                                        <div className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[var(--grey-100)]">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                        </div>
                                    </div>
                                    <div className="border border-[var(--border-01)] rounded-[12px] flex items-center gap-[8px] px-[8px] py-[6px] bg-white">
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`flex items-center justify-center px-[12px] py-[8px] rounded-[8px] transition-colors ${viewMode === 'list' ? 'bg-[rgba(7,119,52,0.1)] text-[var(--brand)]' : 'text-[var(--grey-100)] hover:bg-gray-50'}`}
                                        >
                                            <GridViewIcon size={18} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('calendar')}
                                            className={`flex items-center justify-center px-[12px] py-[8px] rounded-[8px] transition-colors ${(viewMode as string) === 'calendar' ? 'bg-[rgba(7,119,52,0.1)] text-[var(--brand)]' : 'text-[var(--grey-100)] hover:bg-gray-50'}`}
                                        >
                                            <CalendarViewIcon size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="h-[2px] bg-[#f6f6f6] rounded-[2px] w-full mb-[24px]" />

                            {/* Table */}
                            <div className="w-full overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#fafbfb] border-b border-t border-[var(--border-01)] h-[48px]">
                                        <tr>
                                            <th className="w-[52px] px-[16px] py-[14px]">
                                                <input type="checkbox" className="w-[20px] h-[20px] rounded-[4px] border-[#e2e8f0] text-[var(--brand)] focus:ring-0 checked:bg-[var(--brand)] cursor-pointer transition-colors" />
                                            </th>
                                            <th className="px-[16px] py-[14px] font-urbanist font-medium text-[12px] text-[#666d80] uppercase">Title</th>
                                            <th className="px-[16px] py-[14px] font-urbanist font-medium text-[12px] text-[#666d80] uppercase">Date & Time</th>
                                            <th className="px-[16px] py-[14px] font-urbanist font-medium text-[12px] text-[#666d80] uppercase">Message</th>
                                            <th className="px-[16px] py-[14px] font-urbanist font-medium text-[12px] text-[#666d80] uppercase">Type</th>
                                            <th className="px-[16px] py-[14px] font-urbanist font-medium text-[12px] text-[#666d80] uppercase">Status</th>
                                            <th className="px-[16px] py-[14px] font-urbanist font-medium text-[12px] text-[#666d80] uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-none bg-white">
                                        {events.map((event) => (
                                            <tr key={event.id} className="group hover:bg-[#fafbfb] transition-colors duration-150">
                                                <td className="w-[52px] h-[70px] px-[16px] py-[22px]">
                                                    <input type="checkbox" className="w-[20px] h-[20px] rounded-[4px] border-[#e2e8f0] text-[var(--brand)] focus:ring-0 checked:bg-[var(--brand)] cursor-pointer transition-colors" />
                                                </td>
                                                <td className="h-[70px] px-[16px] py-[22px] font-urbanist font-medium text-[14px] text-[#666d80]">
                                                    {event.title}
                                                </td>
                                                <td className="h-[70px] px-[16px] py-[22px] font-urbanist font-medium text-[14px] text-[#666d80]">
                                                    {event.date}  {event.startTime}
                                                </td>
                                                <td className="h-[70px] px-[16px] py-[22px] font-urbanist font-medium text-[14px] text-[#666d80] truncate max-w-[200px]" title={event.description}>
                                                    {event.description}
                                                </td>
                                                <td className="h-[70px] px-[16px] py-[22px] font-urbanist font-medium text-[14px] text-[#666d80]">
                                                    {event.category}
                                                </td>
                                                <td className="h-[70px] px-[16px] py-[22px]">
                                                    <span className={`
                                                inline-flex items-center px-[8px] py-[4px] rounded-[8px] text-[12px] font-normal capitalize border
                                                ${event.status === 'sent' ? 'text-[#47b881] border-[#6bc497]' : ''}
                                                ${event.status === 'draft' ? 'text-[#344054] border-[#D0D5DD]' : ''}
                                                ${event.status === 'past' ? 'text-[#B42318] border-[#FECDCA]' : ''}
                                            `}
                                                        style={{ fontFamily: "'Inter Tight', sans-serif" }}
                                                    >
                                                        {event.status}
                                                    </span>
                                                </td>
                                                <td className="h-[70px] px-[16px] py-[22px]">
                                                    <div className="flex items-center gap-[12px]">
                                                        <button
                                                            onClick={() => handleViewEvent(event)}
                                                            className="text-[var(--grey-100)] hover:text-[var(--brand)] transition-colors p-1 hover:bg-[var(--brand-05)] rounded"
                                                        >
                                                            <EyeIcon size={20} className="stroke-[1.5]" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditEvent(event)}
                                                            className="text-[var(--grey-100)] hover:text-[var(--brand)] transition-colors p-1 hover:bg-[var(--brand-05)] rounded"
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
                                <div className="flex items-center justify-between h-[40px] px-0 mt-0 border-t border-[var(--border-01)] bg-white relative w-full">
                                    <p className="absolute left-0 top-[10px] font-dm-sans text-[14px] text-[#666d80]">
                                        {eventsRangeStart}-{eventsRangeEnd} of {eventsPagination.totalElements} items
                                    </p>
                                    <div className="absolute right-[64px] top-[8px] flex items-center gap-[8px]">
                                        <div className="bg-white h-[23px] px-[11px] rounded-[8px] flex items-center justify-center gap-[8px] cursor-pointer">
                                            <span className="font-dm-sans text-[14px] text-[#666d80]">{eventsPage}</span>
                                            <ChevronDownIcon size={16} className="text-[#666d80]" />
                                        </div>
                                        <span className="font-dm-sans text-[14px] text-[#666d80]">of {eventsPagination.totalPages} pages</span>
                                    </div>
                                    <div className="absolute right-0 top-1/2 -translate-y-[calc(50%-0.5px)] flex items-center gap-[8px]">
                                        <button
                                            onClick={() => setEventsPage(p => Math.max(1, p - 1))}
                                            disabled={eventsPage <= 1}
                                            className="flex items-center justify-center p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-30"
                                        >
                                            <ChevronLeftIcon size={16} className="text-[#666d80] stroke-[1.5]" />
                                        </button>
                                        <button
                                            onClick={() => setEventsPage(p => Math.min(eventsPagination.totalPages, p + 1))}
                                            disabled={eventsPage >= eventsPagination.totalPages}
                                            className="flex items-center justify-center p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-30"
                                        >
                                            <ChevronRightIcon size={16} className="text-[#666d80] stroke-[1.5]" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <CalendarView
                            events={events}
                            currentDate={new Date()}
                            onDateChange={() => { }}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            onEventClick={handleViewEvent}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                    )}
                </>
            ) : (
                <div className="border border-[var(--border-01)] rounded-[24px] p-[24px] bg-white">
                    {/* Controls */}
                    <div className="flex justify-between items-center mb-[16px] h-[40px]">
                        <div className="flex items-center">
                            {(['All', 'Scheduled'] as const).map((filter, index, arr) => (
                                <button
                                    key={filter}
                                    onClick={() => { setAnnouncementFilter(filter); setAnnouncementsPage(1); }}
                                    className={`
                                        h-[40px] px-[16px] py-[10px] font-urbanist text-[14px] 
                                        border border-[var(--border-01)]
                                        transition-all duration-200 flex items-center justify-center gap-[8px]
                                        ${announcementFilter === filter ? 'font-bold text-white bg-[var(--brand)] z-10 hover:bg-[#065d29]' : 'font-normal text-[var(--grey-800)] bg-white hover:bg-[rgba(7,119,52,0.05)] hover:text-[var(--brand)]'}
                                        ${index === 0 ? 'rounded-l-[8px]' : ''}
                                        ${index === arr.length - 1 ? 'rounded-r-[8px]' : ''}
                                        ${index !== 0 ? '-ml-[1px]' : ''}
                                    `}
                                >
                                    {filter === 'All' && announcementFilter === 'All' && (
                                        <div className="w-[10px] h-[10px] rounded-full"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" fill="white" stroke="white" strokeWidth="1" /></svg></div>
                                    )}
                                    {filter}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-[7px]">
                            {/* Announcement Time Filter Dropdown */}
                            <div className="relative" ref={announcementTimeDropdownRef}>
                                <button
                                    id="announcements-time-filter-trigger"
                                    onClick={() => setAnnouncementTimeDropdownOpen(!announcementTimeDropdownOpen)}
                                    className={`flex items-center gap-[8px] bg-white border border-solid px-[12px] py-[8px] rounded-[12px] h-[42px] cursor-pointer transition-all duration-200 hover:shadow-sm ${
                                        announcementTimeFilter !== 'ALL'
                                            ? 'border-[rgba(7,119,52,0.5)]'
                                            : 'border-[rgba(7,119,52,0.1)]'
                                    }`}
                                >
                                    <span className="font-inter font-medium text-[12px] leading-[18px] text-[#666d80] whitespace-nowrap">
                                        Time: {announcementTimeFilter === 'ALL' ? 'ALL' : announcementTimeFilter.toLowerCase()}
                                    </span>
                                    <svg
                                        width="18" height="18" viewBox="0 0 18 18" fill="none"
                                        className={`transition-transform duration-200 ${announcementTimeDropdownOpen ? 'rotate-180' : ''}`}
                                    >
                                        <path d="M14.94 6.71252L10.05 11.6025C9.4725 12.18 8.5275 12.18 7.95 11.6025L3.06 6.71252" stroke="#666d80" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                {/* Dropdown Menu */}
                                {announcementTimeDropdownOpen && (
                                    <div
                                        id="announcements-time-filter-dropdown"
                                        className="absolute top-[calc(100%+4px)] left-0 z-50 bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden shadow-md min-w-[160px] animate-in fade-in duration-150"
                                    >
                                        {ANNOUNCEMENT_TIME_OPTIONS.map((option, index) => (
                                            <button
                                                key={option}
                                                id={`announcements-time-option-${option.toLowerCase()}`}
                                                onClick={() => {
                                                    setAnnouncementTimeFilter(option);
                                                    setAnnouncementTimeDropdownOpen(false);
                                                    setAnnouncementsPage(1);
                                                }}
                                                className={`w-full text-left px-[12px] py-[8px] font-inter font-normal text-[12px] transition-colors duration-150 ${
                                                    announcementTimeFilter === option
                                                        ? 'bg-[#077734] text-white'
                                                        : 'text-[#666d80] hover:bg-[rgba(7,119,52,0.05)]'
                                                } ${
                                                    index === ANNOUNCEMENT_TIME_OPTIONS.length - 1 ? 'rounded-b-[12px]' : ''
                                                } ${
                                                    index === 0 ? 'rounded-t-[12px]' : ''
                                                }`}
                                            >
                                                Time: {option}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="relative w-[342px] h-[40px]">
                                <input
                                    type="text"
                                    placeholder="Search announcements"
                                    value={announcementSearchQuery}
                                    onChange={(e) => { setAnnouncementSearchQuery(e.target.value); setAnnouncementsPage(1); }}
                                    className="w-full h-full pl-[38px] pr-[14px] border border-[var(--border-01)] rounded-[11px] font-urbanist text-[12px] text-[#666d80] placeholder-[#666d80] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-all"
                                />
                                <div className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[var(--grey-100)]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="w-full overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#fafbfb] border-b border-t border-[var(--border-01)] h-[48px]">
                                <tr>
                                    <th className="w-[52px] px-[16px] py-[14px]">
                                        <input type="checkbox" className="w-[20px] h-[20px] rounded-[4px] border-[#e2e8f0] text-[var(--brand)] focus:ring-0 checked:bg-[var(--brand)] cursor-pointer transition-colors" />
                                    </th>
                                    <th className="px-[16px] py-[14px] font-urbanist font-medium text-[12px] text-[#666d80] uppercase">Title</th>
                                    <th className="px-[16px] py-[14px] font-urbanist font-medium text-[12px] text-[#666d80] uppercase">Message</th>
                                    <th className="px-[16px] py-[14px] font-urbanist font-medium text-[12px] text-[#666d80] uppercase">Date Sent</th>
                                    <th className="px-[16px] py-[14px] font-urbanist font-medium text-[12px] text-[#666d80] uppercase">Status</th>
                                    <th className="px-[16px] py-[14px] font-urbanist font-medium text-[12px] text-[#666d80] uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-none bg-white">
                                {announcements.map((announcement) => (
                                        <tr key={announcement.id} className="group hover:bg-[#fafbfb] transition-colors duration-150">
                                            <td className="w-[52px] h-[70px] px-[16px] py-[22px]">
                                                <input type="checkbox" className="w-[20px] h-[20px] rounded-[4px] border-[#e2e8f0] text-[var(--brand)] focus:ring-0 checked:bg-[var(--brand)] cursor-pointer transition-colors" />
                                            </td>
                                            <td className="h-[70px] px-[16px] py-[22px] font-urbanist font-medium text-[14px] text-[#666d80]">
                                                {announcement.title}
                                            </td>
                                            <td className="h-[70px] px-[16px] py-[22px] font-urbanist font-medium text-[14px] text-[#666d80] truncate max-w-[200px]" title={announcement.message || announcement.description}>
                                                {announcement.message || announcement.description}
                                            </td>
                                            <td className="h-[70px] px-[16px] py-[22px] font-urbanist font-medium text-[14px] text-[#666d80] whitespace-nowrap">
                                                {announcement.date}  {announcement.time}
                                            </td>
                                            <td className="h-[70px] px-[16px] py-[22px]">
                                                <span
                                                    className={`inline-flex items-center px-[8px] py-[4px] rounded-[8px] text-[12px] capitalize border
                                                    ${announcement.status === 'scheduled'
                                                            ? 'text-[#ff8156] border-[#ffa487]'
                                                            : 'text-[#47b881] border-[#6bc497]'
                                                        }`}
                                                    style={{ fontFamily: '"Inter Tight", sans-serif' }}
                                                >
                                                    {announcement.status === 'scheduled' ? 'Scheduled' : 'Sent'}
                                                </span>
                                            </td>
                                            <td className="h-[70px] px-[16px] py-[22px]">
                                                <div className="flex items-center gap-[12px]">
                                                    <button 
                                                        onClick={() => handleEditAnnouncement(announcement)}
                                                        className="text-[#666d80] hover:text-[var(--brand)] transition-colors p-1 hover:bg-[var(--brand-05)] rounded"
                                                    >
                                                        <EditIcon size={20} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                                                        className="text-[#666d80] hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded"
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="flex justify-between items-center mt-[8px] h-[40px] border-t border-[var(--border-01)] pt-[8px]">
                        <span className="font-['DM_Sans'] font-normal text-[14px] text-[#666d80]">
                            {announcementsRangeStart}-{announcementsRangeEnd} of {announcementsPagination.totalElements} items
                        </span>
                        <div className="flex items-center gap-[8px]">
                            <div className="flex items-center gap-[8px]">
                                <div className="flex items-center gap-[8px] bg-white rounded-[8px] px-[11px] h-[23px]">
                                    <span className="font-['DM_Sans'] font-normal text-[14px] text-[#666d80]">{announcementsPage}</span>
                                    <ChevronDownIcon size={16} className="text-[#666d80]" />
                                </div>
                                <span className="font-['DM_Sans'] font-normal text-[14px] text-[#666d80]">of {announcementsPagination.totalPages} pages</span>
                            </div>
                            <div className="flex items-center gap-[8px]">
                                <button
                                    onClick={() => setAnnouncementsPage(p => Math.max(1, p - 1))}
                                    disabled={announcementsPage <= 1}
                                    className="flex items-center justify-center p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-30"
                                >
                                    <ChevronLeftIcon size={16} className="text-[#666d80] stroke-[1.5]" />
                                </button>
                                <button
                                    onClick={() => setAnnouncementsPage(p => Math.min(announcementsPagination.totalPages, p + 1))}
                                    disabled={announcementsPage >= announcementsPagination.totalPages}
                                    className="flex items-center justify-center p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-30"
                                >
                                    <ChevronRightIcon size={16} className="text-[#666d80] stroke-[1.5]" />
                                </button>
                            </div>
                        </div>
                    </div>
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
                onDelete={handleDeleteEvent}
            />
            <AddAnnouncementModal
                isOpen={isAddAnnouncementOpen}
                onClose={handleCloseAddAnnouncement}
                announcement={editingAnnouncement}
            />
        </div>
    );
}
