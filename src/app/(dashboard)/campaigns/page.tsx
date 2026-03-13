'use client';

import { useState } from 'react';
import { ActivityPulseIcon, UsersIcon, PoundIcon, StarIcon, PlusIcon } from '@/components/ui/Icons';
import CampaignTable from './components/CampaignTable';
import AddCampaignModal from './components/AddCampaignModal';

export default function CampaignsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const stats = [
    {
      label: 'ACTIVE',
      value: '3',
      icon: <ActivityPulseIcon size={20} className="text-[#3b82f6]" />,
      bgColor: 'bg-[#eff6ff]',
      borderColor: 'border-[#dbeafe]'
    },
    {
      label: 'DONORS',
      value: '12',
      icon: <UsersIcon size={20} className="text-[#eab308]" />,
      bgColor: 'bg-[#fefce8]',
      borderColor: 'border-[#fef9c3]'
    },
    {
      label: 'RAISED THIS MONTH',
      value: '£20,750',
      icon: <PoundIcon size={20} className="text-[#10b981]" />,
      bgColor: 'bg-[#f0fdf4]',
      borderColor: 'border-[#dcfce7]'
    },
    {
      label: 'TOTAL RAISED',
      value: '£20,750',
      icon: <StarIcon size={20} className="text-[#f97316]" />,
      bgColor: 'bg-[#fff0eb]',
      borderColor: 'border-[#ffe0d5]'
    },
  ];

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-semibold text-[#1F1F1F] font-urbanist">Campaign</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-[10px] h-[44px] bg-[var(--brand)] text-white px-[24px] py-[16px] rounded-[12px] hover:bg-[#046c4e] transition-colors"
        >
          <PlusIcon size={20} />
          <span className="font-medium text-[16px] font-inter">New Campaign</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="flex items-start gap-[24px]">
        {stats.map((stat, i) => (
          <div key={i} className="p-[16px] rounded-[16px] border border-[var(--border-01)] flex flex-1 items-center gap-[16px] min-w-0">
            <div className={`p-[12px] rounded-full shrink-0 border ${stat.bgColor} ${stat.borderColor}`}>
              {stat.icon}
            </div>
            <div className="flex flex-col gap-[4px] min-w-0">
              <span className="text-[14px] font-medium text-[#666D80] font-inter leading-none">{stat.label}</span>
              <span className="text-[28px] font-semibold text-[#36394A] font-inter leading-none">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="rounded-[24px] border border-[var(--border-01)] flex flex-col p-[24px] gap-[16px]">
        <h2 className="text-[20px] font-semibold text-[#1F1F1F] font-urbanist">Active Campaigns</h2>
        <CampaignTable />
      </div>

      <AddCampaignModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
