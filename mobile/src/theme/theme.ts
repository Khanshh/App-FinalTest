import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  roundness: 4,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#176B50',
    onPrimary: '#FFFFFF',
    primaryContainer: '#D9F2E5',
    onPrimaryContainer: '#103C2D',
    secondary: '#52675C',
    secondaryContainer: '#E4EEE7',
    onSecondaryContainer: '#263D30',
    background: '#F6F8F5',
    onBackground: '#1B2821',
    surface: '#FFFFFF',
    onSurface: '#1B2821',
    surfaceVariant: '#E9EEE8',
    onSurfaceVariant: '#526159',
    outline: '#77877D',
    outlineVariant: '#D9E1D9',
  },
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
