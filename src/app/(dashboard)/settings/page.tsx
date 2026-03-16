'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { UploadIcon } from '@/components/ui/Icons';
import { getSettings, updateSettings, updatePaymentSettings, connectStripe, disconnectStripe, getStripeStatus } from '@/lib/api/settings';
import type {
  MasjidSettingsResponse,
  MasjidServices,
  MasjidFacilities,
  StripeStatus,
} from '@/types/settings';

const Checkbox = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className="flex items-center gap-[8px] cursor-pointer group w-fit"
  >
    <div
      className="w-[20px] h-[20px] rounded-[4px] border transition-colors flex items-center justify-center shrink-0"
      style={{
        backgroundColor: checked ? 'var(--brand)' : '#fff',
        borderColor: checked ? 'var(--brand)' : '#e2e8f0',
      }}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
    <span
      className="font-urbanist text-[16px] text-[#4b4b4b] leading-normal select-none"
      style={{ fontFamily: "'Inter Tight', sans-serif" }}
    >
      {label}
    </span>
  </button>
);

const RadioYesNo = ({
  label,
  selected,
  onChange,
}: {
  label: string;
  selected: boolean;
  onChange: () => void;
}) => (
  <label className="flex items-center gap-[8px] cursor-pointer" onClick={onChange}>
    <div className="w-[20px] h-[20px] rounded-full border border-[#e2e8f0] bg-white flex items-center justify-center shrink-0">
      {selected && <div className="w-[10px] h-[10px] rounded-full bg-[var(--brand)]" />}
    </div>
    <span className="font-urbanist font-medium text-[14px] text-[#667085]">{label}</span>
  </label>
);

const SettingInput = ({
  label,
  placeholder = '-',
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-col gap-[8px] flex-1 min-w-0">
    <label className="font-urbanist font-semibold text-[16px] text-[#4b4b4b] tracking-[0.16px] leading-none">
      {label}
    </label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-[48px] px-[21px] py-[16px] border border-[#e2e8f0] rounded-[12px] font-urbanist text-[16px] text-[#666d80] placeholder:text-[#666d80] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition-all"
    />
  </div>
);

const LoadingSkeleton = () => (
  <div className="border border-[#e2e8f0] rounded-[24px] p-[24px] flex flex-col gap-[24px] animate-pulse">
    <div className="h-6 w-48 bg-[#e2e8f0] rounded" />
    <div className="h-[2px] bg-[#f6f6f6] rounded-[2px]" />
    <div className="flex gap-[24px]">
      <div className="flex flex-col gap-[24px] flex-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-[8px]">
            <div className="h-4 w-32 bg-[#e2e8f0] rounded" />
            <div className="h-[48px] bg-[#e2e8f0] rounded-[12px]" />
          </div>
        ))}
      </div>
      <div className="flex-1 flex justify-center pt-[40px]">
        <div className="w-[56px] h-[56px] bg-[#e2e8f0] rounded-[16px]" />
      </div>
    </div>
  </div>
);

const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-[12px] shadow-lg text-white font-urbanist font-medium text-[15px] transition-all ${
        type === 'success' ? 'bg-[var(--brand)]' : 'bg-[#dc2626]'
      }`}
    >
      {type === 'success' ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10L8 14L16 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="white" strokeWidth="2" /><path d="M10 6V10M10 14H10.01" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
      )}
      {message}
    </div>
  );
};

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'masjid' | 'bank'>('masjid');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [connectingStripe, setConnectingStripe] = useState(false);
  const [disconnectingStripe, setDisconnectingStripe] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<StripeStatus | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Masjid details form state
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [mensCapacity, setMensCapacity] = useState('');
  const [womensCapacity, setWomensCapacity] = useState('');
  const [hasWomensArea, setHasWomensArea] = useState(false);

  // Services
  const [services, setServices] = useState<MasjidServices>({
    marriageService: false,
    hallRental: false,
    iftarProgram: false,
    counseling: false,
    newMuslimSupport: false,
    funeralService: false,
  });

  // Facilities
  const [facilities, setFacilities] = useState<MasjidFacilities>({
    parking: false,
    womensArea: false,
    shoeRacks: false,
    wuduFacilities: false,
    washroom: false,
  });

  // Payment form state
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankSortCode, setBankSortCode] = useState('');

  const populateForm = useCallback((data: MasjidSettingsResponse) => {
    setName(data.name || '');
    setAbout(data.about || '');
    setPhone(data.contact?.phone || '');
    setEmail(data.contact?.email || '');
    setWebsite(data.contact?.website || '');
    setAddressLine1(data.address?.line1 || '');
    setAddressLine2(data.address?.line2 || '');
    setCity(data.address?.city || '');
    setPostcode(data.address?.postcode || '');
    setMensCapacity(data.capacity?.mens?.toString() || '');
    setWomensCapacity(data.capacity?.womens?.toString() || '');
    setHasWomensArea((data.capacity?.womens ?? 0) > 0);

    if (data.services) {
      setServices(data.services);
    }
    if (data.facilities) {
      setFacilities(data.facilities);
    }

    setBankAccountName(data.payment?.bankAccountName || '');
    setBankName(data.payment?.bankName || '');
    setBankAccountNumber(data.payment?.bankAccountNumber || '');
    setBankSortCode(data.payment?.bankSortCode || '');

    if (data.stripe) setStripeStatus(data.stripe);
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      populateForm(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
      setToast({ message: 'Failed to load settings', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [populateForm]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Detect Stripe redirect back after onboarding
  useEffect(() => {
    const stripeParam = searchParams.get('stripe');
    if (stripeParam === 'success') {
      setActiveTab('bank');
      setToast({ message: 'Stripe connected! Syncing account status...', type: 'success' });
      // Call status endpoint directly to get fresh data from Stripe
      getStripeStatus().then(setStripeStatus).catch(() => fetchSettings());
    } else if (stripeParam === 'refresh') {
      setActiveTab('bank');
      setToast({ message: 'Stripe onboarding expired. Please reconnect.', type: 'error' });
    }
  }, [searchParams, fetchSettings]);

  const handleConnectStripe = async () => {
    try {
      setConnectingStripe(true);
      const origin = window.location.origin;
      const returnUrl = `${origin}/settings?stripe=success`;
      const refreshUrl = `${origin}/settings?stripe=refresh`;
      const onboardingUrl = await connectStripe(returnUrl, refreshUrl);
      window.location.href = onboardingUrl;
    } catch (err) {
      console.error('Failed to connect Stripe:', err);
      setToast({ message: 'Failed to start Stripe onboarding. Check configuration.', type: 'error' });
      setConnectingStripe(false);
    }
  };

  const handleDisconnectStripe = async () => {
    if (!window.confirm('Are you sure you want to disconnect Stripe? Donations will be disabled.')) return;
    try {
      setDisconnectingStripe(true);
      await disconnectStripe();
      setStripeStatus({ accountId: null, connected: false, onboardingComplete: false, acceptingDonations: false, payoutsEnabled: false });
      setToast({ message: 'Stripe account disconnected.', type: 'success' });
    } catch (err) {
      console.error('Failed to disconnect Stripe:', err);
      setToast({ message: 'Failed to disconnect Stripe.', type: 'error' });
    } finally {
      setDisconnectingStripe(false);
    }
  };

  const handleSaveMasjidDetails = async () => {
    if (!name.trim()) {
      setToast({ message: 'Masjid name is required', type: 'error' });
      return;
    }

    try {
      setSaving(true);
      const data = await updateSettings({
        name: name.trim(),
        about: about.trim() || null,
        address: {
          line1: addressLine1.trim() || null,
          line2: addressLine2.trim() || null,
          city: city.trim() || null,
          postcode: postcode.trim() || null,
          country: 'United Kingdom',
        },
        contact: {
          phone: phone.trim() || null,
          email: email.trim() || null,
          website: website.trim() || null,
        },
        capacity: {
          mens: mensCapacity ? parseInt(mensCapacity) : null,
          womens: womensCapacity ? parseInt(womensCapacity) : null,
        },
        services,
        facilities,
      });
      populateForm(data);
      setToast({ message: 'Masjid details saved successfully', type: 'success' });
    } catch (err) {
      console.error('Failed to save settings:', err);
      setToast({ message: 'Failed to save settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePayment = async () => {
    try {
      setSavingPayment(true);
      const data = await updatePaymentSettings({
        bankAccountName: bankAccountName.trim() || null,
        bankName: bankName.trim() || null,
        bankAccountNumber: bankAccountNumber.trim() || null,
        bankSortCode: bankSortCode.trim() || null,
      });
      populateForm(data);
      setToast({ message: 'Payment settings saved successfully', type: 'success' });
    } catch (err) {
      console.error('Failed to save payment settings:', err);
      setToast({ message: 'Failed to save payment settings', type: 'error' });
    } finally {
      setSavingPayment(false);
    }
  };

  return (
    <div className="flex flex-col gap-[24px]">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

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
        loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="border border-[#e2e8f0] rounded-[24px] p-[24px] flex flex-col gap-[24px]">
            <h2 className="font-urbanist font-semibold text-[20px] text-[#36394a]">Masjid Informations</h2>
            <div className="h-[2px] bg-[#f6f6f6] rounded-[2px]" />

            {/* Form Fields + Logo Upload */}
            <div className="flex gap-[24px]">
              <div className="flex flex-col gap-[24px] flex-1">
                <SettingInput label="Masjid Name" value={name} onChange={setName} />
                <SettingInput label="Contact Number" value={phone} onChange={setPhone} />
                <SettingInput label="Email" value={email} onChange={setEmail} />
                <SettingInput label="Website" value={website} onChange={setWebsite} />
              </div>
              <div className="flex flex-col items-center flex-1 pt-[8px]">
                <div className="w-[56px] h-[56px] mb-[24px] rounded-[16px] bg-[#89C7A1] flex items-center justify-center text-white">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <button className="flex items-center gap-[8px] mb-[12px]">
                  <UploadIcon className="text-[var(--brand)]" size={20} />
                  <span className="text-[16px] text-[var(--brand)]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                    Upload LOGO
                  </span>
                </button>
                <p className="text-[14px] text-[#666d80] text-center" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                  Upload Your Logo.
                </p>
                <p className="text-[12px] text-[#666d80] text-center mt-[4px]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                  File Format <strong className="text-[#36394a]">.jpeg, .Png</strong> Recommened Size{' '}
                  <strong className="text-[#36394a]">600x600 (1:1)</strong>
                </p>
              </div>
            </div>

            {/* About + Address */}
            <div className="flex gap-[24px]">
              <div className="flex flex-col gap-[8px] flex-1">
                <label className="font-urbanist font-semibold text-[16px] text-[#4b4b4b] tracking-[0.16px] leading-none">
                  About Masjid
                </label>
                <textarea
                  placeholder="-"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full min-h-[148px] px-[21px] py-[16px] border border-[#e2e8f0] rounded-[12px] font-urbanist text-[16px] text-[#666d80] placeholder:text-[#666d80] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent resize-none"
                />
              </div>
              <div className="flex flex-col gap-[24px] flex-1">
                <SettingInput label="Address Line 1" value={addressLine1} onChange={setAddressLine1} />
                <SettingInput label="Address Line 2" value={addressLine2} onChange={setAddressLine2} />
                <div className="flex gap-[24px]">
                  <SettingInput label="Town or City" value={city} onChange={setCity} />
                  <SettingInput label="Post Code" value={postcode} onChange={setPostcode} />
                </div>
              </div>
            </div>

            {/* Save Info */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveMasjidDetails}
                disabled={saving}
                className="h-[44px] px-[24px] bg-[var(--brand)] text-white rounded-[12px] font-urbanist font-medium text-[16px] hover:bg-[#065d29] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>

            <div className="h-[2px] bg-[#f6f6f6] rounded-[2px]" />

            {/* Service Offered */}
            <div className="flex gap-[24px]">
              <div className="flex flex-col gap-[8px] flex-1">
                <h2 className="font-urbanist font-semibold text-[20px] text-[#36394a]">Service Offered</h2>
                <p
                  className="text-[16px] text-[#666d80] leading-[1.25] max-w-[300px]"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  Select the services provided by your masjid. These will be displayed in the mobile app for community
                  awareness.
                </p>
              </div>
              <div className="flex flex-col gap-[16px] flex-1">
                <Checkbox
                  label="Marriage / Nikkah Ceremonies"
                  checked={services.marriageService}
                  onChange={(v) => setServices((s) => ({ ...s, marriageService: v }))}
                />
                <Checkbox
                  label="Hall Hire"
                  checked={services.hallRental}
                  onChange={(v) => setServices((s) => ({ ...s, hallRental: v }))}
                />
                <Checkbox
                  label="Iftar (Ramadan)"
                  checked={services.iftarProgram}
                  onChange={(v) => setServices((s) => ({ ...s, iftarProgram: v }))}
                />
                <Checkbox
                  label="Advice & Counselling"
                  checked={services.counseling}
                  onChange={(v) => setServices((s) => ({ ...s, counseling: v }))}
                />
                <Checkbox
                  label="New Muslim Support"
                  checked={services.newMuslimSupport}
                  onChange={(v) => setServices((s) => ({ ...s, newMuslimSupport: v }))}
                />
                <Checkbox
                  label="Funeral Support"
                  checked={services.funeralService}
                  onChange={(v) => setServices((s) => ({ ...s, funeralService: v }))}
                />
              </div>
            </div>

            <div className="h-[2px] bg-[#f6f6f6] rounded-[2px]" />

            {/* Facilities Available */}
            <div className="flex gap-[24px]">
              <div className="flex flex-col gap-[8px] flex-1">
                <h2 className="font-urbanist font-semibold text-[20px] text-[#36394a]">Facilities Available</h2>
                <p
                  className="text-[16px] text-[#666d80] leading-[1.25] max-w-[300px]"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  Indicate the facilities available at your masjid. These will help users understand accessibility and
                  amenities.
                </p>
              </div>
              <div className="flex flex-col gap-[16px] flex-1">
                <Checkbox
                  label="Parking"
                  checked={facilities.parking}
                  onChange={(v) => setFacilities((f) => ({ ...f, parking: v }))}
                />
                <Checkbox
                  label="Womens Area"
                  checked={facilities.womensArea}
                  onChange={(v) => setFacilities((f) => ({ ...f, womensArea: v }))}
                />
                <Checkbox
                  label="Shoe Shelves"
                  checked={facilities.shoeRacks}
                  onChange={(v) => setFacilities((f) => ({ ...f, shoeRacks: v }))}
                />
                <Checkbox
                  label="Ablutions rooms"
                  checked={facilities.wuduFacilities}
                  onChange={(v) => setFacilities((f) => ({ ...f, wuduFacilities: v }))}
                />
                <Checkbox
                  label="Washroom"
                  checked={facilities.washroom}
                  onChange={(v) => setFacilities((f) => ({ ...f, washroom: v }))}
                />
              </div>
            </div>

            <div className="h-[2px] bg-[#f6f6f6] rounded-[2px]" />

            {/* Capacity */}
            <div className="flex gap-[24px]">
              <div className="flex flex-col gap-[8px] flex-1">
                <h2 className="font-urbanist font-semibold text-[20px] text-[#36394a]">Capacity</h2>
                <p
                  className="text-[16px] text-[#666d80] leading-[1.25] max-w-[300px]"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  Provide the approximate capacity of the masjid. This helps users plan their visit, especially during
                  peak prayer times.
                </p>
              </div>
              <div className="flex flex-col gap-[16px] flex-1">
                <div className="flex flex-col gap-[6px]">
                  <span className="font-urbanist font-medium text-[14px] text-[#667085]">Men</span>
                  <input
                    type="number"
                    placeholder="00"
                    value={mensCapacity}
                    onChange={(e) => setMensCapacity(e.target.value)}
                    className="w-full h-[48px] px-[21px] py-[16px] border border-[#e2e8f0] rounded-[12px] font-urbanist text-[16px] text-[#8e8e8e] placeholder:text-[#8e8e8e] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent"
                  />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <div className="flex items-center justify-between">
                    <span className="font-urbanist font-medium text-[14px] text-[#667085]">Women&apos;s Access</span>
                    <div className="flex items-center gap-[16px]">
                      <RadioYesNo label="Yes" selected={hasWomensArea} onChange={() => setHasWomensArea(true)} />
                      <RadioYesNo label="No" selected={!hasWomensArea} onChange={() => { setHasWomensArea(false); setWomensCapacity(''); }} />
                    </div>
                  </div>
                  {hasWomensArea && (
                    <input
                      type="number"
                      placeholder="00"
                      value={womensCapacity}
                      onChange={(e) => setWomensCapacity(e.target.value)}
                      className="w-full h-[48px] px-[21px] py-[16px] border border-[#e2e8f0] rounded-[12px] font-urbanist text-[16px] text-[#8e8e8e] placeholder:text-[#8e8e8e] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Save All */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveMasjidDetails}
                disabled={saving}
                className="h-[44px] px-[24px] bg-[var(--brand)] text-white rounded-[12px] font-urbanist font-medium text-[16px] hover:bg-[#065d29] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )
      )}

      {/* Bank & Payment Settings Tab */}
      {activeTab === 'bank' && (
        loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="border border-[#e2e8f0] rounded-[24px] p-[24px] flex flex-col gap-[24px]">
            <h2 className="font-urbanist font-semibold text-[20px] text-[#36394a]">BANK &amp; PAYMENT SETTINGS</h2>
            <div className="h-[2px] bg-[#f6f6f6] rounded-[2px]" />

            {/* Stripe Connect */}
            <div className="flex gap-[24px]">
              <div className="flex flex-col gap-[8px] flex-1">
                <h3 className="font-urbanist font-semibold text-[18px] text-[#36394a]">Stripe Connect</h3>
                <p className="text-[14px] text-[#666d80] leading-[1.4] max-w-[300px]">
                  Connect your Stripe account to accept online donations. Stripe handles all card payments, Apple Pay, and Google Pay securely.
                </p>
              </div>
              <div className="flex-1">
                {stripeStatus?.connected ? (
                  <div className="flex flex-col gap-[16px]">
                    {/* Status badges */}
                    <div className="flex flex-col gap-[10px]">
                      <div className="flex items-center gap-[8px]">
                        <div className={`w-[8px] h-[8px] rounded-full ${stripeStatus.acceptingDonations ? 'bg-[var(--brand)]' : 'bg-amber-400'}`} />
                        <span className="font-urbanist text-[14px] text-[#4b4b4b]">
                          Accepting Donations: <strong>{stripeStatus.acceptingDonations ? 'Enabled' : 'Pending'}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <div className={`w-[8px] h-[8px] rounded-full ${stripeStatus.payoutsEnabled ? 'bg-[var(--brand)]' : 'bg-amber-400'}`} />
                        <span className="font-urbanist text-[14px] text-[#4b4b4b]">
                          Payouts to Bank: <strong>{stripeStatus.payoutsEnabled ? 'Enabled' : 'Pending'}</strong>
                        </span>
                      </div>
                      {!stripeStatus.onboardingComplete && (
                        <p className="text-[13px] text-amber-600 bg-amber-50 px-[12px] py-[8px] rounded-[8px]">
                          Onboarding incomplete — complete your Stripe setup to start accepting donations.
                        </p>
                      )}
                    </div>
                    {/* Actions */}
                    <div className="flex gap-[12px]">
                      {!stripeStatus.onboardingComplete && (
                        <button
                          onClick={handleConnectStripe}
                          disabled={connectingStripe}
                          className="h-[40px] px-[20px] bg-[var(--brand)] text-white rounded-[10px] font-urbanist font-medium text-[14px] hover:bg-[#065d29] transition-colors disabled:opacity-50"
                        >
                          {connectingStripe ? 'Redirecting...' : 'Complete Setup'}
                        </button>
                      )}
                      <button
                        onClick={handleDisconnectStripe}
                        disabled={disconnectingStripe}
                        className="h-[40px] px-[20px] border border-red-200 text-red-600 rounded-[10px] font-urbanist font-medium text-[14px] hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {disconnectingStripe ? 'Disconnecting...' : 'Disconnect'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-[12px]">
                    <div className="flex items-center gap-[8px]">
                      <div className="w-[8px] h-[8px] rounded-full bg-gray-300" />
                      <span className="font-urbanist text-[14px] text-[#666d80]">Not connected</span>
                    </div>
                    <button
                      onClick={handleConnectStripe}
                      disabled={connectingStripe}
                      className="w-fit h-[44px] px-[24px] bg-[var(--brand)] text-white rounded-[12px] font-urbanist font-medium text-[16px] hover:bg-[#065d29] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {connectingStripe ? 'Redirecting to Stripe...' : 'Connect Stripe Account'}
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        )
      )}
    </div>
  );
}
