'use client';

import type { PrayerTime } from '@/types';

interface PrayerTimeCardProps {
  prayer: PrayerTime;
}

export default function PrayerTimeCard({ prayer }: PrayerTimeCardProps) {
  // Helper to split time and AM/PM
  const formatTimeParts = (timeStr: string) => {
    const match = timeStr.match(/(\d+:\d+)\s*(AM|PM)?/i);
    if (match) {
      return { time: match[1], ampm: match[2]?.toUpperCase() || '' };
    }
    return { time: timeStr, ampm: '' };
  };

  const mainParts = formatTimeParts(prayer.time);
  const athanParts = formatTimeParts(prayer.athanTime || '');

  return (
    <div
      className={`
        flex flex-1 flex-col items-center justify-center gap-[6px]
        p-[24px] rounded-[12px] min-w-[160px]
        transition-all duration-200
        ${prayer.isActive
          ? 'bg-[var(--brand)] text-white'
          : 'bg-white'
        }
      `}
    >
      {/* Prayer Name */}
      <p
        className={`
          font-inter font-medium text-[16px] uppercase leading-normal text-right
          ${prayer.isActive ? 'text-white' : 'text-[var(--brand)]'}
        `}
      >
        {prayer.name}
      </p>

      {/* Main Time */}
      <div className="flex items-end gap-[2px] justify-center leading-normal">
        <p
          className={`
            font-inter font-bold text-[26px] leading-normal text-center
            ${prayer.isActive ? 'text-white' : 'text-[var(--grey-800)]'}
          `}
        >
          {mainParts.time}
        </p>
        {mainParts.ampm && (
          <p
            className={`
              font-inter font-bold text-[18px] uppercase leading-normal text-center
              ${prayer.isActive ? 'text-white' : 'text-[#666d80]'}
            `}
          >
            {mainParts.ampm}
          </p>
        )}
      </div>

      {/* Athan Time — Figma: "Adhan 5:50" at 14px + "Am" at ~9px superscript */}
      {prayer.athanTime && (
        <p
          className={`
            font-inter font-medium text-[14px] leading-normal text-center uppercase
            ${prayer.isActive ? 'text-white' : 'text-[#666d80]'}
          `}
        >
          Adhan {athanParts?.time || prayer.athanTime}
          {athanParts?.ampm && (
            <span
              className={`text-[9px] leading-none align-super ${prayer.isActive ? 'text-white' : 'text-[#666d80]'
                }`}
            >
              {athanParts.ampm}
            </span>
          )}
        </p>
      )}
    </div>
  );
}
