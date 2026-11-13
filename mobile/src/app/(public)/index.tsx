import Feather from '@expo/vector-icons/Feather';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ImageBackground, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView,
  StyleSheet, TextInput, useWindowDimensions, View,
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const { screen, email = '' } = useLocalSearchParams<{ screen?: string; email?: string }>();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const titleSize = Math.min(42, (width - 64) / 7.8);

  if (screen === 'login') return <LoginScreen />;
  if (screen === 'otp') return <OtpScreen email={email} />;

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
          <Button
            onPress={() => router.push({ pathname: '/', params: { screen: 'login' } })}
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

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  function openOtp() {
    const address = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setEmailError(true);
      return;
    }
    Keyboard.dismiss();
    router.push({ pathname: '/', params: { screen: 'otp', email: address } });
  }

  return (
    <AuthScreen
      backLabel="Quay lại màn chào"
      onBack={() => router.canGoBack() ? router.back() : router.replace('/')}
    >
      <View style={styles.loginGroup}>
        <Text accessibilityRole="header" style={styles.loginTitle}>Đăng nhập bằng email</Text>
        <Text style={styles.loginDescription}>
          Nhập email đã đăng ký để nhận mã xác thực.
        </Text>
      </View>

      <View style={styles.loginGroup}>
        <Text style={styles.emailLabel}>Email</Text>
        <TextInput
          accessibilityLabel="Email"
          value={email}
          onChangeText={(value) => { setEmail(value); setEmailError(false); }}
          onSubmitEditing={openOtp}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="done"
          selectionColor="#0E7A5A"
          style={styles.emailInput}
        />
        {emailError && (
          <Text accessibilityRole="alert" style={styles.inputError}>Vui lòng nhập email hợp lệ.</Text>
        )}
      </View>

      <Button
        onPress={openOtp}
        mode="contained"
        buttonColor="#0E7A5A"
        textColor="#FFFFFF"
        icon={({ color }) => <Feather name="arrow-right" size={17} color={color} />}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        style={styles.loginButton}
      >
        Nhận mã xác thực
      </Button>

      <Pressable accessibilityRole="button" style={styles.guestRow}>
        <View style={styles.guestIcon}>
          <Feather name="user" size={18} color="#6D7A75" />
        </View>
        <View style={styles.guestText}>
          <Text style={styles.guestTitle}>Dùng thử với tư cách khách</Text>
          <Text style={styles.guestDescription}>Xem sân & bảng giá, cần đăng nhập khi đặt</Text>
        </View>
        <Feather name="chevron-right" size={16} color="#9DA9A4" />
      </Pressable>

      <View style={styles.flex} />
      <Text style={styles.terms}>
        Bằng việc tiếp tục, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của Shuttle.
      </Text>
    </AuthScreen>
  );
}

function OtpScreen({ email }: { email: string }) {
  const [code, setCode] = useState('');
  const [focused, setFocused] = useState(false);
  const [seconds, setSeconds] = useState(42);

  useEffect(() => {
    const deadline = Date.now() + 42_000;
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSeconds(remaining);
      if (!remaining) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function backToLogin() {
    Keyboard.dismiss();
    if (router.canGoBack()) router.back();
    else router.replace({ pathname: '/', params: { screen: 'login' } });
  }

  return (
    <AuthScreen backLabel="Quay lại đăng nhập" onBack={backToLogin}>
      <View style={styles.loginGroup}>
        <Text accessibilityRole="header" style={styles.loginTitle}>Xác thực OTP</Text>
        <Text style={styles.otpDescription}>Nhập mã 6 số để xác thực email {email}.</Text>
      </View>

      <View style={styles.otpRow}>
        {Array.from({ length: 6 }, (_, index) => (
          <View
            key={index}
            accessible={false}
            style={[styles.otpCell, focused && index === Math.min(code.length, 5) && styles.otpCellFocused]}
          >
            <Text accessible={false} style={styles.otpDigit}>{code[index] ?? ''}</Text>
          </View>
        ))}
        {/* Một ô nhập cho cả 6 số để hỗ trợ dán mã, tự điền và xóa bằng bàn phím. */}
        <TextInput
          accessibilityLabel="Mã OTP gồm 6 chữ số"
          value={code}
          onChangeText={(value) => setCode(value.replace(/\D/g, '').slice(0, 6))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType="number-pad"
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          autoCorrect={false}
          caretHidden
          selectionColor="transparent"
          style={[StyleSheet.absoluteFill, styles.otpInput]}
        />
      </View>

      <View style={styles.resendRow}>
        {seconds > 0 ? (
          <Text style={styles.resendText}>Gửi lại mã sau 00:{String(seconds).padStart(2, '0')}</Text>
        ) : (
          <Pressable accessibilityRole="button" style={styles.textAction}>
            <Text style={styles.actionLabel}>Gửi lại mã</Text>
          </Pressable>
        )}
        <Pressable accessibilityRole="button" onPress={backToLogin} style={styles.textAction}>
          <Text style={styles.actionLabel}>Đổi email</Text>
        </Pressable>
      </View>

      {/* Chưa có API xác thực hoặc màn tiếp theo: xác nhận và gửi lại chưa gắn hành động. */}
      <Button
        mode="contained"
        buttonColor="#0E7A5A"
        textColor="#FFFFFF"
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        style={styles.loginButton}
      >
        Xác nhận
      </Button>

      <View style={styles.otpSpacer} />
      <View style={styles.otpHint}>
        <Feather name="shield" size={16} color="#0E7A5A" />
        <Text style={styles.otpHintText}>Không chia sẻ mã xác thực với bất kỳ ai để bảo vệ tài khoản của bạn.</Text>
      </View>
    </AuthScreen>
  );
}

function AuthScreen({ children, backLabel, onBack }: PropsWithChildren<{
  backLabel: string;
  onBack: () => void;
}>) {
  return (
    <SafeAreaView style={styles.loginScreen}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.loginContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={backLabel}
            hitSlop={4}
            onPress={onBack}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={18} color="#0E1613" />
          </Pressable>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputError: { color: '#B4462F', fontSize: 12, lineHeight: 16 },
  otpDescription: { color: '#6D7A75', fontSize: 12, lineHeight: 17 },
  otpRow: { flexDirection: 'row', gap: 8 },
  otpCell: {
    flex: 1, height: 58, borderRadius: 12, backgroundColor: '#F5F7F6',
    borderWidth: 1.5, borderColor: '#E7EBE9', alignItems: 'center', justifyContent: 'center',
  },
  otpCellFocused: { borderColor: '#0E7A5A' },
  otpDigit: { color: '#0E1613', fontSize: 20, fontWeight: '600' },
  otpInput: { color: 'transparent', backgroundColor: 'transparent', fontSize: 1, opacity: 0.01 },
  resendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  resendText: { color: '#6D7A75', fontSize: 12.5, flexShrink: 1 },
  textAction: { minHeight: 44, justifyContent: 'center' },
  actionLabel: { color: '#0E7A5A', fontSize: 12.5, fontWeight: '600' },
  otpSpacer: { height: 200 },
  otpHint: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 14, backgroundColor: '#EDF6F1' },
  otpHintText: { flex: 1, color: '#0E7A5A', fontSize: 11.5, lineHeight: 17 },
  flex: { flex: 1 },
  loginScreen: { flex: 1, backgroundColor: '#FFFFFF' },
  loginContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 10, paddingBottom: 26, gap: 22 },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F7F6',
    alignItems: 'center', justifyContent: 'center',
  },
  loginGroup: { gap: 8 },
  loginTitle: { color: '#0E1613', fontSize: 30, fontWeight: '600', letterSpacing: -1 },
  loginDescription: { color: '#6D7A75', fontSize: 14, lineHeight: 22 },
  emailLabel: { color: '#6D7A75', fontSize: 12, fontWeight: '500' },
  emailInput: {
    minHeight: 56, borderRadius: 14, backgroundColor: '#F5F7F6',
    paddingHorizontal: 16, paddingVertical: 12, color: '#0E1613', fontSize: 16,
  },
  loginButton: { borderRadius: 14 },
  guestRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14,
    paddingHorizontal: 16, borderRadius: 16, backgroundColor: '#F5F7F6',
  },
  guestIcon: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  guestText: { flex: 1, gap: 3 },
  guestTitle: { color: '#0E1613', fontSize: 14, fontWeight: '600' },
  guestDescription: { color: '#6D7A75', fontSize: 11.5, lineHeight: 17 },
  terms: { color: '#9DA9A4', fontSize: 11, lineHeight: 18, textAlign: 'center' },
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
