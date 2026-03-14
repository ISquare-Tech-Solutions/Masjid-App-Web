'use client';

import { useState } from 'react';
import { ChevronLeftIcon, EditIcon } from '@/components/ui/Icons';
import DonationHistoryTable from './components/DonationHistoryTable';
import EndCampaignModal from './components/EndCampaignModal';
import Link from 'next/link';

export default function CampaignDetailsPage({ params }: { params: { id: string } }) {
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);

  const campaign = {
    title: 'Help Build New Wudu Area',
    cause: 'Masjid Development',
    description: 'Support the construction of a new Wudu area to make the masjid more accessible and comfortable for all community members.',
    goal: '£15,000',
    raised: '£10,500',
    startDate: '21 Nov 2025',
    endDate: '05 Dec 2025',
    progress: 70,
    status: 'Active',
  };

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-semibold text-[#1F1F1F] font-urbanist">Campaign Details</h1>
        <Link
          href="/campaigns"
          className="flex items-center gap-[8px] bg-white border border-[var(--border-01)] text-[var(--grey-800)] px-[16px] py-[8px] rounded-[8px] hover:bg-[#fafafa] transition-colors shadow-sm font-medium text-[14px]"
        >
          <ChevronLeftIcon size={16} />
          <span>Back</span>
        </Link>
      </div>

      {/* Campaign Info Card */}
      <div className="rounded-[16px] border border-[var(--border-01)] p-[24px] flex flex-col gap-[24px]">
        {/* Top section: info + status + progress */}
        <div className="flex gap-[32px]">
          {/* Left: Title, cause, description */}
          <div className="flex-1 flex flex-col gap-[8px]">
            <div className="flex items-start justify-between">
              <h2 className="text-[20px] font-bold text-[var(--grey-800)] font-urbanist">{campaign.title}</h2>
              <span className="inline-flex items-center px-[12px] py-[4px] rounded-[8px] border border-[#6bc497] text-[#47b881] text-[14px] font-medium shrink-0 ml-[16px]">
                {campaign.status}
              </span>
            </div>
            <p className="text-[14px] text-[#667085]">{campaign.cause}</p>
            <p className="text-[14px] leading-[1.6] text-[var(--grey-800)] mt-[4px]">{campaign.description}</p>
          </div>

          {/* Right: Progress */}
          <div className="w-[280px] shrink-0 flex flex-col gap-[8px] pt-[4px]">
            <div className="flex items-center justify-between text-[14px] font-semibold text-[var(--grey-800)]">
              <span>Progress</span>
              <span>{campaign.progress}%</span>
            </div>
            <div className="w-full h-[8px] bg-[var(--neutral-100)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--auxiliary-700)] rounded-full" style={{ width: `${campaign.progress}%` }} />
            </div>
          </div>
        </div>

        {/* Stats boxes */}
        <div className="grid grid-cols-4 gap-[24px]">
          {[
            { label: 'Goal', value: campaign.goal },
            { label: 'Raised', value: campaign.raised },
            { label: 'Start Date', value: campaign.startDate },
            { label: 'End Date', value: campaign.endDate },
          ].map((stat) => (
            <div key={stat.label} className="p-[16px] border border-[var(--border-01)] rounded-[12px]">
              <p className="text-[14px] text-[#667085] mb-[8px]">{stat.label}</p>
              <p className="text-[20px] font-bold text-[var(--grey-800)]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-[16px]">
          <button className="flex items-center gap-[8px] px-[20px] py-[10px] text-[14px] font-medium text-[var(--grey-800)] bg-white border border-[var(--border-01)] rounded-[8px] hover:bg-[var(--neutral-100)] transition-colors">
            <EditIcon size={18} />
            <span>Edit Campaign</span>
          </button>
          <button
            onClick={() => setIsEndModalOpen(true)}
            className="px-[20px] py-[10px] text-[14px] font-medium text-white bg-[var(--error)] rounded-[8px] hover:bg-red-600 transition-colors"
          >
            End Campaign
          </button>
        </div>
      </div>

      {/* Donation History */}
      <DonationHistoryTable />

      <EndCampaignModal
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        onConfirm={() => console.log('Campaign ended')}
      />
    </div>
  );
}
