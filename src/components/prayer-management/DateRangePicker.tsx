'use client';

import { useState, useCallback } from 'react';

/* ── Types ── */
interface DateRangePickerProps {
    fromDate: string;        // YYYY-MM-DD
    toDate: string;          // YYYY-MM-DD
    onApply: (from: string, to: string) => void;
    onCancel: () => void;
}

/* ── Helpers ── */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_HEADERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function daysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

/** Get day of week as 0=Monday, 6=Sunday */
function startDayOfWeek(year: number, month: number) {
    const d = new Date(year, month, 1).getDay(); // 0=Sun
    return d === 0 ? 6 : d - 1; // convert to Mon=0
}

function toDateStr(y: number, m: number, d: number) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function parseDate(s: string) {
    const [y, m, d] = s.split('-').map(Number);
    return { year: y, month: m - 1, day: d };
}

function isSame(a: string, b: string) { return a === b; }

function isBetween(date: string, from: string, to: string) {
    return date > from && date < to;
}

/* ═══════════════════════════════════════════════
   DateRangePicker Component
   ═══════════════════════════════════════════════ */
export default function DateRangePicker({ fromDate, toDate, onApply, onCancel }: DateRangePickerProps) {
    const [activeTab, setActiveTab] = useState<'from' | 'to'>('from');
    const initFrom = fromDate ? parseDate(fromDate) : { year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDate() };
    const initTo = toDate ? parseDate(toDate) : initFrom;

    const [from, setFrom] = useState(fromDate || toDateStr(initFrom.year, initFrom.month, initFrom.day));
    const [to, setTo] = useState(toDate || from);

    const [viewYear, setViewYear] = useState(initFrom.year);
    const [viewMonth, setViewMonth] = useState(initFrom.month);

    const numDays = daysInMonth(viewYear, viewMonth);
    const startDay = startDayOfWeek(viewYear, viewMonth);

    /* Year range for dropdown */
    const years = Array.from({ length: 11 }, (_, i) => viewYear - 5 + i);

    const handleDayClick = useCallback((day: number) => {
        const dateStr = toDateStr(viewYear, viewMonth, day);
        if (activeTab === 'from') {
            setFrom(dateStr);
            if (dateStr > to) setTo(dateStr);
            setActiveTab('to');
        } else {
            if (dateStr < from) {
                setFrom(dateStr);
            } else {
                setTo(dateStr);
            }
        }
    }, [activeTab, from, to, viewYear, viewMonth]);

    const handleApply = () => onApply(from, to);

    /* Build calendar grid cells */
    const cells: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= numDays; d++) cells.push(d);
    // Pad to fill last row
    while (cells.length % 7 !== 0) cells.push(null);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

            <div className="relative bg-white rounded-[20px] w-full max-w-[430px] shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-3">
                    <h3 className="font-inter font-bold text-[20px] text-[var(--grey-800)]">
                        Date Range
                    </h3>
                    <button onClick={onCancel} className="p-1 hover:bg-[var(--neutral-100)] rounded-full transition-colors cursor-pointer">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15 5L5 15M5 5l10 10" stroke="var(--grey-800)" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="px-6 pb-6">
                    {/* From / To Segmented Toggle */}
                    <div className="flex bg-[var(--brand-05)] rounded-full p-0.5 mb-5">
                        <button
                            onClick={() => setActiveTab('from')}
                            className={`flex-1 py-2 rounded-full font-inter font-semibold text-[14px] transition-all cursor-pointer
                                ${activeTab === 'from' ? 'bg-[var(--brand)] text-white shadow-sm' : 'text-[var(--grey-800)]'}`}
                        >
                            From
                        </button>
                        <button
                            onClick={() => setActiveTab('to')}
                            className={`flex-1 py-2 rounded-full font-inter font-semibold text-[14px] transition-all cursor-pointer
                                ${activeTab === 'to' ? 'bg-[var(--brand)] text-white shadow-sm' : 'text-[var(--grey-800)]'}`}
                        >
                            To
                        </button>
                    </div>

                    {/* Year / Month Dropdowns */}
                    <div className="flex items-center gap-3 mb-4">
                        <select
                            value={viewYear}
                            onChange={(e) => setViewYear(Number(e.target.value))}
                            className="font-inter font-medium text-[14px] text-[var(--grey-800)] bg-transparent border-none outline-none cursor-pointer appearance-auto"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <select
                            value={viewMonth}
                            onChange={(e) => setViewMonth(Number(e.target.value))}
                            className="font-inter font-medium text-[14px] text-[var(--grey-800)] bg-transparent border-none outline-none cursor-pointer appearance-auto"
                        >
                            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                        </select>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 mb-2">
                        {DAY_HEADERS.map((d, i) => (
                            <div key={i} className="text-center font-inter font-medium text-[13px] text-[var(--neutral-500)] py-1">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7">
                        {cells.map((day, i) => {
                            if (day === null) return <div key={i} />;

                            const dateStr = toDateStr(viewYear, viewMonth, day);
                            const isFrom = isSame(dateStr, from);
                            const isTo = isSame(dateStr, to);
                            const isInRange = from && to && isBetween(dateStr, from, to);
                            const isSelected = isFrom || isTo;

                            return (
                                <div
                                    key={i}
                                    className={`relative flex items-center justify-center h-[42px]
                                        ${isInRange ? 'bg-[var(--brand-05)]' : ''}
                                        ${isFrom && from !== to ? 'rounded-l-full bg-[var(--brand-05)]' : ''}
                                        ${isTo && from !== to ? 'rounded-r-full bg-[var(--brand-05)]' : ''}
                                    `}
                                >
                                    <button
                                        onClick={() => handleDayClick(day)}
                                        className={`w-[36px] h-[36px] rounded-full flex items-center justify-center
                                            font-inter font-medium text-[14px] transition-all cursor-pointer
                                            ${isSelected
                                                ? 'bg-[var(--brand)] text-white'
                                                : isInRange
                                                    ? 'text-[var(--brand)] hover:bg-[var(--brand-10)]'
                                                    : 'text-[var(--grey-800)] hover:bg-[var(--neutral-100)]'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 px-6 py-4 border-t border-[var(--border-01)]">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 border border-[var(--border-01)] text-[var(--grey-800)] rounded-full
                            font-inter font-semibold text-[14px] hover:bg-[var(--neutral-100)] transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 py-3 bg-[var(--brand)] text-white rounded-full
                            font-inter font-semibold text-[14px] hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}
