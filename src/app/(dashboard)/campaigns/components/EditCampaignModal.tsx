'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { ChevronDownIcon, EditIcon } from '@/components/ui/Icons';
import ModalCloseButton from '@/components/ui/ModalCloseButton';
import Input from '@/components/ui/Input';
import { updateCampaign } from '@/lib/api/campaigns';
import type { Campaign } from '@/types';

interface EditCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
  onUpdated?: (updated: Campaign) => void;
}

export default function EditCampaignModal({ isOpen, onClose, campaign, onUpdated }: EditCampaignModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    goalAmount: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPublished = campaign.status === 'active' || campaign.status === 'paused';

  // Sync form whenever the modal opens or the campaign changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: campaign.title ?? '',
        category: campaign.category ?? 'General',
        goalAmount: String(campaign.goalAmount ?? ''),
        startDate: campaign.startDate ? campaign.startDate.slice(0, 10) : '',
        endDate: campaign.endDate ? campaign.endDate.slice(0, 10) : '',
        description: campaign.description ?? '',
      });
      setError(null);
    }
  }, [isOpen, campaign]);

  const handleClose = () => {
    setShowConfirm(false);
    setError(null);
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPublished) {
      setShowConfirm(true);
    } else {
      void doSave();
    }
  };

  const doSave = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const updated = await updateCampaign(campaign.id, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        goalAmount: Number(formData.goalAmount),
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        status: campaign.status,
      });
      onUpdated?.(updated);
      handleClose();
    } catch {
      setError('Failed to update campaign. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen && !showConfirm} onClose={handleClose} className="max-w-[700px] w-full">
        <div className="flex items-center justify-between p-[24px] border-b border-[var(--border-01)]">
          <h2 className="text-[20px] font-semibold text-[var(--grey-800)] font-inter">Edit Campaign</h2>
          <ModalCloseButton onClick={handleClose} />
        </div>

        <form className="p-[24px] flex flex-col gap-[24px]" onSubmit={handleFormSubmit}>

          {/* Title */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[14px] font-medium text-[var(--grey-800)]">Title</label>
            <Input
              placeholder="Campaign title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Cause & Target Amount */}
          <div className="flex items-center gap-[24px]">
            <div className="flex flex-col gap-[8px] flex-1">
              <label className="text-[14px] font-medium text-[var(--grey-800)]">Cause</label>
              <div className="relative">
                <select
                  className="w-full h-[48px] px-[16px] bg-white border border-[var(--border-01)] rounded-[8px] text-[14px] text-[var(--grey-800)] appearance-none outline-none focus:border-[var(--brand)] transition-colors"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="General">General</option>
                  <option value="Masjid Development">Masjid Development</option>
                  <option value="Education & Dawa'h">Education & Dawa&apos;h</option>
                  <option value="Charity & Welfare">Charity & Welfare</option>
                </select>
                <ChevronDownIcon size={20} className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[var(--neutral-500)] pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-[8px] flex-1">
              <label className="text-[14px] font-medium text-[var(--grey-800)]">Target Amount</label>
              <div className="relative">
                <span className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[var(--grey-800)] font-medium">£</span>
                <input
                  type="number"
                  placeholder="0"
                  min="1"
                  required
                  className="w-full h-[48px] pl-[32px] pr-[16px] bg-white border border-[var(--border-01)] rounded-[8px] text-[14px] text-[var(--grey-800)] outline-none focus:border-[var(--brand)] transition-colors"
                  value={formData.goalAmount}
                  onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Start & End Date */}
          <div className="flex items-center gap-[24px]">
            <div className="flex flex-col gap-[8px] flex-1">
              <label className="text-[14px] font-medium text-[var(--grey-800)]">Start Date</label>
              <input
                type="date"
                required
                className="w-full h-[48px] px-[16px] bg-white border border-[var(--border-01)] rounded-[8px] text-[14px] text-[var(--grey-800)] outline-none focus:border-[var(--brand)] transition-colors"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-[8px] flex-1">
              <label className="text-[14px] font-medium text-[var(--grey-800)]">End Date <span className="text-[var(--neutral-400)] font-normal">(optional)</span></label>
              <input
                type="date"
                className="w-full h-[48px] px-[16px] bg-white border border-[var(--border-01)] rounded-[8px] text-[14px] text-[var(--grey-800)] outline-none focus:border-[var(--brand)] transition-colors"
                value={formData.endDate}
                min={formData.startDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[14px] font-medium text-[var(--grey-800)]">Description</label>
            <textarea
              placeholder="Campaign description..."
              className="w-full h-[120px] p-[16px] bg-white border border-[var(--border-01)] rounded-[8px] text-[14px] text-[var(--grey-800)] outline-none focus:border-[var(--brand)] transition-colors resize-none placeholder:text-[var(--neutral-400)]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {error && <p className="text-[13px] text-[#f64c4c]">{error}</p>}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-[16px] mt-2 pt-2 border-t border-[var(--border-01)]">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-[20px] py-[10px] text-[14px] font-medium text-[var(--grey-800)] bg-white border border-[var(--border-01)] rounded-[8px] hover:bg-[var(--neutral-50)] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-[20px] py-[10px] text-[14px] font-medium text-white bg-[var(--brand)] rounded-[8px] hover:bg-[#046c4e] transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showConfirm}
        eventType="upcoming"
        title="Save Changes to Published Campaign?"
        description="This campaign is currently live. Editing it will update the details visible to donors. Please confirm you want to proceed."
        confirmLabel="Save Changes"
        submittingLabel="Saving..."
        confirmVariant="primary"
        iconNode={<EditIcon size={24} className="text-white" />}
        iconContainerClassName="bg-[var(--brand)] border-[#bbf7d0]"
        onClose={() => setShowConfirm(false)}
        onConfirm={doSave}
      />
    </>
  );
}
