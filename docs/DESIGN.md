# DESIGN — Định hướng giao diện ứng dụng đặt sân cầu lông

- **Phiên bản:** 1.0 — 10/11/2026.
- **Trạng thái:** Đã thống nhất giữ phong cách mẫu, điều chỉnh theo MVP hiện hành.
- **Nguồn thiết kế:** [pendev.txt](../pendev.txt), bản HTML với ảnh nhúng và các khung giao diện SHUTTLE.
- **Tham chiếu:** [PRD](PRD.md), [Tech Stack](TECH_STACK.md), [Architecture](ARCHITECTURE.md), [API Spec](API_SPEC.md), [Roadmap](ROADMAP.md).

Tài liệu ghi nhận định hướng thị giác và cách áp dụng mẫu vào MVP. Đây không phải thiết kế hoàn chỉnh cho toàn bộ ứng dụng. Mẫu không thay đổi hợp đồng API, schema, phân quyền hoặc quy tắc nghiệp vụ đã duyệt.

## 1. Phạm vi nguồn thiết kế

File nguồn chứa 7 khung, kích thước tham chiếu 390 × 844:

| Khung trong nguồn | Nội dung | Cách sử dụng |
|---|---|---|
| 01 · Welcome | Ảnh nền, thương hiệu, lời giới thiệu, nút bắt đầu | Tham khảo phong cách; chưa chốt là màn hình khởi động bắt buộc |
| 02 · Đăng nhập — điện thoại | Nhập số điện thoại, nhận mã, Google, tiếp tục với tư cách khách | Giữ phong cách; thay luồng bằng email + mật khẩu |
| 02 · Đăng nhập — email | Email và liên kết/mã xác thực | Giữ bố cục; không triển khai liên kết/mã xác thực |
| 03 · Xác thực OTP | Sáu ô mã, đếm ngược, gửi lại | Ngoài MVP, không tạo màn hình OTP |
| 02B · Lỗi SĐT | Lỗi ngay dưới ô nhập | Tham khảo cách trình bày lỗi; không sao chép quy tắc số điện thoại |
| 02C · Lỗi email | Email sai và thông báo khóa tài khoản | Giữ cách trình bày lỗi; bỏ thông báo khóa chưa có trong đặc tả |
| 03B · OTP không đúng | Mã sai, số lần thử, thời gian chờ | Ngoài MVP |

Hai khung cùng nhãn “02” được phân biệt bằng phương thức đăng nhập. Thứ tự đặt các khung trong HTML không được coi là sơ đồ điều hướng đã duyệt.

Chưa có thiết kế chi tiết cho đăng ký, danh sách/chi tiết cơ sở và sân, lịch trống, đặt/hủy sân, hồ sơ chủ sân, vận hành cơ sở hoặc Admin. Không suy diễn các màn hình này từ mẫu xác thực.

## 2. Phong cách và giá trị tham chiếu

### 2.1. Nhận diện và màu sắc

Mẫu sử dụng tên **SHUTTLE**, ảnh thể thao và phong cách gọn, nền sáng, xanh đậm. Tên này là nhận diện trong nguồn tham khảo; tài liệu không tự đổi tên ứng dụng, package ID hoặc slug hiện có.

| Vai trò thị giác | Màu lấy từ mẫu |
|---|---|
| Màu chính, nút chính | `#0E7A5A` |
| Nền chính | `#FFFFFF` |
| Nền ô nhập, vùng phụ | `#F5F7F6` |
| Chữ chính | `#0E1613` |
| Chữ phụ | `#6D7A75` |
| Chữ mờ | `#9DA9A4` |
| Đường viền, phân cách | `#E7EBE9` |
| Lỗi | `#B4462F` |
| Điểm nhấn ở Welcome | `#D7F26B` |

Đây là giá trị trích từ nguồn, chưa phải xác nhận đạt tương phản cho mọi cách kết hợp. Khi triển khai, kiểm tra tương phản, đặc biệt chữ nhỏ/mờ trên nền sáng; dùng chữ đậm hơn khi cần. Trạng thái lỗi hoặc lịch sân phải có nhãn, không chỉ dựa vào màu.

### 2.2. Typography

- Font tham chiếu: **Be Vietnam Pro**, các trọng lượng 400, 500, 600, 700.
- Tiêu đề Welcome: 42; tiêu đề xác thực: 30; nội dung: 14–15; nhãn: 12–13; nội dung phụ trong mẫu: 11–12.5.
- Các số trên lấy từ CSS pixel của bản HTML, là cơ sở tham khảo khi chuyển sang đơn vị giao diện React Native; không khóa font scaling theo kích thước mẫu.
- Đảm bảo dấu tiếng Việt, xuống dòng và chữ lớn theo cài đặt thiết bị. Không giữ `white-space: nowrap` khiến nội dung tràn màn hình.
- Khi triển khai font, đóng gói tài nguyên phù hợp và kiểm tra quyền sử dụng; không phụ thuộc tải Google Fonts trong lúc mở app. Có font hệ thống dự phòng.

### 2.3. Khoảng cách và hình dạng

- Lề ngang phần nội dung xác thực: 24; khoảng cách các nhóm khoảng 22; khoảng cách trong nhóm thường 8–12.
- Nút chính: cao 52, bo góc 14. Ô nhập: cao 56, bo góc 14, padding ngang 16.
- Thẻ phụ: bo góc 16; ô biểu tượng phụ: bo góc 12.
- Nút quay lại trong mẫu là 40 × 40; vùng chạm khi triển khai phải tối thiểu 48 × 48 dp.
- Bo góc 44 của khung ngoài thuộc hình minh họa thiết bị, không áp lên toàn bộ màn hình Android.

## 3. Component và trạng thái

| Component | Hướng áp dụng |
|---|---|
| Nút chính | Nền xanh, chữ trắng, nhãn hành động rõ; thể hiện loading và chặn gửi lặp trong lúc xử lý |
| Nút phụ/liên kết | Phân cấp nhẹ hơn nút chính; chỉ hiển thị hành động thuộc MVP |
| Ô nhập | Nhãn luôn nhận biết được, nền xám nhạt; có trạng thái focus, lỗi, vô hiệu hóa |
| Lỗi tại trường | Chữ lỗi dưới ô nhập, có mô tả cụ thể; không xóa giá trị người dùng đã nhập |
| Quay lại | Tương thích lịch sử điều hướng và nút Back của Android |
| Tiếp tục với tư cách khách | Đi tới nội dung công khai; không tạo tài khoản hay cấp quyền đặt sân |
| Tải/rỗng/lỗi | Có nội dung giải thích; lỗi mạng có thao tác thử lại phù hợp, không báo thành công giả |

Đối với form, lỗi định dạng hiển thị tại trường. Lỗi đăng nhập sai thông tin dùng thông báo chung, không tiết lộ email có tồn tại hay không. Lỗi mạng/timeout tách biệt lỗi thông tin đăng nhập; không tự thêm bộ đếm số lần sai hoặc thời gian khóa.

## 4. Điều chỉnh luồng xác thực theo MVP

### 4.1. Đăng nhập

- Giữ phong cách nền, tiêu đề, ô nhập và nút từ mẫu.
- Tiêu đề: “Đăng nhập”; mô tả: “Nhập email và mật khẩu để tiếp tục.”
- Hai trường: email và mật khẩu; mật khẩu được che khi nhập. Nút chính: “Đăng nhập”.
- Liên kết đăng ký dẫn tới form đăng ký; giữ lối tiếp tục với tư cách khách để xem nội dung công khai.
- Gửi `LoginRequest` với `email`, `password`; không gửi số điện thoại hoặc mã OTP thay thế.
- Hành vi phiên, khôi phục đăng nhập và phân quyền theo ARCHITECTURE/API_SPEC, không suy ra từ hình ảnh thiết kế.

### 4.2. Đăng ký — cần bổ sung thiết kế

Đây là màn hình bắt buộc trong PRD nhưng chưa có khung trong nguồn. Dùng cùng phong cách với form đăng nhập, gồm họ tên, email, số điện thoại và mật khẩu theo `RegisterRequest`. Tài khoản mới là khách hàng; không có tùy chọn tự cấp quyền OWNER/ADMIN.

Validation tuân API_SPEC, không dùng quy tắc “9 số sau +84” của mẫu thay thế quy tắc số điện thoại đã duyệt. Đăng ký thành công chưa đồng nghĩa đăng nhập; chuyển người dùng tới bước đăng nhập theo hợp đồng hiện hành.

### 4.3. Khách chưa đăng nhập

Cho phép xem danh sách/chi tiết cơ sở, sân và lịch trống công khai. Khi thực hiện đặt sân, yêu cầu đăng nhập. Giao diện dành cho chủ sân/Admin chỉ xuất hiện theo quyền hiện tại; backend vẫn là nơi kiểm tra quyền và sở hữu.

## 5. Nội dung cần sửa hoặc xác nhận

| Nội dung từ mẫu | Quyết định cho MVP |
|---|---|
| “Thanh toán ngay trong ứng dụng” | Thay bằng “Thanh toán tại sân” |
| “240+ sân tại TP.HCM” | Không sử dụng khi chưa có dữ liệu xác minh |
| “Lịch trống thời gian thực” | Dùng “Xem lịch trống”; không hàm ý có WebSocket hay giữ chỗ. Backend kiểm tra lại khi đặt |
| OTP điện thoại, liên kết/mã email | Không triển khai; dùng email + mật khẩu |
| Google/Apple | Không hiển thị phương thức ngoài MVP |
| Khóa 15 phút sau 5 lần sai, số lần OTP còn lại | Không đưa vào UI hoặc nghiệp vụ khi chưa được duyệt |
| Điều khoản sử dụng và chính sách bảo mật | Nội dung/đích liên kết chưa được cung cấp; cần xác nhận trước khi hiển thị chính thức, không tạo liên kết giả |
| Ảnh nền nhúng trong HTML | Tài nguyên tham khảo; cần xác nhận nguồn/quyền sử dụng và chuẩn bị asset trước khi đưa vào ứng dụng |

Lời giới thiệu có thể dùng nếu triển khai Welcome: “Xem lịch trống, đặt sân theo giờ và thanh toán tại sân.” Chưa chốt màn hình này mở mỗi lần, chỉ lần đầu hay làm trang vào ứng dụng; không thêm cờ onboarding chỉ từ tài liệu này.

## 6. Áp dụng vào React Native

- Sử dụng **React Native Paper + StyleSheet**, ánh xạ các vai trò màu sang theme. Không thêm Tailwind, WebView hay kiến trúc navigation khác để chạy nguyên bản HTML.
- Dùng Expo Router theo ARCHITECTURE; route mỏng, screen/component nằm trong feature tương ứng.
- Thiết kế co giãn theo chiều rộng thiết bị, có safe area, cuộn và tránh bàn phím che trường nhập/nút gửi. Không sao chép tọa độ tuyệt đối của canvas nhiều màn hình.
- Status bar, giờ, sóng, pin và thanh điều hướng do Android quản lý; không vẽ lại các biểu tượng hệ thống trong mẫu.
- Icon nguồn chủ yếu là Lucide, có Phosphor cho Google. Khi triển khai, chọn icon tương đương từ bộ đã dùng nếu phù hợp; không cài thêm bộ icon chỉ để giữ nút social login đã loại khỏi MVP.
- Các phần thiếu thiết kế phải được cụ thể hóa ở task tương ứng. Không tự thêm chức năng, API hoặc dữ liệu giả để lấp chỗ trống.

## 7. Tiêu chí kiểm tra khi triển khai giao diện

- Màu, font, khoảng cách và phân cấp thị giác nhất quán với định hướng; font tiếng Việt hiển thị đúng.
- Màn hình nhỏ và font lớn không làm mất nội dung/hành động; bàn phím không che form, vùng chạm đạt tối thiểu 48 dp.
- Trạng thái tải, lỗi mạng, lỗi trường và thông tin đăng nhập sai phân biệt được; thao tác thất bại không mất nội dung form.
- Không còn OTP/social login, lời hứa thanh toán online, số liệu cơ sở chưa xác minh hoặc quy tắc khóa ngoài đặc tả.
- Guest chỉ truy cập nội dung công khai; đăng ký/đăng nhập và giao diện theo quyền tuân PRD/API.
- Kiểm tra trực tiếp trên Android Emulator trước khi kết luận giao diện đạt; việc lưu tài liệu này không xác nhận ứng dụng đã chạy hoặc milestone đã hoàn thành.

Không thay đổi PRD, TECH_STACK, ARCHITECTURE, DATABASE, API_SPEC hoặc ROADMAP thông qua tài liệu này. Các phần chưa có thiết kế và tài nguyên chưa xác nhận vẫn được ghi nhận là chưa hoàn tất.
