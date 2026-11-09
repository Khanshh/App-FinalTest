import { parseApiUrl } from './apiUrl';

describe('API URL configuration', () => {
  it('normalizes the API base path', () => {
    expect(parseApiUrl(' http://10.0.2.2:8080/api/v1/ ')).toBe('http://10.0.2.2:8080/api/v1');
  });

  it.each([undefined, '', 'ftp://host/api/v1', 'https://host', 'https://host/api/v1?token=x', 'https://user:password@host/api/v1'])('rejects invalid configuration %s', (value) => {
    expect(() => parseApiUrl(value)).toThrow();
  });
});
