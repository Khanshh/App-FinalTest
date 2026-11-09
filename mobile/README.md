# Frontend Sân Cầu

Khung ứng dụng Android, chưa triển khai nghiệp vụ hoặc kết nối backend. Home có giao diện mẫu, không chứa cơ sở, giá hoặc đơn đặt giả.

## Cài đặt

Dùng Node **22.22.1** (xem `.nvmrc`), npm và Android Studio. Dependencies được khóa trong `package-lock.json`; không nâng riêng React/React Native khỏi bộ Expo SDK 58.

Khuyến nghị chạy Node, Android SDK và Emulator cùng phía **Windows**. Trong PowerShell tại thư mục dự án:

```powershell
cd mobile
npm ci
Copy-Item .env.example .env
```

Chỉ copy `.env` khi chưa có file cấu hình riêng. Bash dùng `cp .env.example .env`. Không dùng chung `node_modules` giữa Windows và WSL: nếu chuyển môi trường, chạy lại `npm ci` ở phía sẽ chạy Metro. Workspace hiện nằm trong OneDrive; nếu watcher bị chậm/khóa file, có thể tự chọn một checkout ngoài thư mục đồng bộ.

## Chạy Android Emulator

1. Android Studio → Device Manager → mở AVD (ví dụ Pixel_6).
2. Kiểm tra `adb devices` hiển thị máy ảo ở trạng thái `device`.
3. Thử nhanh với Expo Go hỗ trợ SDK 58:

```powershell
npx expo start --go --android
```

Nếu Expo Go trên thiết bị không hỗ trợ SDK này, dùng development build. Cài Android SDK/toolchain theo [hướng dẫn Expo](https://docs.expo.dev/workflow/android-studio-emulator/), đặt `ANDROID_HOME` và thêm `platform-tools` vào PATH, sau đó:

```powershell
npm run android:build
```

Lệnh này sinh `android/`, build/cài bản debug và mở Metro. Sau lần build đầu, dùng `npm run android`. Không cần backend để xem Home. `android/` và `ios/` được ignore vì sinh từ Expo config; chỉnh cấu hình ở `app.config.js`, không sửa native file sinh tự động. Thay native dependency/plugin thì build lại.

Development build cần Metro; `npm run export:android` chỉ kiểm tra bundle JavaScript, **không tạo APK**. APK độc lập chưa thuộc kết quả đã nghiệm thu của bước này.

## Cấu hình môi trường và HTTP

`.env.example` cung cấp:

```dotenv
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080/api/v1
```

- `10.0.2.2` dành cho Android Emulator truy cập máy host; `localhost` bên Emulator là thiết bị ảo.
- Điện thoại thật dùng IP LAN của máy backend. Backend trong WSL/container cần kiểm tra forwarding/firewall.
- URL phải có `/api/v1`, không chứa credentials/query/fragment; thiếu/sai cấu hình sẽ báo lỗi sớm.
- `EXPO_PUBLIC_*` được đóng gói vào app, không chứa secret. Khi đổi URL, khởi động lại Metro (`npx expo start --clear`).
- HTTP được cho phép trong native build khi URL cấu hình bắt đầu bằng `http://`; khi triển khai dùng HTTPS và build lại.
- Axios có timeout 15 giây, phân biệt network/timeout/HTTP, giữ Problem Details. Chưa có endpoint nghiệp vụ, bearer token hoặc refresh/retry tự động.

## Cấu trúc

```text
src/
  app/                 Expo Router: root Stack, Home công khai, not-found
  features/home/       Màn hình Home và component test
  components/          Screen, trạng thái tải/rỗng/lỗi dùng chung
  providers/           SafeArea, Paper, Query và lifecycle foreground
  config/              Đọc/kiểm tra biến môi trường
  lib/                 Axios, lỗi API, kiểu phân trang, QueryClient
  theme/               Màu Material 3 và spacing
```

Chưa tạo các feature/group auth, customer, owner, admin hoặc assets rỗng. Bổ sung khi triển khai task tương ứng. Hình sân trên Home dùng React Native View/StyleSheet, không cần ảnh hay font tải từ mạng.

## Kiểm tra và quy ước

```powershell
npm run typecheck
npm run lint
npm test
npx expo install --check
npx expo-doctor
npm run export:android
```

- TypeScript strict, indentation 2 dấu cách, component PascalCase.
- ESLint dùng `eslint-config-expo`; chưa thêm formatter riêng.
- Jest/jest-expo + React Native Testing Library; test đặt cạnh source (`*.test.ts(x)`).
- Test HTTP dùng Axios adapter giả trong test, không thay thế kiểm chứng backend thật.
- Query không retry mặc định; mutation không retry. Chưa có auth/cache riêng tư để nghiệm thu account switching.
- `app.config.js` dùng JSDoc để chạy cả bản Node Linux không tích hợp TypeScript stripping; source ứng dụng vẫn là TypeScript.

## Smoke test trên máy nhóm

- Mở app từ cài mới, thấy Home tiếng Việt, không có màn hình lỗi.
- Kiểm tra cuộn trên màn hình nhỏ, font lớn, safe area/status bar.
- Thử deep link `sancau://missing`, thấy màn hình không tìm thấy và quay về Home.
- Đóng/mở app, kiểm tra reload. Sau khi có backend mới kiểm tra HTTP từ Emulator.
- Chưa đánh dấu MS01 hoàn thành: còn backend/database, kiểm tra máy thứ hai và APK độc lập theo roadmap.

## Tài liệu tham khảo

- [Bộ phiên bản Expo SDK](https://docs.expo.dev/versions/latest/).
- [Cài Expo Router](https://docs.expo.dev/router/installation/).
- [Kiến trúc đã duyệt](../docs/ARCHITECTURE.md), [roadmap](../docs/ROADMAP.md).
