'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/Icons';

interface DateHeaderProps {
  gregorianDate: string;
  islamicDate: string;
  isToday: boolean;
  onPrevDay?: () => void;
  onNextDay?: () => void;
  onJumpToToday?: () => void;
}

export default function DateHeader({
  gregorianDate,
  islamicDate,
  isToday,
  onPrevDay,
  onNextDay,
  onJumpToToday,
}: DateHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full px-[16px] py-[8px]">
      {/* Previous Day Button */}
      <button
        onClick={onPrevDay}
        className="p-[6px] border border-[rgba(7,119,52,0.5)] rounded-[8px] hover:bg-[var(--brand-10)] transition-colors flex items-center justify-center"
        aria-label="Previous Day"
      >
        <ChevronLeftIcon size={24} className="text-[var(--grey-800)] stroke-[1.5]" />
      </button>

      {/* Date Display */}
      <div className="flex flex-col items-center justify-center gap-[2px]">
        <div className="flex items-start justify-center gap-[4px]">
          <h2 className="font-inter font-semibold text-[20px] text-[var(--grey-800)] leading-normal">
            {gregorianDate}
          </h2>
          <button
            onClick={() => !isToday && onJumpToToday?.()}
            className={`
              font-inter font-semibold text-[12px] text-[var(--brand)] text-center leading-normal
              ${!isToday ? 'cursor-pointer hover:underline' : 'cursor-default'}
            `}
          >
            {isToday ? 'TODAY' : 'GO TO TODAY'}
          </button>
        </div>
        <p className="font-inter font-semibold text-[16px] text-[var(--brand)] text-center leading-normal">
          {islamicDate}
        </p>
      </div>

      {/* Next Day Button */}
      <button
        onClick={onNextDay}
        className="p-[6px] border border-[rgba(7,119,52,0.5)] rounded-[8px] hover:bg-[var(--brand-10)] transition-colors flex items-center justify-center"
        aria-label="Next Day"
      >
        <ChevronRightIcon size={24} className="text-[var(--grey-800)] stroke-[1.5]" />
      </button>
    </div>
  );
}
