'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/Icons';
import type { Event } from '@/types';

interface CalendarViewProps {
    events: Event[];
    currentDate: Date;
    onDateChange: (date: Date) => void;
    viewMode: 'list' | 'calendar';
    onViewModeChange: (mode: 'list' | 'calendar') => void;
    onEventClick: (event: Event) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export default function CalendarView({
    events,
    currentDate,
    onDateChange,
    viewMode,
    onViewModeChange,
    onEventClick,
    searchQuery,
    onSearchChange,
}: CalendarViewProps) {
    const [navDate, setNavDate] = useState(currentDate);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const year = navDate.getFullYear();
    const month = navDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month); // 0 = Sunday

    const days: { day: number; currentMonth: boolean; date: Date }[] = [];
    // Previous month filler
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, currentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) });
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
    }
    // Next month filler — only fill to complete the last row (nearest multiple of 7)
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
        days.push({ day: i, currentMonth: false, date: new Date(year, month + 1, i) });
    }

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handlePrevMonth = () => {
        setNavDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setNavDate(new Date(year, month + 1, 1));
    };

    const parseEventDate = (dateStr: string) => {
        // Parse dates like '17 Oct 2025', '30 Sep 2025'
        const parts = dateStr.split(' ');
        const day = parseInt(parts[0]);
        const monthMap: Record<string, number> = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        const month = monthMap[parts[1]];
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
    };

    const getEventsForDay = (date: Date) => {
        return events.filter(event => {
            const eventDate = parseEventDate(event.date);
            return (
                eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear()
            );
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    // Calculate how many rows we actually need
    const totalRows = Math.ceil(days.length / 7);

    return (
        <div className="border border-[var(--border-01)] rounded-[24px] p-[24px] bg-white">
            {/* Header: Month Navigation + Search + Toggle */}
            <div className="flex justify-between items-center mb-[16px]">
                {/* Left: Month name + nav arrows */}
                <div className="flex items-center gap-[24px] flex-1">
                    <h2 className="font-urbanist font-semibold text-[20px] text-[var(--grey-800)] leading-normal whitespace-nowrap">
                        {monthNames[month]} {year}
                    </h2>
                    <div className="flex items-center gap-[18px]">
                        <button
                            onClick={handlePrevMonth}
                            className="p-[4px] border border-[rgba(7,119,52,0.5)] rounded-[8px] hover:bg-[rgba(7,119,52,0.05)] transition-colors flex items-center justify-center"
                        >
                            <ChevronLeftIcon size={20} className="text-[var(--grey-800)] stroke-[1.5]" />
                        </button>
                        <button
                            onClick={handleNextMonth}
                            className="p-[4px] border border-[rgba(7,119,52,0.5)] rounded-[8px] hover:bg-[rgba(7,119,52,0.05)] transition-colors flex items-center justify-center"
                        >
                            <ChevronRightIcon size={20} className="text-[var(--grey-800)] stroke-[1.5]" />
                        </button>
                    </div>
                </div>

                {/* Right: Search + view toggle (consistent with list view header) */}
                <div className="flex items-center gap-[7px]">
                    <div className="relative w-[342px] h-[40px]">
                        <input
                            type="text"
                            placeholder="Search Events"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full h-full pl-[38px] pr-[14px] border border-[var(--border-01)] rounded-[11px] font-urbanist text-[12px] text-[#666d80] placeholder-[#666d80] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-all"
                        />
                        <div className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[var(--grey-100)]">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                    </div>
                    <div className="bg-[var(--white\/white-900,white)] border border-[var(--white\/border,#e2e8f0)] rounded-[12px] flex items-center gap-[8px] px-[8px] py-[6px]">
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`flex items-center justify-center px-[12px] py-[6px] rounded-[8px] transition-colors ${viewMode === 'list' ? 'bg-[rgba(7,119,52,0.1)]' : 'hover:bg-gray-50'}`}
                        >
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.75 2.25H2.25V6.75H6.75V2.25Z" stroke={viewMode === 'list' ? "#077734" : "#666d80"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M15.75 2.25H11.25V6.75H15.75V2.25Z" stroke={viewMode === 'list' ? "#077734" : "#666d80"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M15.75 11.25H11.25V15.75H15.75V11.25Z" stroke={viewMode === 'list' ? "#077734" : "#666d80"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M6.75 11.25H2.25V15.75H6.75V11.25Z" stroke={viewMode === 'list' ? "#077734" : "#666d80"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button
                            onClick={() => onViewModeChange('calendar')}
                            className={`flex items-center justify-center px-[12px] py-[6px] rounded-[8px] transition-colors ${(viewMode as string) === 'calendar' ? 'bg-[rgba(7,119,52,0.1)]' : 'hover:bg-gray-50'}`}
                        >
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 1.5V3.75" stroke={(viewMode as string) === 'calendar' ? "#077734" : "#666d80"} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 1.5V3.75" stroke={(viewMode as string) === 'calendar' ? "#077734" : "#666d80"} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2.625 6.81738H15.375" stroke={(viewMode as string) === 'calendar' ? "#077734" : "#666d80"} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M15.75 6.375V12.75C15.75 15 14.625 16.5 12 16.5H6C3.375 16.5 2.25 15 2.25 12.75V6.375C2.25 4.125 3.375 2.625 6 2.625H12C14.625 2.625 15.75 4.125 15.75 6.375Z" stroke={(viewMode as string) === 'calendar' ? "#077734" : "#666d80"} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M11.7709 10.2748H11.7776" stroke={(viewMode as string) === 'calendar' ? "#077734" : "#666d80"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M11.7709 12.5248H11.7776" stroke={(viewMode as string) === 'calendar' ? "#077734" : "#666d80"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8.99645 10.2748H9.00318" stroke={(viewMode as string) === 'calendar' ? "#077734" : "#666d80"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8.99645 12.5248H9.00318" stroke={(viewMode as string) === 'calendar' ? "#077734" : "#666d80"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M6.22011 10.2748H6.22684" stroke={(viewMode as string) === 'calendar' ? "#077734" : "#666d80"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M6.22011 12.5248H6.22684" stroke={(viewMode as string) === 'calendar' ? "#077734" : "#666d80"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-[8px] overflow-hidden w-full">
                {/* Days of Week Header */}
                <div className="grid grid-cols-7 bg-white pb-[4px]">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="flex items-center justify-center h-[24px] font-urbanist font-medium text-[14px] text-[var(--grey-800)] leading-[1.25]">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Cells */}
                <div className="grid grid-cols-7">
                    {days.map((d, index) => {
                        const dayEvents = getEventsForDay(d.date);
                        const today = d.currentMonth && isToday(d.date);
                        const rowIndex = Math.floor(index / 7);
                        const colIndex = index % 7;
                        const isLastRow = rowIndex === totalRows - 1;

                        return (
                            <div
                                key={index}
                                className={`
                                    bg-white flex flex-col items-center overflow-hidden p-[6px] min-h-[105px]
                                    border-[var(--border-01)]
                                    ${!isLastRow ? 'border-b' : ''}
                                    ${colIndex === 0 ? 'border-l border-r border-t' : 'border-r border-t'}
                                `}
                            >
                                {/* Day Number */}
                                <div className={`
                                    w-[24px] h-[24px] flex items-center justify-center rounded-full
                                    font-urbanist font-semibold text-[14px] leading-[1.25] shrink-0
                                    ${!d.currentMonth ? 'opacity-50 text-[var(--grey-800)]' : ''}
                                    ${today ? 'bg-[var(--brand)] text-white' : d.currentMonth ? 'text-[var(--grey-800)]' : ''}
                                `}>
                                    {d.day}
                                </div>

                                {/* Events */}
                                {dayEvents.length > 0 && (
                                    <div className="w-full flex flex-col gap-[2px] mt-[2px]">
                                        {dayEvents.slice(0, 3).map((event, i) => (
                                            <div
                                                key={event.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEventClick(event);
                                                }}
                                                className={`
                                                    h-[22px] w-full overflow-hidden rounded-[2px] cursor-pointer
                                                    hover:opacity-80 transition-opacity
                                                    ${i % 2 === 0 ? 'bg-[rgba(7,119,52,0.05)]' : 'bg-[rgba(7,119,52,0.1)]'}
                                                `}
                                            >
                                                <p className="font-urbanist font-normal text-[14px] text-[var(--grey-800)] leading-[1.25] whitespace-nowrap pl-[4px] h-full flex items-center">
                                                    {(event.startTime || '').replace(' AM', ' am').replace(' PM', ' pm')} {event.title}
                                                </p>
                                            </div>
                                        ))}
                                        {dayEvents.length > 3 && (
                                            <div className="flex items-end justify-end h-[12px] w-full">
                                                <span className="font-inter font-normal text-[8px] text-[var(--brand)] leading-[1.25]">
                                                    view more
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
