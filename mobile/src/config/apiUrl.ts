export function parseApiUrl(value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error('Thiếu EXPO_PUBLIC_API_URL. Hãy tạo .env từ .env.example và khởi động lại Expo.');
  }

  const url = new URL(value.trim());
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username || url.password || url.search || url.hash ||
    url.pathname.replace(/\/+$/, '') !== '/api/v1'
  ) {
    throw new Error('EXPO_PUBLIC_API_URL phải là URL HTTP(S) kết thúc bằng /api/v1, không chứa thông tin đăng nhập, query hoặc fragment.');
  }

  return url.toString().replace(/\/+$/, '');
}
