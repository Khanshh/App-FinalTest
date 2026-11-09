/** @type {import('expo/config').ExpoConfig} */
const config = {
  name: 'Sân Cầu',
  slug: 'badminton-mobile',
  version: '0.1.0',
  scheme: 'sancau',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  platforms: ['android'],
  android: {
    package: 'com.example.badminton.mobile',
  },
  plugins: [
    'expo-router',
    'expo-status-bar',
    'expo-font',
    ['expo-build-properties', {
      android: {
        // Local development uses HTTP; switch to HTTPS for deployment and rebuild.
        usesCleartextTraffic: process.env.EXPO_PUBLIC_API_URL?.startsWith('http://') ?? false,
      },
    }],
  ],
};

module.exports = config;
