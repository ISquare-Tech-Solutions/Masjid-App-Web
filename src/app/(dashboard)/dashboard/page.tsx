'use client';

import { useState, useEffect, useCallback } from 'react';
import DateHeader from '@/components/dashboard/DateHeader';
import PrayerTimeCard from '@/components/dashboard/PrayerTimeCard';
import JummahCard from '@/components/dashboard/JummahCard';
import QuickActionButton from '@/components/dashboard/QuickActionButton';
import EventCard from '@/components/dashboard/EventCard';
import CampaignCard from '@/components/dashboard/CampaignCard';
import Skeleton from '@/components/ui/Skeleton';
import type { PrayerTime, Event, Campaign } from '@/types';
import { getPrayerTimes } from '@/lib/api/prayer-times';
import type { PrayerTimeResponse, PrayersData, JumuahTimeEntry } from '@/types/prayer-times';

// Helper to format date key YYYY-MM-DD
const formatDateKey = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Helper to format time for display (12h)
function formatTime12h(time24: string | undefined): string {
  if (!time24) return '—';
  const [hoursStr, minutesStr] = time24.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${ampm}`;
}

// ... (Events and Campaigns constants remain unchanged) ...
const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Friday Community Gathering',
    category: 'Community Event',
    description:
      'A casual community meet-up after Isha Prayer to discuss upcoming activities and strength our bonds as a community...',
    speaker: 'Ustadh Sultan Ahmed',
    venue: 'Masjid Abu Bakar',
    date: '17 Oct 2025',
    startTime: '07:00 PM',
    endTime: '08:30 PM',
    status: 'sent',
  },
  {
    id: '2',
    title: 'Friday Community Gathering',
    category: 'Community Event',
    description:
      'A casual community meet-up after Isha Prayer to discuss upcoming activities and strength our bonds as a community...',
    speaker: 'Ustadh Sultan Ahmed',
    venue: 'Masjid Abu Bakar',
    date: '17 Oct 2025',
    startTime: '07:00 PM',
    endTime: '08:30 PM',
    status: 'sent',
  },
];

const activeCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Help Build New Wudu Area',
    category: 'Masjid Development',
    goalAmount: 15000,
    raisedAmount: 10500,
    startDate: '2025-01-01',
    endDate: '05 Dec 2025',
    status: 'active',
  },
  {
    id: '2',
    title: 'Sponsor a student for Education',
    category: "Education & dawa'h",
    goalAmount: 15000,
    raisedAmount: 10500,
    startDate: '2025-01-01',
    endDate: '05 Dec 2025',
    status: 'active',
  },
  {
    id: '3',
    title: 'Emergency Support for brother Yusuf',
    category: 'Help a Brother or Sister',
    goalAmount: 15000,
    raisedAmount: 10500,
    startDate: '2025-01-01',
    endDate: '05 Dec 2025',
    status: 'active',
  },
];

const PRAYER_NAMES: (keyof PrayersData)[] = ['fajr', 'sunrise', 'zuhr', 'asr', 'maghrib', 'isha'];
const PRAYER_LABELS: Record<string, string> = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  zuhr: 'Zuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [prayerData, setPrayerData] = useState<PrayerTimeResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Track month/year for fetching
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Fetch prayer times when month/year changes
  const fetchPrayerTimes = useCallback(async () => {
    setLoading(true);
    try {
      const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
      const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      const result = await getPrayerTimes({ startDate, endDate, size: 31 });
      setPrayerData(result.content);
    } catch (error) {
      console.error('Failed to fetch prayer times', error);
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentYear]);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  // Handle Date Navigation
  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);

    // Sync fetch if month changes
    if (newDate.getMonth() !== currentMonth || newDate.getFullYear() !== currentYear) {
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    }
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);

    // Sync fetch if month changes
    if (newDate.getMonth() !== currentMonth || newDate.getFullYear() !== currentYear) {
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    }
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setSelectedDate(now);
    if (now.getMonth() !== currentMonth || now.getFullYear() !== currentYear) {
      setCurrentMonth(now.getMonth());
      setCurrentYear(now.getFullYear());
    }
  };

  // Get data for selected date
  const selectedDateKey = formatDateKey(selectedDate);
  const daysPrayerData = prayerData.find(p => p.date === selectedDateKey);

  /* ── determine active prayer ── */
  const getActivePrayer = (): keyof PrayersData | null => {
    if (!daysPrayerData) return null;
    const now = new Date();
    // Only highlight if selected date is today
    const isToday = selectedDate.toDateString() === now.toDateString();
    if (!isToday) return null;

    const currentMin = now.getHours() * 60 + now.getMinutes();
    const order: (keyof PrayersData)[] = ['fajr', 'sunrise', 'zuhr', 'asr', 'maghrib', 'isha'];
    let active: keyof PrayersData | null = null;
    for (const p of order) {
      const t = daysPrayerData.prayers[p]?.jamah || daysPrayerData.prayers[p]?.athan;
      if (t) {
        const [h, m] = t.split(':').map(Number);
        if (currentMin >= h * 60 + m) active = p;
      }
    }
    return active;
  };
  const activePrayer = getActivePrayer();

  // Format data for PrayerTimeCard
  const displayPrayerTimes: PrayerTime[] = PRAYER_NAMES.map(name => {
    const p = daysPrayerData?.prayers[name];
    const time = p?.jamah || p?.athan || '—';
    const athanTime = p?.athan ? formatTime12h(p.athan) : '—';

    // Determine active status
    const isActive = activePrayer === name;

    return {
      name: PRAYER_LABELS[name],
      time: formatTime12h(time),
      athanTime: name === 'sunrise' ? '' : athanTime, // Sunrise doesn't have athan label usually in UI
      isActive: isActive
    };
  });

  return (
    <div className="flex flex-col gap-[24px]">
      {/* ── Date Section ── */}
      <div className="flex flex-col gap-[16px] items-center bg-[rgba(7,119,52,0.05)] p-[24px] rounded-[16px] w-full">
        <DateHeader
          gregorianDate={selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          islamicDate={daysPrayerData?.hijriDate || '—'}
          isToday={selectedDate.toDateString() === new Date().toDateString()}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
          onJumpToToday={handleJumpToToday}
        />

        {/* ─── Prayer Time Cards ─── */}
        <div className="flex gap-[30px] items-stretch w-full overflow-x-auto scrollbar-hide">
          {loading ? (
            /* SKELETON LOADING STATE */
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-1 flex-col items-center justify-center gap-[6px] p-[24px] rounded-[12px] bg-white min-w-[160px] h-[127px]">
                <Skeleton className="h-5 w-16" />
                <div className="flex items-end gap-[2px]">
                  <Skeleton className="h-8 w-14" />
                  <Skeleton className="h-5 w-8" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))
          ) : daysPrayerData ? (
            displayPrayerTimes.map((prayer) => {
              // On Fridays, replace Zuhr with the JummahCard
              const isFriday = selectedDate.getDay() === 5;
              const hasJumuah = isFriday && daysPrayerData.jumuahTimes && daysPrayerData.jumuahTimes.length > 0;
              if (prayer.name === 'Zuhr' && hasJumuah) {
                return (
                  <JummahCard
                    key="jummah"
                    jumuahTimes={daysPrayerData.jumuahTimes as JumuahTimeEntry[]}
                    athanTime={daysPrayerData.prayers.zuhr?.athan}
                  />
                );
              }
              return <PrayerTimeCard key={prayer.name} prayer={prayer} />;
            })
          ) : (
            <p className="text-gray-500 py-10 w-full text-center">No prayer times found for this date.</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-[18px]">
        <QuickActionButton label="Add Event" onClick={() => console.log('Add Event')} />
        <QuickActionButton
          label="Add Announcement"
          onClick={() => console.log('Add Announcement')}
        />
        <QuickActionButton label="Create Campaign" onClick={() => console.log('Create Campaign')} />
        <QuickActionButton
          label="Update Prayer Timings"
          onClick={() => console.log('Update Prayer Timings')}
        />
      </div>

      {/* Upcoming Events Section */}
      <section>
        <h2 className="font-inter font-semibold text-[20px] text-[var(--grey-800)] mb-[16px]">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Active Campaigns Section */}
      <section>
        <h2 className="font-inter font-semibold text-[20px] text-[var(--grey-800)] mb-[16px]">
          Active Campaigns
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
          {activeCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </section>
    </div>
  );
}
