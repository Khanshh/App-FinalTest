import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import '@/config/env';
import { AppProviders } from '@/providers/AppProviders';
import { theme } from '@/theme/theme';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <Stack screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.primary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}>
        <Stack.Screen name="(public)/index" options={{ title: 'Sân Cầu' }} />
        <Stack.Screen name="+not-found" options={{ title: 'Không tìm thấy' }} />
      </Stack>
    </AppProviders>
  );
}
