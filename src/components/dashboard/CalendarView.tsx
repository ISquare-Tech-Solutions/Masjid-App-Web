'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ListIcon, CalendarIcon } from '@/components/ui/Icons';
import type { Event } from '@/types';

interface CalendarViewProps {
    events: Event[];
    currentDate: Date;
    onDateChange: (date: Date) => void;
    viewMode: 'list' | 'calendar';
    onViewModeChange: (mode: 'list' | 'calendar') => void;
    onEventClick: (event: Event) => void;
}

export default function CalendarView({
    events,
    currentDate,
    onDateChange,
    viewMode,
    onViewModeChange,
    onEventClick,
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

    const days = [];
    // Previous month filler
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, currentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) });
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
    }
    // Next month filler
    const remainingCells = 42 - days.length; // 6 rows * 7 cols
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

    // Helper to check if event is on 'day'
    const getEventsForDay = (date: Date) => {
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return (
                eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear()
            );
        });
    };

    return (
        <div className="border border-[var(--border-01)] rounded-[24px] p-[24px] bg-white shadow-[0px_4px_21px_0px_rgba(0,0,0,0.05)]">
            {/* Header Controls */}
            <div className="flex justify-between items-center mb-[24px] h-[40px]">
                {/* Date Nav */}
                <div className="flex items-center gap-[24px]">
                    <h2 className="text-[24px] font-inter font-semibold text-[var(--grey-800)]">
                        {monthNames[month]} {year}
                    </h2>
                    <div className="flex items-center gap-[18px]">
                        <button onClick={handlePrevMonth} className="p-[6px] border border-[rgba(7,119,52,0.5)] rounded-[8px] hover:bg-[var(--brand-05)] transition-colors">
                            <ChevronLeftIcon size={24} className="stroke-[1.5]" />
                        </button>
                        <button onClick={handleNextMonth} className="p-[6px] border border-[rgba(7,119,52,0.5)] rounded-[8px] hover:bg-[var(--brand-05)] transition-colors">
                            <ChevronRightIcon size={24} className="stroke-[1.5]" />
                        </button>
                    </div>
                </div>

                {/* View Toggle & Search */}
                <div className="flex items-center gap-[7px]">
                    <div className="flex items-center gap-[16px] mr-[7px]">
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`w-[36px] h-[36px] flex items-center justify-center rounded-[8px] transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-[var(--grey-800)]' : 'text-[var(--grey-400)] hover:bg-gray-50'}`}
                        >
                            <ListIcon size={24} className="stroke-[1.5]" />
                        </button>
                        <button
                            onClick={() => onViewModeChange('calendar')}
                            className={`w-[36px] h-[36px] flex items-center justify-center rounded-[8px] transition-colors ${viewMode === 'calendar' ? 'bg-gray-100 text-[var(--grey-800)]' : 'text-[var(--grey-400)] hover:bg-gray-50'}`}
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

            {/* Calendar Grid */}
            <div className="border border-[var(--border-01)] rounded-[8px] overflow-hidden">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-[var(--border-01)] bg-white h-[40px]">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="flex items-center justify-center font-inter font-medium text-[14px] text-[var(--grey-800)] border-r border-[var(--border-01)] last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 auto-rows-[105px]">
                    {days.map((d, index) => {
                        const dayEvents = d.currentMonth ? getEventsForDay(d.date) : [];
                        return (
                            <div
                                key={index}
                                className={`
                            border-r border-b border-[var(--border-01)] p-[2px] relative flex flex-col items-center
                            ${(index + 1) % 7 === 0 ? 'border-r-0' : ''}
                            ${index >= 35 ? 'border-b-0' : ''}
                        `}
                            >
                                {/* Day Number */}
                                <div className={`
                            mt-1 size-[24px] flex items-center justify-center rounded-full text-[14px] font-semibold font-inter mb-1
                            ${!d.currentMonth ? 'opacity-50 text-[#252525]' : 'text-[var(--grey-800)]'}
                            ${d.currentMonth &&
                                        d.day === new Date().getDate() &&
                                        d.date.getMonth() === new Date().getMonth() &&
                                        d.date.getFullYear() === new Date().getFullYear()
                                        ? 'bg-[var(--grey-800)] text-white'
                                        : ''
                                    }
                        `}>
                                    {d.day}
                                </div>

                                {/* Events */}
                                <div className="w-full px-1 flex flex-col gap-[2px] overflow-y-auto max-h-[70px]">
                                    {dayEvents.map((event, i) => {
                                        // Cycle background colors matching Figma
                                        const bgColors = ['bg-[#d2f0ff]', 'bg-[#ffd9d9]', 'bg-[#fee6c9]', 'bg-[#ebeff0]'];
                                        const color = bgColors[i % bgColors.length];

                                        return (
                                            <div
                                                key={event.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEventClick(event);
                                                }}
                                                className={`${color} h-[22px] px-2 flex items-center rounded-[2px] w-full shrink-0 cursor-pointer hover:opacity-80 transition-opacity`}
                                            >
                                                <p className="text-[11px] truncate leading-none text-[var(--grey-800)] w-full">
                                                    <span className="font-normal mr-1">{event.startTime}</span>
                                                    <span className="font-semibold">{event.title}</span>
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
