'use client';

import { ArrowUpRightIcon } from '@/components/ui/Icons';

interface QuickActionButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
}

export default function QuickActionButton({ label, onClick }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        flex flex-1 items-center justify-between
        p-[16px] rounded-[16px]
        border border-[#e2e8f0]
        bg-white hover:bg-[var(--neutral-100)]
        transition-colors cursor-pointer
      "
    >
      <span className="font-inter font-medium text-[18px] text-[var(--grey-800)] leading-normal whitespace-nowrap">
        {label}
      </span>
      <ArrowUpRightIcon size={24} className="text-[var(--grey-800)]" />
    </button>
  );
}
