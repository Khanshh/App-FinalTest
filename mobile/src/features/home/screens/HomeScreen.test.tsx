import { render, screen } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HomeScreen } from './HomeScreen';

jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock'));

it('shows an honest empty Home without requiring a backend', () => {
  render(
    <SafeAreaProvider>
      <PaperProvider><HomeScreen /></PaperProvider>
    </SafeAreaProvider>,
  );
  expect(screen.getByText('Chưa có dữ liệu sân')).toBeTruthy();
  expect(screen.getByText('Đây là giao diện mẫu đầu tiên của ứng dụng.')).toBeTruthy();
  expect(screen.queryByText('Đặt sân')).toBeNull();
});
