import { get, post, del } from './client';
import type { ApiResponse } from '@/types/api';
import type {
    MasjidSettingsResponse,
    StripeStatus,
    UpdateMasjidSettingsRequest,
    UpdatePaymentSettingsRequest,
} from '@/types/settings';

export async function getSettings(): Promise<MasjidSettingsResponse> {
    const response = await get<ApiResponse<MasjidSettingsResponse>>('/admin/settings');
    return response.data;
}

export async function updateSettings(data: UpdateMasjidSettingsRequest): Promise<MasjidSettingsResponse> {
    const response = await post<ApiResponse<MasjidSettingsResponse>>('/admin/settings', data);
    return response.data;
}

export async function updatePaymentSettings(data: UpdatePaymentSettingsRequest): Promise<MasjidSettingsResponse> {
    const response = await post<ApiResponse<MasjidSettingsResponse>>('/admin/settings/payment', data);
    return response.data;
}

export async function connectStripe(): Promise<string> {
    const response = await get<ApiResponse<{ oauthUrl: string }>>('/admin/settings/stripe/connect');
    return response.data.oauthUrl;
}

export async function getStripeStatus(): Promise<StripeStatus> {
    const response = await get<ApiResponse<StripeStatus>>('/admin/settings/stripe/status');
    return response.data;
}

export async function disconnectStripe(): Promise<void> {
    await del<ApiResponse<unknown>>('/admin/settings/stripe/disconnect');
}
