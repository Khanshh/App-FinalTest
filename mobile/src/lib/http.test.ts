import axios, { AxiosError, AxiosHeaders } from 'axios';

import { http, normalizeApiError } from './http';

describe('shared HTTP client', () => {
  it('preserves status, validation fields and request ID from Problem Details', async () => {
    const problem = {
      type: 'about:blank', title: 'Bad Request', status: 400,
      detail: 'Dữ liệu không hợp lệ.', code: 'VALIDATION_ERROR', requestId: 'request-1',
      fieldErrors: [{ field: 'name', code: 'NotBlank', message: 'Không được bỏ trống.' }],
    };
    await expect(http.get('/example', {
      adapter: async (config) => {
        expect(http.getUri(config)).toBe('http://10.0.2.2:8080/api/v1/example');
        throw new AxiosError('Bad request', 'ERR_BAD_REQUEST', config, undefined, {
          data: problem, status: 400, statusText: 'Bad Request', headers: new AxiosHeaders(), config,
        });
      },
    })).rejects.toMatchObject({ kind: 'http', status: 400, problem });
  });

  it('distinguishes network failure from timeout', () => {
    expect(normalizeApiError(new AxiosError('Network Error', 'ERR_NETWORK')).kind).toBe('network');
    expect(normalizeApiError(new AxiosError('Timeout', 'ECONNABORTED')).kind).toBe('timeout');
  });

  it('does not expose arbitrary server response bodies', async () => {
    await expect(http.get('/example', {
      adapter: async (config) => {
        throw new AxiosError('Internal failure', 'ERR_BAD_RESPONSE', config, undefined, {
          data: '<html>private stack trace</html>', status: 500, statusText: 'Server Error', headers: new AxiosHeaders(), config,
        });
      },
    })).rejects.toMatchObject({ message: 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.', status: 500 });
  });

  it('keeps cancellation recognizable to consumers', async () => {
    const error = await http.get('/example', {
      adapter: async () => { throw new axios.CanceledError(); },
    }).catch((reason: unknown) => reason);
    expect(axios.isCancel(error)).toBe(true);
  });
});
