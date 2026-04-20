'use client';

import { useRouter } from 'next/navigation';
import { CalendarIcon, ClockIcon } from '@/components/ui/Icons';
import type { Event } from '@/types';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push('/events')}
      className="bg-white border border-[#e2e8f0] rounded-[16px] p-[16px] flex flex-col gap-[16px] overflow-hidden hover:shadow-[0_4px_21px_rgba(0,0,0,0.1)] transition-shadow cursor-pointer"
    >
      {/* Event Info */}
      <div className="flex flex-col gap-[8px]">
        <h3 className="font-inter font-bold text-[18px] text-[#36394a] leading-normal">
          {event.title}
        </h3>
        <p className="font-inter font-medium text-[14px] text-[#666d80] leading-normal">
          {event.description}
        </p>
      </div>

      {/* Event Details */}
      <div className="flex flex-col gap-[12px]">
        {/* Speaker Info */}
        {event.speaker && (
          <div className="flex items-center gap-[14px]">
            <span className="font-inter font-medium text-[14px] text-[#666d80] leading-normal">Speaker</span>
            <span className="font-inter font-medium text-[14px] text-[#36394a] leading-normal">{event.speaker}</span>
          </div>
        )}

        {/* Date & Time */}
        <div className="flex items-center gap-[24px]">
          <div className="flex items-center gap-[6px]">
            <CalendarIcon size={16} className="text-[var(--brand)]" />
            <span className="font-inter font-semibold text-[14px] text-[#36394a] leading-normal">
              {event.date}
            </span>
          </div>
          <div className="flex items-center gap-[6px]">
            <ClockIcon size={16} className="text-[var(--brand)]" />
            <span className="font-inter font-semibold text-[14px] text-[#36394a] leading-normal">
              {event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
