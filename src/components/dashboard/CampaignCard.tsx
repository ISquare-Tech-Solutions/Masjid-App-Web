'use client';

import { useRouter } from 'next/navigation';
import type { Campaign } from '@/types';

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const router = useRouter();
  const progress = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      onClick={() => router.push(`/campaigns/${campaign.id}`)}
      className="bg-white border border-[#e2e8f0] rounded-[16px] p-[16px] flex flex-col gap-[16px] overflow-hidden hover:shadow-[0_4px_21px_rgba(0,0,0,0.1)] transition-shadow cursor-pointer"
    >
      {/* Campaign Title */}
      <div className="flex items-start justify-between gap-[8px]">
        <div className="flex flex-col gap-[4px]">
          <h3 className="font-inter font-bold text-[18px] text-[#36394a] leading-normal">
            {campaign.title}
          </h3>
          <span className="font-inter font-medium text-[14px] text-[#666d80] leading-normal">
            {campaign.category}
          </span>
        </div>
        {/* Status Badge */}
        <div className="inline-flex items-center justify-center border border-[#6bc497] rounded-[8px] px-[8px] py-[4px] shrink-0">
          <span className="font-inter font-normal text-[12px] text-[#47b881] capitalize">
            {campaign.status}
          </span>
        </div>
      </div>

      {/* Campaign Progress */}
      <div className="flex flex-col gap-[12px]">
        {/* Progress Bar Section */}
        <div className="flex flex-col gap-[8px]">
          <div className="flex justify-between items-start">
            <span className="font-inter font-bold text-[14px] text-[#36394a] leading-normal flex-1">
              Progress
            </span>
            <span className="font-inter font-bold text-[14px] text-[#36394a] leading-normal">
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
        <div className="flex gap-[8px] text-[#36394a]">
          <div className="flex-1 flex flex-col gap-[6px]">
            <p className="font-inter font-medium text-[12px] leading-normal">Goal</p>
            <p className="font-inter font-semibold text-[14px] leading-normal">{formatCurrency(campaign.goalAmount)}</p>
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <p className="font-inter font-medium text-[12px] leading-normal">Raised</p>
            <p className="font-inter font-semibold text-[14px] leading-normal">{formatCurrency(campaign.raisedAmount)}</p>
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <p className="font-inter font-medium text-[12px] leading-normal">End Date</p>
            <p className="font-inter font-semibold text-[14px] leading-normal">{campaign.endDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
