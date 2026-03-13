import type { ApiResponse, ApiErrorResponse } from '@/types/api';

// ============================================
// API Client — fetch-based, no extra deps
// ============================================

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || '/api/v1';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
    code: string;
    status: number;
    details?: Record<string, string>;

    constructor(status: number, code: string, message: string, details?: Record<string, string>) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

/**
 * In-memory token store (more secure than localStorage)
 */
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
    accessToken = token;
}

export function getAccessToken(): string | null {
    return accessToken;
}

/**
 * Flag to prevent multiple simultaneous refresh attempts
 */
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Attempt to refresh the access token using the HttpOnly refresh cookie
 */
async function refreshAccessToken(): Promise<string | null> {
    // If already refreshing, wait for the existing promise
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                setAccessToken(null);
                return null;
            }

            const data: ApiResponse<{ accessToken: string }> = await response.json();
            const newToken = data.data.accessToken;
            setAccessToken(newToken);
            return newToken;
        } catch {
            setAccessToken(null);
            return null;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

/**
 * Core fetch wrapper with auth, error handling, and auto-refresh
 */
async function request<T>(
    endpoint: string,
    options: RequestInit = {},
    retry = true
): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    // Attach access token if available
    const token = getAccessToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    console.log(`[API Request] ${options.method || 'GET'} ${endpoint}`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // Send HttpOnly refresh token cookie
    });

    console.log(`[API Response] ${options.method || 'GET'} ${endpoint} -> ${response.status}`);

    // Handle 401 — try refreshing the token once
    if (response.status === 401 && retry) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            // Retry the original request with the new token
            return request<T>(endpoint, options, false);
        }
        // Refresh failed — clear state, redirect will be handled by AuthContext
        setAccessToken(null);
    }

    // Parse response body
    const body = await response.json().catch(() => null);

    if (!response.ok) {
        const errorBody = body as ApiErrorResponse | null;
        throw new ApiError(
            response.status,
            errorBody?.error?.code || 'UNKNOWN_ERROR',
            errorBody?.error?.message || 'An unexpected error occurred',
            errorBody?.error?.details
        );
    }

    return body as T;
}

// ============================================
// Typed HTTP methods
// ============================================

export function get<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: 'GET' });
}

export function post<T>(endpoint: string, data?: unknown): Promise<T> {
    return request<T>(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
    });
}

export function put<T>(endpoint: string, data?: unknown): Promise<T> {
    return request<T>(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
    });
}

export function del<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: 'DELETE' });
}

// ============================================
// FormData methods (for file uploads)
// ============================================

/**
 * Executes a fetch request specifically for FormData (multipart/form-data).
 * We omit 'Content-Type' so the browser can set it with the correct boundary.
 */
async function requestFormData<T>(
    endpoint: string,
    method: 'POST' | 'PUT',
    formData: FormData,
    retry = true
): Promise<T> {
    const headers: Record<string, string> = {};

    // Attach access token if available
    const token = getAccessToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    console.log(`[API Request FormData] ${method} ${endpoint}`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        body: formData,
        headers,
        credentials: 'include',
    });

    console.log(`[API Response FormData] ${method} ${endpoint} -> ${response.status}`);

    // Handle 401 — try refreshing the token once
    if (response.status === 401 && retry) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            return requestFormData<T>(endpoint, method, formData, false);
        }
        setAccessToken(null);
    }

    const body = await response.json().catch(() => null);

    if (!response.ok) {
        const errorBody = body as ApiErrorResponse | null;
        throw new ApiError(
            response.status,
            errorBody?.error?.code || 'UNKNOWN_ERROR',
            errorBody?.error?.message || 'An unexpected error occurred',
            errorBody?.error?.details
        );
    }

    return body as T;
}

export function postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    return requestFormData<T>(endpoint, 'POST', formData);
}

export function putFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    return requestFormData<T>(endpoint, 'PUT', formData);
}

