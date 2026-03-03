'use client';

import type { JumuahTimeEntry } from '@/types/prayer-times';

interface JummahCardProps {
    jumuahTimes: JumuahTimeEntry[];
    athanTime?: string; // e.g. "13:00" (24h format from zuhr athan)
}

// Helper to split "1:30 PM" into { time: "1:30", ampm: "PM" }
function formatTimeParts(timeStr: string) {
    const match = timeStr.match(/(\d+:\d+)\s*(AM|PM)?/i);
    if (match) {
        return { time: match[1], ampm: match[2]?.toUpperCase() || '' };
    }
    return { time: timeStr, ampm: '' };
}

// Convert 24h "13:00" → "1:00 PM"
function formatTime12h(time24: string | undefined): string {
    if (!time24) return '—';
    const [hoursStr, minutesStr] = time24.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = minutesStr;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${ampm}`;
}

export default function JummahCard({ jumuahTimes, athanTime }: JummahCardProps) {
    const athanParts = athanTime ? formatTimeParts(formatTime12h(athanTime)) : null;

    return (
        <div className="bg-[var(--brand)] text-white flex flex-col items-center justify-center gap-[12px] p-[24px] rounded-[12px] shrink-0">
            {/* Title */}
            <p className="font-inter font-medium text-[16px] uppercase leading-normal text-center">
                Jummah
            </p>

            {/* Jummah Times */}
            <div className="flex flex-col gap-[4px] items-start w-[145px]">
                {jumuahTimes.map((jt, idx) => {
                    const jamahTime = formatTime12h(jt.jamah);
                    const parts = formatTimeParts(jamahTime);

                    return (
                        <div key={idx}>
                            {/* Time Row */}
                            <div className="flex items-end justify-between w-[145px] text-white leading-normal">
                                <p className="font-inter font-medium text-[12px] uppercase text-right">
                                    JUMMAH {idx + 1}
                                </p>
                                <div className="flex items-end gap-[2px] font-inter font-bold text-center">
                                    <p className="text-[22px]">{parts.time}</p>
                                    <p className="text-[14px] uppercase">{parts.ampm}</p>
                                </div>
                            </div>

                            {/* Divider between Jummah slots (not after last) */}
                            {idx < jumuahTimes.length - 1 && (
                                <div className="w-full flex justify-center my-[4px]">
                                    <div className="w-full h-[1px] bg-white/30" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Adhan Time */}
            {athanTime && athanParts && (
                <p className="font-inter font-medium text-[14px] leading-normal text-center uppercase text-white">
                    Adhan {athanParts.time}
                    {athanParts.ampm && (
                        <span className="text-[9px] leading-none align-super text-white">
                            {athanParts.ampm}
                        </span>
                    )}
                </p>
            )}
        </div>
    );
}
