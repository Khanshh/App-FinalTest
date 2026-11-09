import axios from 'axios';

import { env } from '@/config/env';
import type { ProblemDetails } from './apiTypes';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly kind: 'network' | 'timeout' | 'http' | 'unknown',
    public readonly status?: number,
    public readonly problem?: ProblemDetails,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function isProblemDetails(value: unknown): value is ProblemDetails {
  if (!value || typeof value !== 'object') return false;
  const data = value as Record<string, unknown>;
  return typeof data.type === 'string' && typeof data.title === 'string' &&
    typeof data.status === 'number' && typeof data.detail === 'string' &&
    typeof data.code === 'string';
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (!axios.isAxiosError(error)) {
    return new ApiError('Đã xảy ra lỗi. Vui lòng thử lại.', 'unknown');
  }
  if (error.response) {
    const problem = isProblemDetails(error.response.data) ? error.response.data : undefined;
    // Do not render arbitrary server responses (HTML, stack traces or internal errors).
    const message = error.response.status >= 500
      ? 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.'
      : problem?.detail || 'Yêu cầu chưa được thực hiện. Vui lòng thử lại.';
    return new ApiError(message, 'http', error.response.status, problem);
  }
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return new ApiError('Kết nối quá thời gian chờ. Vui lòng thử lại.', 'timeout');
  }
  return new ApiError('Không thể kết nối hệ thống. Hãy kiểm tra mạng và thử lại.', 'network');
}

export const http = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  headers: { Accept: 'application/json' },
});

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(axios.isCancel(error) ? error : normalizeApiError(error)),
);

// Authentication/refresh and endpoint functions belong to later milestones.
// No automatic request retry: mutations will need intent-specific idempotency keys.
