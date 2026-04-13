'use client';

import { useState, useEffect } from 'react';
import { EyeIcon, EditIcon, TrashIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, SendIcon, DownloadIcon } from '@/components/ui/Icons';
import Link from 'next/link';
import type { Campaign } from '@/types';
import { getCampaigns, updateCampaignStatus, deleteCampaign } from '@/lib/api/campaigns';
import { downloadDonorPdf } from '@/lib/downloadDonorPdf';
import DeleteCampaignModal from './DeleteCampaignModal';
import PublishCampaignModal from './PublishCampaignModal';

type TabStatus = 'All' | 'active' | 'draft' | 'completed' | 'cancelled';

const TAB_LABELS: Record<TabStatus, string> = {
  All: 'All',
  draft: 'Draft',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Ended',
};

const STATUS_STYLES: Record<string, { border: string; text: string }> = {
  active:    { border: 'border-[#4ba1ff]', text: 'text-[#3b82f6]' },
  paused:    { border: 'border-[#ffc62b]', text: 'text-[#ffad0d]' },
  completed: { border: 'border-[#6bc497]', text: 'text-[#47b881]' },
  draft:     { border: 'border-[#ffc62b]', text: 'text-[#ffad0d]' },
  cancelled: { border: 'border-[#eb6f70]', text: 'text-[#f64c4c]' },
};

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  draft: 'Draft',
  cancelled: 'Ended',
};

const StatusPill = ({ status }: { status: Campaign['status'] }) => {
  const { border, text } = STATUS_STYLES[status] ?? { border: 'border-[#e2e8f0]', text: 'text-[#667085]' };
  return (
    <span className={`inline-flex items-center justify-center px-[8px] py-[4px] rounded-[8px] border ${border} ${text} text-[12px] font-normal capitalize`}
      style={{ fontFamily: "'Inter', sans-serif" }}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
};

const GoalProgress = ({ raised, goal }: { raised: number; goal: number }) => {
  const pct = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
  const fmt = (n: number) => `£${n.toLocaleString()}`;
  return (
    <div className="flex flex-col gap-[4px] w-full">
      <div className="flex items-center justify-between text-[12px] font-medium whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>
        <span className="text-[var(--brand)]">{fmt(raised)}</span>
        <span className="text-[#666d80]">Goal: {fmt(goal)}</span>
      </div>
      <div className="w-full h-[8px] bg-[#f6f6f6] rounded-[1234px] overflow-hidden">
        <div className="h-full bg-[var(--brand)] rounded-[1234px]" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-[#666d80] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
        {pct.toFixed(1)}% funded
      </span>
    </div>
  );
};

const Duration = ({ startDate, endDate }: { startDate?: string; endDate?: string }) => {
  const fmt = (d?: string) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  return (
    <div className="flex flex-col gap-[2px]">
      <span className="text-[14px] text-[#36394a] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>{fmt(startDate)}</span>
      {endDate && (
        <span className="text-[10px] text-[#666d80] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>to {fmt(endDate)}</span>
      )}
    </div>
  );
};

const RowActions = ({
  campaign,
  onStatusChange,
  onDeleteClick,
  onPublishClick,
}: {
  campaign: Campaign;
  onStatusChange: () => void;
  onDeleteClick: (campaign: Campaign) => void;
  onPublishClick: (campaign: Campaign) => void;
}) => {
  switch (campaign.status) {
    case 'active':
    case 'paused':
      return (
        <div className="flex items-center gap-[10px]">
          <Link href={`/campaigns/${campaign.id}`} className="text-[#667085] hover:text-[var(--brand)] transition-colors"><EyeIcon size={20} /></Link>
          <Link href={`/campaigns/${campaign.id}/edit`} className="text-[#667085] hover:text-[var(--brand)] transition-colors"><EditIcon size={20} /></Link>
          <span className="relative flex items-center justify-center w-[20px] h-[20px]" title="Live">
            <span className="animate-ping absolute inline-flex h-[10px] w-[10px] rounded-full bg-[#eb6f70] opacity-75" />
            <span className="relative inline-flex h-[8px] w-[8px] rounded-full bg-[#f64c4c]" />
          </span>
        </div>
      );
    case 'completed':
    case 'cancelled':
      return (
        <div className="flex items-center gap-[10px]">
          <Link href={`/campaigns/${campaign.id}`} className="text-[#667085] hover:text-[var(--brand)] transition-colors"><EyeIcon size={20} /></Link>
          <button onClick={() => downloadDonorPdf(campaign)} title="Download Donor Report" className="text-[#667085] hover:text-[var(--brand)] transition-colors"><DownloadIcon size={20} /></button>
        </div>
      );
    case 'draft':
      return (
        <div className="flex items-center gap-[10px]">
          <button onClick={() => onPublishClick(campaign)} title="Publish" className="text-[var(--brand)] hover:opacity-80 transition-opacity"><SendIcon size={18} /></button>
          <Link href={`/campaigns/${campaign.id}/edit`} className="text-[#667085] hover:text-[var(--brand)] transition-colors"><EditIcon size={20} /></Link>
          <button onClick={() => onDeleteClick(campaign)} className="text-[#eb6f70] hover:opacity-80 transition-opacity"><TrashIcon size={20} /></button>
        </div>
      );
    default:
      return null;
  }
};

export default function CampaignTable() {
  const [activeTab, setActiveTab] = useState<TabStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);
  const [publishTarget, setPublishTarget] = useState<Campaign | null>(null);
  const pageSize = 5;

  const tabs: TabStatus[] = ['All', 'draft', 'active', 'completed', 'cancelled'];

  const fetchCampaigns = async (page = 0) => {
    setLoading(true);
    setFetchError(null);
    try {
      const result = await getCampaigns({ page, size: pageSize });
      setCampaigns(result.content);
      setTotalItems(result.pagination.totalElements);
      setTotalPages(result.pagination.totalPages);
      setCurrentPage(page);
    } catch (err: any) {
      const msg = err?.message || 'Failed to load campaigns.';
      setFetchError(msg);
      console.warn('Failed to fetch campaigns:', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns(0);
  }, []);

  const filteredCampaigns = campaigns.filter(c => {
    const matchesTab = activeTab === 'All' || c.status === activeTab;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.category ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col">
      {/* Filter Tabs + Search */}
      <div className="flex items-center justify-between shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
        <div className="flex items-center">
          {tabs.map((tab, i) => {
            const isFirst = i === 0;
            const isLast = i === tabs.length - 1;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center justify-center gap-[8px] px-[16px] py-[10px] text-[14px] transition-colors
                  ${isFirst ? 'rounded-tl-[8px] rounded-bl-[8px]' : ''}
                  ${isLast ? 'rounded-tr-[8px] rounded-br-[8px]' : ''}
                  ${isFirst ? 'border border-[var(--border-01)]' : 'border-t border-b border-r border-[var(--border-01)]'}
                  ${isActive
                    ? 'bg-[var(--brand)] text-white font-bold font-inter'
                    : 'bg-white font-normal text-[#36394a] font-inter hover:bg-[#fafbfb]'}
                `}
              >
                {TAB_LABELS[tab]}
              </button>
            );
          })}
        </div>
        <div className="relative w-[258px]">
          <SearchIcon size={20} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#666D80]" />
          <input
            type="text"
            placeholder="Search Campaign"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-[42px] pr-[14px] py-[10px] bg-white border border-[var(--border-01)] rounded-[11px] text-[12px] text-[var(--grey-800)] placeholder:text-[#666D80] font-inter focus:outline-none focus:border-[var(--brand)] transition-colors"
          />
        </div>
      </div>

      <div className="h-[2px] bg-[#f6f6f6] rounded-[2px] w-full mt-[16px]" />

      {/* Table or Empty State */}
      {!loading && !fetchError && filteredCampaigns.length === 0 ? (
        <div className="bg-[var(--white\/table-white,#fafbfb)] border border-[var(--white\/border,#e2e8f0)] border-dashed flex flex-col gap-[16px] items-center px-[24px] py-[80px] rounded-[24px] w-full mb-[24px]">
          <div className="bg-white border border-[#e2e8f0] flex items-center justify-center p-[8px] rounded-[99px] size-[48px]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666d80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex flex-col gap-[8px] items-center text-center">
            <h3 className="font-['Inter'] font-bold text-[20px] text-[#36394a]">
              No {activeTab !== 'All' ? TAB_LABELS[activeTab].toLowerCase() + ' ' : ''}campaigns found
            </h3>
            <p className="font-['Inter'] font-medium text-[16px] text-[#666d80] max-w-[374px]">
              Try adjusting your filters or create a new campaign to get started.
            </p>
          </div>
        </div>
      ) : (
      <table className="w-full text-left">
        <thead>
          <tr className="bg-[#fafbfb] border-y border-[var(--border-01)] h-[48px]">
            <th className="px-[16px] text-[12px] font-medium text-[#667085] uppercase font-inter">Campaign Name</th>
            <th className="px-[16px] text-[12px] font-medium text-[#667085] uppercase font-inter">Cause</th>
            <th className="px-[16px] text-[12px] font-medium text-[#667085] uppercase font-inter">Goal &amp; Progress</th>
            <th className="px-[16px] text-[12px] font-medium text-[#667085] uppercase font-inter w-[160px]">Duration</th>
            <th className="px-[16px] text-[12px] font-medium text-[#667085] uppercase font-inter w-[140px]">Status</th>
            <th className="px-[16px] text-[12px] font-medium text-[#667085] uppercase font-inter w-[140px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="px-[24px] py-[32px] text-center text-[var(--neutral-500)]">Loading...</td></tr>
          ) : fetchError ? (
            <tr><td colSpan={6} className="px-[24px] py-[32px] text-center text-red-500 text-[14px]">{fetchError}</td></tr>
          ) : filteredCampaigns.map((campaign, index) => (
            <tr key={campaign.id} className={`h-[71px] hover:bg-[#f0f4f8] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#fafbfb]'}`}>
              <td className="px-[16px] text-[14px] text-[#666d80] font-medium font-inter">
                <span className="line-clamp-2">{campaign.title}</span>
              </td>
              <td className="px-[16px] text-[14px] text-[#666d80] font-medium font-inter">
                <span className="line-clamp-2">{campaign.category}</span>
              </td>
              <td className="px-[16px] py-[14px]">
                <GoalProgress raised={campaign.raisedAmount ?? 0} goal={campaign.goalAmount} />
              </td>
              <td className="px-[16px] py-[14px]">
                <Duration startDate={campaign.startDate} endDate={campaign.endDate} />
              </td>
              <td className="px-[16px]"><StatusPill status={campaign.status} /></td>
              <td className="px-[16px]"><RowActions campaign={campaign} onStatusChange={() => fetchCampaigns(currentPage)} onDeleteClick={setDeleteTarget} onPublishClick={setPublishTarget} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      )}

      {/* Pagination */}
      <div className="h-[40px] border-t border-[#e2e8f0] flex items-center justify-between text-[14px] text-[#4b4b4b] font-inter mt-auto">
        <span>
          {totalItems === 0 ? '0' : `${currentPage * pageSize + 1}-${Math.min((currentPage + 1) * pageSize, totalItems)}`} of {totalItems} items
        </span>
        <div className="flex items-center gap-[8px]">
          <div className="bg-[#f5f5f5] rounded-[8px] h-[23px] px-[11px] flex items-center gap-[8px]">
            <span className="text-[#8e8e8e] text-[14px]">{currentPage + 1}</span>
            <ChevronDownIcon size={16} className="text-[#8e8e8e]" />
          </div>
          <span className="text-[#4b4b4b] text-[14px]">of {totalPages} pages</span>
          <button
            onClick={() => fetchCampaigns(currentPage - 1)}
            disabled={currentPage === 0}
            className="hover:bg-[var(--neutral-100)] rounded-[4px] disabled:opacity-50"
          ><ChevronLeftIcon size={16} /></button>
          <button
            onClick={() => fetchCampaigns(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="hover:bg-[var(--neutral-100)] rounded-[4px] disabled:opacity-50"
          ><ChevronRightIcon size={16} /></button>
        </div>
      </div>

      <DeleteCampaignModal
        isOpen={deleteTarget !== null}
        campaignTitle={deleteTarget?.title ?? ''}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteCampaign(deleteTarget.id);
            await fetchCampaigns(currentPage);
          }
        }}
      />

      <PublishCampaignModal
        isOpen={publishTarget !== null}
        campaignTitle={publishTarget?.title ?? ''}
        onClose={() => setPublishTarget(null)}
        onConfirm={async () => {
          if (publishTarget) {
            await updateCampaignStatus(publishTarget.id, 'active');
            await fetchCampaigns(currentPage);
          }
        }}
      />


    </div>
  );
}
