import { get, post, put, patch, del } from './client';
import type { Campaign, Donation } from '@/types';
import type { ApiResponse } from '@/types/api';
import type { PaginatedResponse } from './events';

export interface GetCampaignsParams {
    page?: number;
    size?: number;
}

export interface CreateCampaignData {
    title: string;
    description?: string;
    category?: string;
    goalAmount: number;
    startDate: string; // ISO date string: YYYY-MM-DD
    endDate?: string;  // ISO date string: YYYY-MM-DD
    status?: 'draft' | 'active';
}

export interface UpdateCampaignData {
    title: string;
    description?: string;
    category?: string;
    goalAmount: number;
    startDate: string;
    endDate?: string;
    status?: Campaign['status'];
}

export interface UpdateCampaignStatusData {
    status: Campaign['status'];
}

export async function getCampaigns(params?: GetCampaignsParams): Promise<PaginatedResponse<Campaign>> {
    const queryParams = new URLSearchParams();

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value.toString());
            }
        });
    }

    const qs = queryParams.toString();
    const endpoint = `/admin/campaigns${qs ? `?${qs}` : ''}`;

    const response = await get<ApiResponse<PaginatedResponse<Campaign>>>(endpoint);
    return response.data;
}

export async function getCampaignById(id: string): Promise<Campaign> {
    const response = await get<ApiResponse<Campaign>>(`/admin/campaigns/${id}`);
    return response.data;
}

export async function createCampaign(data: CreateCampaignData): Promise<Campaign> {
    const response = await post<ApiResponse<Campaign>>('/admin/campaigns', data);
    return response.data;
}

export async function updateCampaign(id: string, data: UpdateCampaignData): Promise<Campaign> {
    const response = await put<ApiResponse<Campaign>>(`/admin/campaigns/${id}`, data);
    return response.data;
}

export async function updateCampaignStatus(id: string, status: Campaign['status']): Promise<Campaign> {
    const response = await patch<ApiResponse<Campaign>>(`/admin/campaigns/${id}/status`, { status });
    return response.data;
}

export async function deleteCampaign(id: string): Promise<void> {
    await del<ApiResponse<void>>(`/admin/campaigns/${id}`);
}

export interface CampaignStats {
    activeCampaigns: number;
    totalDonors: number;
    raisedThisMonth: number;
    totalRaised: number;
}

export async function getCampaignStats(): Promise<CampaignStats> {
    const response = await get<ApiResponse<CampaignStats>>('/admin/campaigns/stats');
    return response.data;
}

export async function getCampaignDonations(id: string, params?: { page?: number; size?: number }): Promise<PaginatedResponse<Donation>> {
    const queryParams = new URLSearchParams();

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString());
            }
        });
    }

    const qs = queryParams.toString();
    const endpoint = `/admin/campaigns/${id}/donations${qs ? `?${qs}` : ''}`;

    const response = await get<ApiResponse<PaginatedResponse<Donation>>>(endpoint);
    return response.data;
}
