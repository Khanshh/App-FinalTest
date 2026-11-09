import { parseApiUrl } from './apiUrl';

// Expo only inlines static EXPO_PUBLIC_* property access. This URL is not a secret.
export const env = {
  apiUrl: parseApiUrl(process.env.EXPO_PUBLIC_API_URL),
};
