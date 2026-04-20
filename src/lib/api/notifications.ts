import { get } from './client';
import type { ApiResponse } from '@/types/api';

// ============================================
// Notification Types
// ============================================

export type NotificationType =
  | 'event_published'
  | 'event_cancelled'
  | 'announcement_published'
  | 'campaign_created'
  | 'campaign_payment'
  | 'campaign_goal_reached'
  | 'campaign_nearing_goal'
  | 'campaign_ended'
  | 'campaign_expired'
  | 'prayer_update'
  | 'system_update'
  | string;

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ============================================
// Notification API
// ============================================

export async function getNotifications(): Promise<Notification[]> {
  const res = await get<ApiResponse<Notification[]>>('/notifications');
  return res.data;
}
