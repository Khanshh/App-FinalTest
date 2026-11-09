import { Link } from 'expo-router';
import { Button, Text } from 'react-native-paper';

import { Screen } from '@/components/Screen';

export default function NotFoundScreen() {
  return (
    <Screen>
      <Text variant="headlineSmall">Không tìm thấy màn hình</Text>
      <Text>Đường dẫn này không có trong ứng dụng.</Text>
      <Link href="/" replace asChild><Button mode="contained">Về trang chủ</Button></Link>
    </Screen>
  );
}
