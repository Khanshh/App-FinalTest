import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { Screen } from '@/components/Screen';
import { spacing, theme } from '@/theme/theme';

export function HomeScreen() {
  return (
    <Screen>
      <View style={styles.intro}>
        <Text variant="labelLarge" style={styles.eyebrow}>HẸN NHAU TRÊN SÂN</Text>
        <Text variant="headlineLarge" style={styles.title}>Một trận cầu,{'\n'}thêm niềm vui.</Text>
        <Text variant="bodyLarge" style={styles.secondary}>Không gian dành cho những buổi chơi cầu lông của bạn.</Text>
      </View>

      <View style={styles.court} accessibilityLabel="Hình minh họa sân cầu lông" accessible>
        <View style={styles.courtOutline}>
          <View style={styles.centerLine} />
          <View style={styles.net} />
          <View style={[styles.serviceLine, styles.serviceLeft]} />
          <View style={[styles.serviceLine, styles.serviceRight]} />
        </View>
      </View>

      <View style={styles.intro}>
        <Text variant="titleLarge">Chào mừng đến với Sân Cầu</Text>
        <Text variant="bodyMedium" style={styles.secondary}>Đây là giao diện mẫu đầu tiên của ứng dụng.</Text>
      </View>
      <Card mode="outlined" style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text variant="titleMedium">Chưa có dữ liệu sân</Text>
          <Text variant="bodyMedium" style={styles.secondary}>
            Danh sách cơ sở và lịch đặt sẽ xuất hiện khi ứng dụng được kết nối với hệ thống.
          </Text>
        </Card.Content>
      </Card>
      <Text variant="labelMedium" style={styles.footer}>Cùng chơi thể thao, cùng kết nối.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm },
  eyebrow: { color: theme.colors.primary, letterSpacing: 1.4 },
  title: { fontWeight: '700', color: theme.colors.onBackground },
  secondary: { color: theme.colors.onSurfaceVariant },
  court: { backgroundColor: theme.colors.primary, borderRadius: 24, padding: spacing.lg, aspectRatio: 1.75 },
  courtOutline: { flex: 1, borderWidth: 2, borderColor: '#D9F2E5' },
  centerLine: { position: 'absolute', top: '50%', left: 0, right: 0, borderTopWidth: 1, borderColor: '#D9F2E5' },
  net: { position: 'absolute', top: -8, bottom: -8, left: '50%', borderLeftWidth: 2, borderColor: '#FFFFFF', borderStyle: 'dashed' },
  serviceLine: { position: 'absolute', top: 0, bottom: 0, borderLeftWidth: 1, borderColor: '#D9F2E5' },
  serviceLeft: { left: '30%' },
  serviceRight: { right: '30%' },
  card: { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant },
  cardContent: { gap: spacing.sm },
  footer: { textAlign: 'center', color: theme.colors.onSurfaceVariant },
});
