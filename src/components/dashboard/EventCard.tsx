'use client';

import { CalendarIcon, ClockIcon, ArrowUpRightIcon } from '@/components/ui/Icons';
import type { Event } from '@/types';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[24px] p-[24px] flex flex-col gap-[24px] overflow-hidden hover:shadow-[0_4px_21px_rgba(0,0,0,0.1)] transition-shadow">
      {/* Event Info */}
      <div className="flex flex-col gap-[8px]">
        <h3 className="font-inter font-bold text-[20px] text-[var(--grey-800)] leading-normal">
          {event.title}
        </h3>
        <span className="font-inter font-medium text-[16px] text-[#666d80] leading-normal">
          {event.category}
        </span>
        <p className="font-inter font-medium text-[16px] text-[#666d80] leading-normal">
          {event.description}
        </p>
      </div>

      {/* Event Details */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col justify-between gap-[12px]">
          {/* Speaker Info */}
          {event.speaker && (
            <div className="flex items-center gap-[14px]">
              <span className="font-inter font-medium text-[16px] text-[#666d80] leading-normal">Speaker</span>
              <span className="font-inter font-medium text-[16px] text-[var(--grey-800)] leading-normal">{event.speaker}</span>
            </div>
          )}

          {/* Date & Time */}
          <div className="flex items-center gap-[24px]">
            <div className="flex items-center gap-[8px]">
              <CalendarIcon size={24} className="text-[var(--brand)]" />
              <span className="font-inter font-semibold text-[16px] text-[var(--grey-800)] leading-normal">
                {event.date}
              </span>
            </div>
            <div className="flex items-center gap-[8px]">
              <ClockIcon size={24} className="text-[var(--brand)]" />
              <span className="font-inter font-semibold text-[16px] text-[var(--grey-800)] leading-normal">
                {event.startTime} - {event.endTime}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-white border border-[#e2e8f0] shrink-0 hover:bg-[var(--neutral-100)] transition-colors">
          <ArrowUpRightIcon size={26} className="text-[var(--grey-800)]" />
        </button>
      </div>
    </div>
  );
}
