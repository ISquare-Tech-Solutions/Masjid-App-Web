'use client';

import { useState } from 'react';
import { EyeIcon, EditIcon, StopCircleIcon, TrashIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@/components/ui/Icons';
import Link from 'next/link';

type CampaignStatus = 'Active' | 'Completed' | 'Draft';

interface CampaignType {
  id: string;
  title: string;
  cause: string;
  target: string;
  collected: string;
  progress: string;
  status: CampaignStatus;
  endDate: string;
}

const mockCampaigns: CampaignType[] = [
  { id: '1', title: 'Help Build New Wudu Area', cause: 'Masjid Development', target: '£15,000', collected: '£10,500', progress: '70%', status: 'Active', endDate: '30 Nov 2025' },
  { id: '2', title: 'Sponsor a student for Education', cause: "Education & Dawa'h", target: '£5,000', collected: '£2,250', progress: '45%', status: 'Active', endDate: '30 Nov 2025' },
  { id: '3', title: 'Winter warmth Drive', cause: 'Charity & Welfare', target: '£8,000', collected: '£8,000', progress: '100%', status: 'Completed', endDate: '15 Oct 2025' },
  { id: '4', title: 'Emergency Support for brother Yusuf', cause: 'Help a Brother or Sister', target: '£2,000', collected: '£0', progress: '0%', status: 'Draft', endDate: '-' },
];

const StatusPill = ({ status }: { status: CampaignStatus }) => {
  const styles: Record<CampaignStatus, { border: string; text: string }> = {
    Active: { border: 'border-[#6bc497]', text: 'text-[#47b881]' },
    Completed: { border: 'border-[#eb6f70]', text: 'text-[#f64c4c]' },
    Draft: { border: 'border-[#ffc62b]', text: 'text-[#ffad0d]' },
  };
  const { border, text } = styles[status];
  return (
    <span className={`inline-flex items-center justify-center px-[8px] py-[4px] rounded-[8px] border ${border} ${text} text-[12px] font-normal capitalize`}
      style={{ fontFamily: "'Inter Tight', sans-serif" }}>
      {status}
    </span>
  );
};

const RowActions = ({ campaign }: { campaign: CampaignType }) => {
  switch (campaign.status) {
    case 'Active':
      return (
        <div className="flex items-center gap-[12px]">
          <Link href={`/campaigns/${campaign.id}`} className="text-[#667085] hover:text-[var(--brand)] transition-colors"><EyeIcon size={20} /></Link>
          <button className="text-[#667085] hover:text-[var(--brand)] transition-colors"><EditIcon size={20} /></button>
          <button className="text-[#eb6f70] hover:opacity-80 transition-opacity"><StopCircleIcon size={20} /></button>
        </div>
      );
    case 'Completed':
      return (
        <div className="flex items-center gap-[12px]">
          <Link href={`/campaigns/${campaign.id}`} className="text-[#667085] hover:text-[var(--brand)] transition-colors"><EyeIcon size={20} /></Link>
        </div>
      );
    case 'Draft':
      return (
        <div className="flex items-center gap-[12px]">
          <button className="text-[#667085] hover:text-[var(--brand)] transition-colors"><EditIcon size={20} /></button>
          <button className="text-[#eb6f70] hover:opacity-80 transition-opacity"><TrashIcon size={20} /></button>
        </div>
      );
  }
};

export default function CampaignTable() {
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Completed' | 'Draft'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const tabs = ['All', 'Active', 'Completed', 'Draft'] as const;

  const filteredCampaigns = mockCampaigns.filter(c => {
    const matchesTab = activeTab === 'All' || c.status === activeTab;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.cause.toLowerCase().includes(searchQuery.toLowerCase());
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
                  ${isFirst ? 'rounded-tl-[8px] rounded-bl-[8px] border border-[var(--border-01)]' : 'border-t border-b border-r border-[var(--border-01)]'}
                  ${isLast ? 'rounded-tr-[8px] rounded-br-[8px]' : ''}
                  ${isActive ? 'bg-[#fafbfb] font-bold text-[#1f1f1f] font-urbanist' : 'bg-white font-normal text-[#667085] font-urbanist hover:bg-[#fafbfb]'}
                `}
              >
                {tab === 'All' && isActive && <div className="w-[10px] h-[10px] rounded-full bg-[#1F1F1F]" />}
                {tab}
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
            className="w-full h-[40px] pl-[42px] pr-[14px] py-[10px] bg-white border border-[var(--border-01)] rounded-[11px] text-[12px] text-[var(--grey-800)] placeholder:text-[#666D80] font-urbanist focus:outline-none focus:border-[var(--brand)] transition-colors"
          />
        </div>
      </div>

      <div className="h-[2px] bg-[#f6f6f6] rounded-[2px] w-full mt-[16px]" />

      {/* Table */}
      <table className="w-full text-left">
        <thead>
          <tr className="bg-[#fafbfb] border-y border-[var(--border-01)] h-[48px]">
            <th className="pl-[16px] w-[52px]">
              <div className="w-[20px] h-[20px] border border-[#e6e6e6] rounded-[4px] bg-white" />
            </th>
            <th className="px-[12px] text-[12px] font-medium text-[#667085] uppercase font-urbanist">Title</th>
            <th className="px-[12px] text-[12px] font-medium text-[#667085] uppercase font-urbanist">Cause</th>
            <th className="px-[12px] text-[12px] font-medium text-[#667085] uppercase font-urbanist w-[90px]">Target</th>
            <th className="px-[12px] text-[12px] font-medium text-[#667085] uppercase font-urbanist w-[90px]">Collected</th>
            <th className="px-[12px] text-[12px] font-medium text-[#667085] uppercase font-urbanist w-[80px]">Progress</th>
            <th className="px-[12px] text-[12px] font-medium text-[#667085] uppercase font-urbanist w-[90px]">Status</th>
            <th className="px-[12px] text-[12px] font-medium text-[#667085] uppercase font-urbanist w-[110px]">End Date</th>
            <th className="px-[12px] text-[12px] font-medium text-[#667085] uppercase font-urbanist w-[100px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCampaigns.map((campaign, index) => (
            <tr key={campaign.id} className={`h-[72px] hover:bg-[#f0f4f8] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#fafbfb]'}`}>
              <td className="pl-[16px]">
                <div className="w-[20px] h-[20px] border border-[#e6e6e6] rounded-[4px] bg-white" />
              </td>
              <td className="px-[12px] text-[14px] text-[#667085] font-medium font-urbanist"><span className="line-clamp-2">{campaign.title}</span></td>
              <td className="px-[12px] text-[14px] text-[#667085] font-medium font-urbanist"><span className="line-clamp-2">{campaign.cause}</span></td>
              <td className="px-[12px] text-[14px] text-[#36394A] font-bold font-urbanist">{campaign.target}</td>
              <td className="px-[12px] text-[14px] text-[#36394A] font-bold font-urbanist">{campaign.collected}</td>
              <td className="px-[12px] text-[14px] text-[#36394A] font-medium font-urbanist">{campaign.progress}</td>
              <td className="px-[12px]"><StatusPill status={campaign.status} /></td>
              <td className="px-[12px] text-[14px] text-[#667085] font-medium font-urbanist whitespace-nowrap">{campaign.endDate}</td>
              <td className="px-[12px]"><RowActions campaign={campaign} /></td>
            </tr>
          ))}
          {filteredCampaigns.length === 0 && (
            <tr><td colSpan={9} className="px-[24px] py-[32px] text-center text-[var(--neutral-500)]">No campaigns found.</td></tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="h-[40px] border-t border-[#e2e8f0] flex items-center justify-between text-[14px] text-[#4b4b4b] font-dm-sans mt-auto">
        <span>1-{filteredCampaigns.length} of {filteredCampaigns.length} items</span>
        <div className="flex items-center gap-[8px]">
          <div className="bg-[#f5f5f5] rounded-[8px] h-[23px] px-[11px] flex items-center gap-[8px]">
            <span className="text-[#8e8e8e] text-[14px]">1</span>
            <ChevronDownIcon size={16} className="text-[#8e8e8e]" />
          </div>
          <span className="text-[#4b4b4b] text-[14px]">of 1 pages</span>
          <button className="hover:bg-[var(--neutral-100)] rounded-[4px] disabled:opacity-50" disabled><ChevronLeftIcon size={16} /></button>
          <button className="hover:bg-[var(--neutral-100)] rounded-[4px] disabled:opacity-50" disabled><ChevronRightIcon size={16} /></button>
        </div>
      </div>
    </div>
  );
}
