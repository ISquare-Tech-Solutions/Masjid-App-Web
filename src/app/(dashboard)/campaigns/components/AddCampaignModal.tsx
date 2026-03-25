'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { ChevronDownIcon, CloseIcon } from '@/components/ui/Icons';
import Input from '@/components/ui/Input';
import { createCampaign } from '@/lib/api/campaigns';

interface AddCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function AddCampaignModal({ isOpen, onClose, onCreated }: AddCampaignModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    goalAmount: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createCampaign({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        goalAmount: Number(formData.goalAmount),
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        status: isDraft ? 'draft' : 'active',
      });
      onCreated?.();
      onClose();
    } catch (err) {
      setError('Failed to create campaign. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] w-full">
      <div className="flex items-center justify-between p-[24px] border-b border-[var(--border-01)]">
        <h2 className="text-[20px] font-semibold text-[var(--grey-800)] font-inter">Add New Campaign</h2>
        <button type="button" onClick={onClose} className="p-1 hover:bg-[var(--neutral-100)] rounded-[8px] transition-colors text-[var(--neutral-500)]">
          <CloseIcon size={20} />
        </button>
      </div>
      <form className="p-[24px] flex flex-col gap-[24px]" onSubmit={(e) => handleSubmit(e, false)}>

        {/* Title */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-[14px] font-medium text-[var(--grey-800)]">Title</label>
          <Input
            placeholder="Masjid Maintenance Work Tomorrow"
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
                <option value="Education & Dawa'h">Education & Dawa'h</option>
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
            placeholder="Support the construction of a new Wudu area to make the masjid more accessible and comfortable for all community members."
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
            onClick={onClose}
            disabled={submitting}
            className="px-[20px] py-[10px] text-[14px] font-medium text-[var(--grey-800)] bg-white border border-[var(--border-01)] rounded-[8px] hover:bg-[var(--neutral-50)] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={(e) => handleSubmit(e, true)}
            className="px-[20px] py-[10px] text-[14px] font-medium text-[var(--grey-800)] bg-white border border-[var(--border-01)] rounded-[8px] hover:bg-[var(--neutral-50)] transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-[20px] py-[10px] text-[14px] font-medium text-white bg-[var(--brand)] rounded-[8px] hover:bg-[#046c4e] transition-colors disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Campaign'}
          </button>
        </div>

      </form>
    </Modal>
  );
}
