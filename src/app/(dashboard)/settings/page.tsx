'use client';

import { useState } from 'react';
import { UploadIcon } from '@/components/ui/Icons';

const Checkbox = ({ label }: { label: string }) => (
  <label className="flex items-center gap-[8px] cursor-pointer group w-fit">
    <div className="w-[20px] h-[20px] rounded-[4px] border border-[#e2e8f0] bg-white group-hover:border-[var(--brand)] transition-colors flex items-center justify-center shrink-0" />
    <span className="font-urbanist text-[16px] text-[#4b4b4b] leading-normal select-none" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
      {label}
    </span>
  </label>
);

const RadioYesNo = ({ label, selected, onChange }: { label: string; selected: boolean; onChange: () => void }) => (
  <label className="flex items-center gap-[8px] cursor-pointer" onClick={onChange}>
    <div className="w-[20px] h-[20px] rounded-full border border-[#e2e8f0] bg-white flex items-center justify-center shrink-0">
      {selected && <div className="w-[10px] h-[10px] rounded-full bg-[var(--brand)]" />}
    </div>
    <span className="font-urbanist font-medium text-[14px] text-[#667085]">{label}</span>
  </label>
);

const SettingInput = ({ label, placeholder = '-' }: { label: string; placeholder?: string }) => (
  <div className="flex flex-col gap-[8px] flex-1 min-w-0">
    <label className="font-urbanist font-semibold text-[16px] text-[#4b4b4b] tracking-[0.16px] leading-none">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      className="w-full h-[48px] px-[21px] py-[16px] border border-[#e2e8f0] rounded-[12px] font-urbanist text-[16px] text-[#666d80] placeholder:text-[#666d80] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition-all"
    />
  </div>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'masjid' | 'bank'>('masjid');

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Page Title */}
      <h1 className="font-urbanist font-bold text-[28px] text-[#1f1f1f] leading-none">App Settings</h1>

      {/* Tab Bar */}
      <div className="bg-[rgba(7,119,52,0.05)] flex items-center">
        <button
          onClick={() => setActiveTab('masjid')}
          className={`w-[250px] h-[69px] flex items-center justify-center font-urbanist text-[18px] transition-colors
            ${activeTab === 'masjid'
              ? 'border-b-2 border-[var(--brand)] text-[var(--brand)] font-semibold'
              : 'border-b-2 border-transparent text-[#36394a] font-normal'
            }`}
        >
          Masjid Details
        </button>
        <button
          onClick={() => setActiveTab('bank')}
          className={`w-[250px] h-[69px] flex items-center justify-center font-urbanist text-[18px] transition-colors
            ${activeTab === 'bank'
              ? 'border-b-2 border-[var(--brand)] text-[var(--brand)] font-semibold'
              : 'border-b-2 border-transparent text-[#36394a] font-normal'
            }`}
        >
          Bank &amp; Payment Settings
        </button>
      </div>

      {/* Masjid Details Tab */}
      {activeTab === 'masjid' && (
        <div className="border border-[#e2e8f0] rounded-[24px] p-[24px] flex flex-col gap-[24px]">
          <h2 className="font-urbanist font-semibold text-[20px] text-[#36394a]">Masjid Informations</h2>
          <div className="h-[2px] bg-[#f6f6f6] rounded-[2px]" />

          {/* Form Fields + Logo Upload */}
          <div className="flex gap-[24px]">
            <div className="flex flex-col gap-[24px] flex-1">
              <SettingInput label="Masjid Name" />
              <SettingInput label="Contact Number" />
              <SettingInput label="Email" />
              <SettingInput label="Website" />
            </div>
            <div className="flex flex-col items-center flex-1 pt-[8px]">
              <div className="w-[56px] h-[56px] mb-[24px] rounded-[16px] bg-[#89C7A1] flex items-center justify-center text-white">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <button className="flex items-center gap-[8px] mb-[12px]">
                <UploadIcon className="text-[var(--brand)]" size={20} />
                <span className="text-[16px] text-[var(--brand)]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>Upload LOGO</span>
              </button>
              <p className="text-[14px] text-[#666d80] text-center" style={{ fontFamily: "'Inter Tight', sans-serif" }}>Upload Your Logo.</p>
              <p className="text-[12px] text-[#666d80] text-center mt-[4px]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                File Format <strong className="text-[#36394a]">.jpeg, .Png</strong> Recommened Size <strong className="text-[#36394a]">600x600 (1:1)</strong>
              </p>
            </div>
          </div>

          {/* About + Address */}
          <div className="flex gap-[24px]">
            <div className="flex flex-col gap-[8px] flex-1">
              <label className="font-urbanist font-semibold text-[16px] text-[#4b4b4b] tracking-[0.16px] leading-none">About Masjid</label>
              <textarea
                placeholder="-"
                className="w-full min-h-[148px] px-[21px] py-[16px] border border-[#e2e8f0] rounded-[12px] font-urbanist text-[16px] text-[#666d80] placeholder:text-[#666d80] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent resize-none"
              />
            </div>
            <div className="flex flex-col gap-[24px] flex-1">
              <SettingInput label="Address Line 1" />
              <SettingInput label="Address Line 1" />
              <div className="flex gap-[24px]">
                <SettingInput label="Town or City" />
                <SettingInput label="Post Code" />
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button className="h-[44px] px-[24px] bg-[var(--brand)] text-white rounded-[12px] font-urbanist font-medium text-[16px] hover:bg-[#065d29] transition-colors">
              Save
            </button>
          </div>

          <div className="h-[2px] bg-[#f6f6f6] rounded-[2px]" />

          {/* Service Offered */}
          <div className="flex gap-[24px]">
            <div className="flex flex-col gap-[8px] flex-1">
              <h2 className="font-urbanist font-semibold text-[20px] text-[#36394a]">Service Offered</h2>
              <p className="text-[16px] text-[#666d80] leading-[1.25] max-w-[300px]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                Select the services provided by your masjid. These will be displayed in the mobile app for community awareness.
              </p>
            </div>
            <div className="flex flex-col gap-[16px] flex-1">
              <Checkbox label="Marriage / Nikkah Ceremonies" />
              <Checkbox label="Hall Hire" />
              <Checkbox label="Iftar (Ramadan)" />
              <Checkbox label="Advice & Counselling" />
              <Checkbox label="New Muslim Support" />
              <Checkbox label="Funeral Support" />
            </div>
          </div>

          <div className="h-[2px] bg-[#f6f6f6] rounded-[2px]" />

          {/* Facilities Available */}
          <div className="flex gap-[24px]">
            <div className="flex flex-col gap-[8px] flex-1">
              <h2 className="font-urbanist font-semibold text-[20px] text-[#36394a]">Facilities Available</h2>
              <p className="text-[16px] text-[#666d80] leading-[1.25] max-w-[300px]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                Indicate the facilities available at your masjid. These will help users understand accessibility and amenities.
              </p>
            </div>
            <div className="flex flex-col gap-[16px] flex-1">
              <Checkbox label="Parking" />
              <Checkbox label="Womens Area" />
              <Checkbox label="Shoe Shelves" />
              <Checkbox label="Ablutions rooms" />
              <Checkbox label="Washroom" />
            </div>
          </div>

          <div className="h-[2px] bg-[#f6f6f6] rounded-[2px]" />

          {/* Capacity */}
          <div className="flex gap-[24px]">
            <div className="flex flex-col gap-[8px] flex-1">
              <h2 className="font-urbanist font-semibold text-[20px] text-[#36394a]">Capacity</h2>
              <p className="text-[16px] text-[#666d80] leading-[1.25] max-w-[300px]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                Provide the approximate capacity of the masjid. This helps users plan their visit, especially during peak prayer times.
              </p>
            </div>
            <div className="flex flex-col gap-[16px] flex-1">
              <div className="flex flex-col gap-[6px]">
                <span className="font-urbanist font-medium text-[14px] text-[#667085]">Men</span>
                <input type="text" placeholder="00" className="w-full h-[48px] px-[21px] py-[16px] border border-[#e2e8f0] rounded-[12px] font-urbanist text-[16px] text-[#8e8e8e] placeholder:text-[#8e8e8e] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent" />
              </div>
              <div className="flex flex-col gap-[6px]">
                <div className="flex items-center justify-between">
                  <span className="font-urbanist font-medium text-[14px] text-[#667085]">Women&apos;s Access</span>
                  <RadioYesNo label="No" selected={false} onChange={() => {}} />
                </div>
                <input type="text" placeholder="00" className="w-full h-[48px] px-[21px] py-[16px] border border-[#e2e8f0] rounded-[12px] font-urbanist text-[16px] text-[#8e8e8e] placeholder:text-[#8e8e8e] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent" />
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button className="h-[44px] px-[24px] bg-[var(--brand)] text-white rounded-[12px] font-urbanist font-medium text-[16px] hover:bg-[#065d29] transition-colors">
              Save
            </button>
          </div>
        </div>
      )}

      {/* Bank & Payment Settings Tab */}
      {activeTab === 'bank' && (
        <div className="border border-[#e2e8f0] rounded-[24px] p-[24px] flex flex-col gap-[24px]">
          <h2 className="font-urbanist font-semibold text-[20px] text-[#36394a]">BANK &amp; PAYMENT SETTINGS</h2>
          <div className="h-[2px] bg-[#f6f6f6] rounded-[2px]" />

          <div className="flex gap-[24px]">
            <SettingInput label="Account Holder Name" />
            <SettingInput label="Bank Name" />
          </div>

          <div className="flex gap-[24px]">
            <SettingInput label="Account Number" />
            <SettingInput label="Sort Code" />
          </div>

          <div className="flex justify-end gap-[12px]">
            <button className="h-[44px] px-[24px] border border-[#e2e8f0] rounded-[12px] font-urbanist font-medium text-[16px] text-[#4b4b4b] hover:bg-[var(--neutral-100)] transition-colors">
              Update
            </button>
            <button className="h-[44px] px-[24px] bg-[var(--brand)] text-white rounded-[12px] font-urbanist font-medium text-[16px] opacity-50">
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
