'use client';

import Modal from '@/components/ui/Modal';
import { CloseIcon } from '@/components/ui/Icons';
import type { AdminUserResponse } from '@/types/api';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  user: AdminUserResponse | null;
}

export default function ProfileModal({ isOpen, onClose, onLogout, user }: ProfileModalProps) {
  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  const displayName = user?.username || user?.fullName || 'User';

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[620px] w-full !rounded-[12px]">
      <div className="px-[24px] py-[28px] flex flex-col gap-[28px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-urbanist font-bold text-[24px] text-[#36394a]">My Profile</h2>
          <button
            onClick={onClose}
            className="w-[32px] h-[32px] rounded-[8px] bg-[rgba(47,128,237,0.05)] flex items-center justify-center hover:bg-[rgba(47,128,237,0.1)] transition-colors"
          >
            <CloseIcon size={20} className="text-[#36394a]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex gap-[32px]">
          {/* Left: Avatar + Logout */}
          <div className="flex flex-col items-center gap-[24px] w-[140px] shrink-0">
            <div className="flex flex-col items-center gap-[12px]">
              <div className="w-[80px] h-[80px] rounded-full bg-[var(--brand)] flex items-center justify-center">
                <span className="font-urbanist font-bold text-[28px] text-white">{initials}</span>
              </div>
              <p className="font-urbanist text-[16px] text-[#1f1f1f] text-center leading-[1.25]">{displayName}</p>
            </div>

            <button
              onClick={() => { onLogout(); onClose(); }}
              className="flex items-center gap-[10px] h-[44px] px-[24px] border border-[#ffccd2] rounded-[12px] hover:bg-red-50 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f64c4c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="font-urbanist font-medium text-[14px] text-[#f64c4c]">Logout</span>
            </button>
          </div>

          {/* Right: Read-only Fields + Close */}
          <div className="flex flex-col gap-[24px] flex-1">
            <div className="flex flex-col gap-[20px]">
              <div className="flex flex-col gap-[8px]">
                <label className="font-urbanist font-medium text-[12px] text-[#4b4b4b]">Username</label>
                <div className="w-full h-[52px] px-[16px] py-[12px] border border-[#e2e8f0] rounded-[8px] font-urbanist text-[16px] text-[#4b4b4b] leading-[1.25] flex items-center bg-white">
                  {user?.fullName || '-'}
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="font-urbanist font-medium text-[12px] text-[#4b4b4b]">Email</label>
                <div className="w-full h-[52px] px-[16px] py-[12px] border border-[#e2e8f0] rounded-[8px] font-urbanist text-[16px] text-[#4b4b4b] leading-[1.25] flex items-center bg-white">
                  {user?.email || '-'}
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="font-urbanist font-medium text-[12px] text-[#4b4b4b]">Mobile</label>
                <div className="w-full h-[52px] px-[16px] py-[12px] border border-[#e2e8f0] rounded-[8px] font-urbanist text-[16px] text-[#4b4b4b] leading-[1.25] flex items-center bg-white">
                  -
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="h-[44px] px-[24px] border border-[#e2e8f0] rounded-[12px] font-urbanist font-medium text-[16px] text-[#4b4b4b] hover:bg-[var(--neutral-100)] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
