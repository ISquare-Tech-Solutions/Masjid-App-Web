import { get, post } from './client';
import type { ApiResponse } from '@/types/api';
import type {
    MasjidSettingsResponse,
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
