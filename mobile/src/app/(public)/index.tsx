import Feather from '@expo/vector-icons/Feather';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const titleSize = Math.min(42, (width - 64) / 7.8);

  return (
    <ImageBackground
      source={require('../../../assets/onboarding-hero.jpg')}
      resizeMode="cover"
      style={styles.screen}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.scrim]} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.layout,
          {
            paddingTop: Math.max(insets.top + 16, 76),
            paddingBottom: Math.max(insets.bottom + 24, height * 0.15),
            paddingLeft: Math.max(insets.left, 32),
            paddingRight: Math.max(insets.right, 32),
          },
        ]}
      >
        <View style={styles.brand}>
          <View style={styles.mark}>
            <Feather name="feather" size={16} color="#0C1311" />
          </View>
          <Text style={styles.wordmark}>SHUTTLE</Text>
        </View>

        <View style={styles.spacer} />

        <View style={styles.content}>
          <View style={styles.badge}>
            <View style={styles.dot} />
            <Text style={styles.badgeText}>240+ sân tại TP.HCM</Text>
          </View>
          <Text
            accessibilityRole="header"
            style={[styles.title, { fontSize: titleSize, lineHeight: titleSize + 3 }]}
          >
            Chơi cầu lông,{'\n'}không chờ đợi.
          </Text>
          <Text style={styles.description}>
            Xem lịch trống, đặt sân theo giờ và quản lý lịch đặt ngay trong ứng dụng.
          </Text>
          {/* Chưa có màn đăng nhập: nút chưa gắn hành động. */}
          <Button
            mode="contained"
            buttonColor="#FFFFFF"
            textColor="#0C1311"
            icon={({ color }) => <Feather name="arrow-right" size={17} color={color} />}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            style={styles.button}
          >
            Bắt đầu ngay
          </Button>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0C1311' },
  scrim: {
    backgroundImage: 'linear-gradient(180deg, #0C131100 0%, #0C131155 40%, #0C1311F2 78%)',
  },
  layout: { flexGrow: 1 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  mark: {
    width: 28, height: 28, borderRadius: 9, backgroundColor: '#D7F26B',
    alignItems: 'center', justifyContent: 'center',
  },
  wordmark: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', letterSpacing: 3 },
  spacer: { flexGrow: 1, minHeight: 64 },
  content: { gap: 18 },
  badge: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: '#FFFFFF33', borderRadius: 100,
    paddingVertical: 6, paddingHorizontal: 11,
  },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#D7F26B' },
  badgeText: { color: '#E8EFEB', fontSize: 11, fontWeight: '500', letterSpacing: 0.3 },
  title: { color: '#FFFFFF', fontWeight: '600', letterSpacing: -1.4 },
  description: { color: '#A9B6B1', fontSize: 14, lineHeight: 22, maxWidth: 300 },
  button: { marginTop: 8, borderRadius: 14 },
  buttonContent: { minHeight: 52, flexDirection: 'row-reverse' },
  buttonLabel: { fontSize: 15, fontWeight: '600', letterSpacing: -0.1 },
});
