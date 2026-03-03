'use client';

import { ArrowUpRightIcon } from '@/components/ui/Icons';
import type { Campaign } from '@/types';

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[24px] p-[16px] flex flex-col gap-[16px] overflow-hidden hover:shadow-[0_4px_21px_rgba(0,0,0,0.1)] transition-shadow">
      {/* Campaign Title */}
      <div className="flex flex-col gap-[4px]">
        <h3 className="font-inter font-bold text-[20px] text-[var(--grey-800)] leading-normal">
          {campaign.title}
        </h3>
        <span className="font-inter font-medium text-[16px] text-[#666d80] leading-normal">
          {campaign.category}
        </span>
      </div>

      {/* Campaign Progress */}
      <div className="flex flex-col gap-[12px]">
        {/* Progress Bar Section */}
        <div className="flex flex-col gap-[8px]">
          <div className="flex justify-between items-start">
            <span className="font-inter font-bold text-[14px] text-[var(--grey-800)] leading-normal flex-1">
              Progress
            </span>
            <span className="font-inter font-bold text-[14px] text-[var(--grey-800)] leading-normal">
              {Math.round(progress)}%
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-[8px] bg-[#f5f5f5] rounded-[1234px] overflow-hidden">
            <div
              className="h-full bg-[#fe632f] rounded-[1234px] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Campaign Stats */}
        <div className="flex gap-[8px] text-[16px] text-[var(--grey-800)]">
          <div className="flex-1 flex flex-col gap-[8px]">
            <p className="font-inter font-medium leading-normal">Goal</p>
            <p className="font-inter font-semibold leading-normal">{formatCurrency(campaign.goal)}</p>
          </div>
          <div className="flex-1 flex flex-col gap-[8px]">
            <p className="font-inter font-medium leading-normal">Raised</p>
            <p className="font-inter font-semibold leading-normal">{formatCurrency(campaign.raised)}</p>
          </div>
          <div className="flex-1 flex flex-col gap-[8px]">
            <p className="font-inter font-medium leading-normal">End Date</p>
            <p className="font-inter font-semibold leading-normal">{campaign.endDate}</p>
          </div>
        </div>
      </div>

      {/* Campaign Action */}
      <div className="flex justify-between items-center">
        {/* Status Badge */}
        <div className="border border-[#6bc497] rounded-[8px] px-[16px] py-[6px]">
          <span className="font-['Inter_Tight'] text-[16px] text-[#47b881] capitalize leading-normal">
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </span>
        </div>

        {/* Action Button */}
        <button className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-white border border-[#e2e8f0] shrink-0 hover:bg-[var(--neutral-100)] transition-colors">
          <ArrowUpRightIcon size={26} className="text-[var(--grey-800)]" />
        </button>
      </div>
    </div>
  );
}
