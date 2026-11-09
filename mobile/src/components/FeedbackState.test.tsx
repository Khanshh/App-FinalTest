import { fireEvent, render, screen } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { FeedbackState } from './FeedbackState';

it('lets the user retry after an error', () => {
  const onRetry = jest.fn();
  render(<PaperProvider><FeedbackState kind="error" message="Mất kết nối" onRetry={onRetry} /></PaperProvider>);
  expect(screen.getByText('Mất kết nối')).toBeTruthy();
  fireEvent.press(screen.getByText('Thử lại'));
  expect(onRetry).toHaveBeenCalledTimes(1);
});
