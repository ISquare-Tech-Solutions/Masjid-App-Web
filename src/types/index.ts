// Prayer Types
export interface PrayerTime {
  name: string;
  time: string;
  athanTime: string;
  isActive?: boolean;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  speaker?: string;
  date: string; // Backend returns ISO-8601 string (e.g., "2025-02-15T18:00:00")
  link?: string;
  images?: string[];
  description: string;
  venue: string; // Backend uses 'venue', UI sometimes mapped it to 'location'
  status: 'draft' | 'published' | 'cancelled' | 'completed' | 'sent' | 'past'; // Extended to include Figma UI statuses + Backend statuses
  notificationSent?: boolean;
  notificationSentAt?: string;
  createdBy?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  
  // UI Specific helper fields (not always from backend)
  category?: string; 
  startTime?: string;
  endTime?: string;
  location?: string; // Legacy UI mapping
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  message: string; // Backend uses 'message'
  scheduledAt?: string; // ISO-8601 string
  status: 'draft' | 'scheduled' | 'sent';
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  
  // UI Specific helper fields
  description?: string; // Legacy UI mapping
  date?: string;
  time?: string;
}

// Campaign Types
export interface Campaign {
  id: string;
  title: string;
  category: string;
  goal: number;
  raised: number;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'super_admin';
}

// Login Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}
