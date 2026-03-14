'use client';

import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@/components/ui/Icons';

type DonationStatus = 'Successful' | 'Failed' | 'Pending';

interface DonationType {
  id: string;
  name: string;
  amount: string;
  date: string;
  method: string;
  status: DonationStatus;
}

const mockDonations: DonationType[] = [
  { id: '1', name: 'Sarah Khan', amount: '£200', date: '30 Nov 2025', method: 'Paypal', status: 'Successful' },
  { id: '2', name: 'Anonymous', amount: '£150', date: '30 Nov 2025', method: 'Stripe', status: 'Successful' },
  { id: '3', name: 'Yusuf', amount: '£250', date: '30 Nov 2025', method: 'Card', status: 'Successful' },
  { id: '4', name: 'Anonymous', amount: '£150', date: '30 Nov 2025', method: 'Stripe', status: 'Successful' },
  { id: '5', name: 'Omar Quadari', amount: '£80', date: '30 Nov 2025', method: 'Stripe', status: 'Failed' },
  { id: '6', name: 'Anonymous', amount: '£150', date: '30 Nov 2025', method: 'Stripe', status: 'Successful' },
];

const StatusPill = ({ status }: { status: DonationStatus }) => {
  const styles: Record<DonationStatus, { border: string; text: string; bg: string }> = {
    Successful: { border: 'border-[#6bc497]', text: 'text-[#47b881]', bg: 'bg-transparent' },
    Failed: { border: 'border-[#eb6f70]', text: 'text-[#f64c4c]', bg: 'bg-transparent' },
    Pending: { border: 'border-[#ffc62b]', text: 'text-[#ffad0d]', bg: 'bg-transparent' },
  };
  const { border, text, bg } = styles[status];
  return (
    <span className={`inline-flex items-center px-[8px] py-[4px] rounded-[8px] border ${border} ${text} ${bg} text-[12px] font-normal`}
      style={{ fontFamily: "'Inter Tight', sans-serif" }}>
      {status}
    </span>
  );
};

export default function DonationHistoryTable() {
  return (
    <div className="rounded-[24px] border border-[var(--border-01)] flex flex-col p-[24px] gap-[16px]">
      <h2 className="text-[20px] font-semibold text-[#1F1F1F] font-urbanist">Donation History</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="bg-[#fafbfb] border-y border-[var(--border-01)] h-[48px]">
            <th className="px-[16px] text-[12px] font-medium text-[#667085] uppercase font-urbanist">Name</th>
            <th className="px-[16px] text-[12px] font-medium text-[#667085] uppercase font-urbanist">Amount</th>
            <th className="px-[16px] text-[12px] font-medium text-[#667085] uppercase font-urbanist">Date</th>
            <th className="px-[16px] text-[12px] font-medium text-[#667085] uppercase font-urbanist">Payment Method</th>
            <th className="px-[16px] text-[12px] font-medium text-[#667085] uppercase font-urbanist">Status</th>
          </tr>
        </thead>
        <tbody>
          {mockDonations.map((donation, index) => (
            <tr key={donation.id} className={`h-[56px] hover:bg-[#f0f4f8] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#fafbfb]'}`}>
              <td className="px-[16px] text-[14px] text-[#667085] font-medium font-urbanist">{donation.name}</td>
              <td className="px-[16px] text-[14px] text-[#36394A] font-bold font-urbanist">{donation.amount}</td>
              <td className="px-[16px] text-[14px] text-[#667085] font-medium font-urbanist">{donation.date}</td>
              <td className="px-[16px] text-[14px] text-[#667085] font-medium font-urbanist">{donation.method}</td>
              <td className="px-[16px]"><StatusPill status={donation.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="h-[40px] border-t border-[#e2e8f0] flex items-center justify-between text-[14px] text-[#4b4b4b] font-dm-sans">
        <span>1-{mockDonations.length} of {mockDonations.length} items</span>
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
