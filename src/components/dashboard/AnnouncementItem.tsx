'use client';

import { CalendarIcon, ArrowUpRightIcon } from '@/components/ui/Icons';
import type { Announcement } from '@/types';

interface AnnouncementItemProps {
    announcement: Announcement;
}

export default function AnnouncementItem({ announcement }: AnnouncementItemProps) {
    return (
        <div className="bg-white border border-[var(--border-01)] rounded-[12px] p-4 hover:shadow-[0_4px_21px_rgba(0,0,0,0.1)] transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-inter font-semibold text-[16px] text-[var(--grey-800)] line-clamp-1">
                    {announcement.title}
                </h3>
                <button className="p-1 hover:bg-[var(--neutral-100)] rounded-full transition-colors shrink-0">
                    <ArrowUpRightIcon size={16} className="text-[var(--grey-800)]" />
                </button>
            </div>

            <p className="font-inter text-[14px] text-[var(--grey-100)] mb-3 line-clamp-2">
                {announcement.description}
            </p>

            <div className="flex items-center gap-2 text-[var(--brand)]">
                <CalendarIcon size={14} />
                <span className="font-inter text-[12px] font-medium">{announcement.date}</span>
            </div>
        </div>
    );
}
