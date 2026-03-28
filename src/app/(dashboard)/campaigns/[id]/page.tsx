'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, EditIcon, DownloadIcon } from '@/components/ui/Icons';
import DonationHistoryTable from './components/DonationHistoryTable';
import EndCampaignModal from './components/EndCampaignModal';
import Link from 'next/link';
import { getCampaignById, updateCampaignStatus } from '@/lib/api/campaigns';
import { downloadDonorPdf } from '@/lib/downloadDonorPdf';
import type { Campaign } from '@/types';
import { use } from 'react';

const STATUS_COLORS: Record<string, { border: string; text: string }> = {
  active:    { border: 'border-[#4ba1ff]', text: 'text-[#3b82f6]' },
  paused:    { border: 'border-[#ffc62b]', text: 'text-[#ffad0d]' },
  completed: { border: 'border-[#6bc497]', text: 'text-[#47b881]' },
  draft:     { border: 'border-[#ffc62b]', text: 'text-[#ffad0d]' },
  cancelled: { border: 'border-[#eb6f70]', text: 'text-[#f64c4c]' },
};

export default function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);

  useEffect(() => {
    getCampaignById(id)
      .then(setCampaign)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleEndCampaign = async () => {
    await updateCampaignStatus(id, 'completed');
    setCampaign(prev => prev ? { ...prev, status: 'completed' } : prev);
  };

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const progress = campaign && campaign.goalAmount > 0
    ? Math.min(Math.round(((campaign.raisedAmount ?? 0) / campaign.goalAmount) * 100), 100)
    : 0;

  const statusStyle = campaign ? (STATUS_COLORS[campaign.status] ?? { border: 'border-[#e2e8f0]', text: 'text-[#667085]' }) : null;
  const isEditable = campaign && (campaign.status === 'draft' || campaign.status === 'active' || campaign.status === 'paused');
  const isEndable = campaign && (campaign.status === 'active' || campaign.status === 'paused');
  const isDownloadable = campaign && (campaign.status === 'completed' || campaign.status === 'cancelled');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px] text-[var(--neutral-500)]">Loading...</div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col gap-[16px]">
        <Link href="/campaigns" className="flex items-center gap-[8px] text-[14px] text-[var(--grey-800)]">
          <ChevronLeftIcon size={16} /> Back
        </Link>
        <p className="text-[var(--neutral-500)]">Campaign not found.</p>
      </div>
    );
  }

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
        {/* Top: info + status + progress */}
        <div className="flex gap-[32px]">
          <div className="flex-1 flex flex-col gap-[8px]">
            <div className="flex items-start justify-between">
              <h2 className="text-[20px] font-bold text-[var(--grey-800)] font-urbanist">{campaign.title}</h2>
              <span className={`inline-flex items-center px-[12px] py-[4px] rounded-[8px] border ${statusStyle?.border} ${statusStyle?.text} text-[14px] font-medium shrink-0 ml-[16px] capitalize`}>
                {campaign.status}
              </span>
            </div>
            <p className="text-[14px] text-[#667085]">{campaign.category}</p>
            {campaign.description && (
              <p className="text-[14px] leading-[1.6] text-[var(--grey-800)] mt-[4px]">{campaign.description}</p>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-[280px] shrink-0 flex flex-col gap-[8px] pt-[4px]">
            <div className="flex items-center justify-between text-[14px] font-semibold text-[var(--grey-800)]">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-[8px] bg-[var(--neutral-100)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--auxiliary-700)] rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Stats boxes */}
        <div className="grid grid-cols-4 gap-[24px]">
          {[
            { label: 'Goal', value: `£${campaign.goalAmount.toLocaleString()}` },
            { label: 'Raised', value: `£${(campaign.raisedAmount ?? 0).toLocaleString()}` },
            { label: 'Start Date', value: formatDate(campaign.startDate) },
            { label: 'End Date', value: formatDate(campaign.endDate) },
          ].map((stat) => (
            <div key={stat.label} className="p-[16px] border border-[var(--border-01)] rounded-[12px]">
              <p className="text-[14px] text-[#667085] mb-[8px]">{stat.label}</p>
              <p className="text-[20px] font-bold text-[var(--grey-800)]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-[16px]">
          {isEditable && (
            <Link
              href={`/campaigns/${id}/edit`}
              className="flex items-center gap-[8px] px-[20px] py-[10px] text-[14px] font-medium text-[var(--grey-800)] bg-white border border-[var(--border-01)] rounded-[8px] hover:bg-[var(--neutral-100)] transition-colors"
            >
              <EditIcon size={18} />
              <span>Edit Campaign</span>
            </Link>
          )}
          {isEndable && (
            <button
              onClick={() => setIsEndModalOpen(true)}
              className="px-[20px] py-[10px] text-[14px] font-medium text-white bg-[var(--error)] rounded-[8px] hover:bg-red-600 transition-colors"
            >
              End Campaign
            </button>
          )}
          {isDownloadable && (
            <button
              onClick={() => downloadDonorPdf(campaign)}
              className="flex items-center gap-[8px] h-[44px] px-[24px] bg-[#077734] rounded-[12px] text-[16px] font-semibold text-white hover:bg-[#046c4e] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <DownloadIcon size={20} />
              <span>Download Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Donation History */}
      <DonationHistoryTable campaignId={id} />

      <EndCampaignModal
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        onConfirm={handleEndCampaign}
      />
    </div>
  );
}
