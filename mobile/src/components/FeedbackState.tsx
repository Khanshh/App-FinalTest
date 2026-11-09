import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';

import { spacing } from '@/theme/theme';

type Props =
  | { kind: 'loading'; message?: string }
  | { kind: 'empty'; message: string }
  | { kind: 'error'; message: string; onRetry?: () => void };

export function FeedbackState(props: Props) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      {props.kind === 'loading' && <ActivityIndicator accessibilityLabel="Đang tải" />}
      <Text variant="bodyMedium">{props.message ?? 'Đang tải dữ liệu…'}</Text>
      {props.kind === 'error' && props.onRetry && (
        <Button mode="outlined" onPress={props.onRetry}>Thử lại</Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing.md, padding: spacing.md },
});
