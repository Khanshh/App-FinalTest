# API SPEC — REST API ứng dụng đặt sân cầu lông

- **Phiên bản:** 1.0
- **Ngày cập nhật:** 02/11/2026
- **Trạng thái:** Thiết kế đã được người dùng phê duyệt và yêu cầu lưu tài liệu.
- **Tài liệu liên quan:** [PRD.md](PRD.md), [DATABASE.md](DATABASE.md), [ARCHITECTURE.md](ARCHITECTURE.md), [TECH_STACK.md](TECH_STACK.md).
- **Phạm vi:** 48 endpoint phục vụ MVP M01–M15; Khách hàng, Chủ sân và Admin; một chủ quản lý nhiều cơ sở.

Các endpoint tham chiếu request DTO, response DTO, validation, authentication và định dạng lỗi dùng chung trong tài liệu. Các tham chiếu này là một phần hợp đồng của từng endpoint, không phải phần để trống cho người triển khai tự quyết định.

Đây là đặc tả thiết kế. Việc lưu tài liệu không tạo controller, service, DTO Java, OpenAPI implementation, migration hoặc code frontend.

## 1. Quy ước giao tiếp

| Nội dung | Quy định |
|---|---|
| Base path | /api/v1 |
| Request/response nghiệp vụ | application/json, UTF-8 |
| Tên trường JSON | camelCase |
| ID | Chuỗi UUID |
| Ngày | YYYY-MM-DD |
| Giờ | HH:mm; phút bắt buộc 00 |
| Giờ kết thúc ngày | Cho phép 24:00; giờ bắt đầu tối đa 23:00 |
| Timestamp | ISO 8601 UTC, ví dụ 2026-11-02T03:00:00Z |
| Múi giờ kinh doanh | Asia/Ho_Chi_Minh |
| Tiền VND | Chuỗi số nguyên thập phân, ví dụ "120000" |
| Thành công | DTO trực tiếp, không có envelope success/data |
| Không có nội dung | HTTP 204, không response body |
| Lỗi | application/problem+json |
| Upload ảnh | multipart/form-data |
| Tải ảnh | Nội dung nhị phân với MIME type đúng |

Tiền truyền bằng chuỗi để giữ nguyên PostgreSQL bigint khi frontend dùng JavaScript. Backend vẫn validation và tính bằng số nguyên; không thay đổi kiểu lưu database. Không nhận dạng số thực, số mũ, dấu phân cách hoặc giá trị JSON number cho các trường tiền.

Tạo tài nguyên thông thường trả 201 và Location tới endpoint chi tiết mà người gọi có quyền đọc. Đăng ký tài khoản trả UserDto và chưa đăng nhập nên không cần Location tới một API riêng tư. Token response và dữ liệu riêng tư dùng Cache-Control: no-store.

Không trả trực tiếp JPA entity. Các projection/DTO phải được lựa chọn rõ theo phạm vi công khai, cá nhân, chủ sở hữu hoặc Admin.

## 2. Authentication và phạm vi quyền

| Ký hiệu | Yêu cầu |
|---|---|
| P | Công khai, không yêu cầu đăng nhập |
| U | Access token hợp lệ và phiên còn hiệu lực |
| C | U và quyền CUSTOMER |
| O | U và quyền OWNER; kiểm tra sở hữu tài nguyên |
| A | U và quyền ADMIN |
| R | Xác thực bằng refresh token trong body |

API bảo vệ nhận header `Authorization: Bearer <accessToken>`.

- Chủ được duyệt có cả CUSTOMER và OWNER.
- Thiếu/sai xác thực trả 401; không đủ vai trò trả 403.
- Có vai trò nhưng tài nguyên riêng tư ngoài quyền truy cập trả 404.
- Tài nguyên con không thuộc tài nguyên cha trong URL cũng trả 404.
- Kiểm tra quyền trước khi trả chi tiết xung đột hoặc dữ liệu tài nguyên.
- Admin không được dùng API vận hành của chủ chỉ vì có ADMIN.
- Client không truyền ownerId, vai trò, trạng thái đơn hoặc tổng tiền để backend ghi trực tiếp.
- Quyền và trạng thái phiên được kiểm tra từ backend theo ARCHITECTURE; quyền trong cache/token không là nguồn quyết định duy nhất.
- Các API login/refresh/logout không yêu cầu access token; frontend không gắn bearer token vào các request này.

## 3. Validation và cập nhật dữ liệu

### 3.1. Validation dùng chung

| Nhóm | Quy định |
|---|---|
| UUID | Đúng định dạng; sai trả 400 |
| Chuỗi bắt buộc | Trim, không rỗng hoặc toàn khoảng trắng |
| Email | Đúng định dạng, tối đa 254 ký tự; trim và lowercase |
| Họ tên | Tối đa 100 ký tự |
| Tên cơ sở | Tối đa 150 ký tự |
| Tên sân | Tối đa 100 ký tự |
| Số điện thoại | 9–15 chữ số, có thể bắt đầu bằng +; không OTP |
| Địa chỉ | Tối đa 500 ký tự |
| Mô tả | Tối đa 2.000 ký tự |
| Tiện ích | Văn bản tối đa 1.000 ký tự |
| Lý do | Tối đa 1.000 ký tự; không rỗng khi bắt buộc |
| Mật khẩu đăng ký | Ít nhất 8 ký tự, tối đa 72 byte UTF-8; không trim |
| Mật khẩu đăng nhập | Không rỗng, tối đa 72 byte UTF-8; không trim |
| Tiền | Chuỗi chữ số nguyên dương, không dấu/phần lẻ; trong phạm vi bigint |
| Khoảng giờ | Giờ tròn; startTime < endTime; cùng ngày |
| Trường JSON không khai báo | Trả 400, tránh cập nhật ngoài danh sách cho phép |

Các chuỗi ngày/giờ phải có đúng định dạng và là giá trị lịch hợp lệ. Backend quy đổi giờ API thành smallint như DATABASE. Giá trị endTime = 24:00 là cuối ngày được chọn, không nhận 24:00 cho giờ bắt đầu.

Các enum và tên bộ lọc dùng đúng chữ hoa/thường được nêu. Query boolean dùng true/false; số trang/kích thước là số nguyên.

### 3.2. PATCH và PUT

Với PATCH:

- Không gửi trường thì giữ nguyên.
- null chỉ dùng để xóa trường tùy chọn.
- Không null tên, địa chỉ, số liên hệ, giá hoặc isActive.
- Request phải có ít nhất một trường cập nhật.
- Chuỗi tùy chọn rỗng sau trim được chuẩn hóa thành null.
- Khi cập nhật giờ cơ sở, gửi cả openingTime và closingTime: cùng null hoặc cùng tạo một khoảng hợp lệ.

PUT hồ sơ thay toàn bộ phần nội dung được chỉnh sửa; không thay trạng thái, người đăng ký, lịch sử hoặc lần gửi do client tự quyết định.

### 3.3. Phân trang

- page bắt đầu từ 0, mặc định 0.
- size mặc định 20, từ 1 đến 100.
- Không nhận sắp xếp tùy ý trong MVP; từng endpoint có thứ tự mặc định.
- Trang vượt phạm vi trả danh sách rỗng, không 404.
- Bộ lọc không hợp lệ trả 400, không âm thầm bỏ qua.

Response `Page<T>`:

```json
{
  "items": [],
  "page": 0,
  "size": 20,
  "totalElements": 0
}
```

items chứa đúng DTO được endpoint quy định. Lịch trống tối đa 24 khung/ngày, không phân trang. Tất cả thứ tự sắp xếp có khóa cuối id để ổn định; lịch sử xét duyệt dùng submissionNo duy nhất trong hồ sơ.

## 4. Error response

### 4.1. Định dạng Problem Details

```json
{
  "type": "about:blank",
  "title": "Conflict",
  "status": 409,
  "detail": "Một hoặc nhiều khung giờ không còn trống.",
  "instance": "/api/v1/bookings",
  "code": "SLOT_UNAVAILABLE",
  "requestId": "71d92c5e-4a9c-4f09-bcce-f51762ce239a",
  "fieldErrors": [],
  "context": {
    "conflictingSlots": [
      {
        "date": "2026-11-04",
        "startTime": "18:00",
        "endTime": "19:00"
      }
    ]
  }
}
```

- Theo Problem Details RFC 9457, Content-Type application/problem+json.
- fieldErrors là mảng object có field, code, message; rỗng nếu không phải lỗi trường.
- context là object chứa dữ liệu nghiệp vụ được phép, mặc định {}.
- instance là đường dẫn API, không đưa token/query nhạy cảm vào đây.
- Không trả mật khẩu/token/hash, SQL, stack trace hoặc dữ liệu khách khác.
- Frontend xử lý status/code, không phân tích câu detail.
- Lỗi từ controller và security filter dùng cùng định dạng.

### 4.2. Lỗi chung

| HTTP | Code | Điều kiện |
|---|---|---|
| 400 | VALIDATION_ERROR | Body/query/path/header không hợp lệ |
| 401 | AUTHENTICATION_REQUIRED | Thiếu xác thực tại API bảo vệ |
| 401 | ACCESS_TOKEN_EXPIRED | Access token hết hạn |
| 401 | SESSION_INVALID | Token/phiên không hợp lệ hoặc đã thu hồi |
| 403 | FORBIDDEN | Không đủ vai trò |
| 404 | RESOURCE_NOT_FOUND | Không tồn tại, sai cha–con hoặc ngoài sở hữu |
| 415 | UNSUPPORTED_MEDIA_TYPE | Content-Type request không hỗ trợ |
| 500 | INTERNAL_ERROR | Lỗi ngoài dự kiến |

Các lỗi chung áp dụng cho từng endpoint theo request, authentication và tài nguyên của nó. Bảng endpoint bổ sung lỗi nghiệp vụ riêng; không ghi lại toàn bộ lỗi chung ở từng dòng. Endpoint công khai không bắt buộc bearer token; các API bảo vệ dùng lỗi 401/403 nêu trên.

## 5. Request DTO

Dấu ? nghĩa là có thể không gửi. Các trường không có ? là bắt buộc. Trừ trường được ghi rõ là boolean hoặc số nguyên, các trường request bên dưới là string; các trường ID/ngày/giờ/tiền tuân kiểu biểu diễn ở mục 1.

| DTO | Các trường |
|---|---|
| RegisterRequest | fullName, email, phone, password |
| LoginRequest | email, password |
| RefreshRequest | refreshToken: chuỗi không rỗng, tối đa 512 ký tự |
| ApplicationInput | contactName, contactPhone, venueName, venueAddress, venueDescription |
| ApplicationUpdateRequest | Toàn bộ ApplicationInput và submissionNo: số nguyên dương |
| SubmissionRequest | submissionNo: số nguyên dương |
| RejectApplicationRequest | submissionNo: số nguyên dương; reason bắt buộc |
| VenueCreateRequest | name, address, contactPhone, description?, amenities?, openingTime?, closingTime? |
| VenuePatchRequest | Các trường VenueCreate đều tùy chọn, ít nhất một trường |
| CourtCreateRequest | name, hourlyPriceVnd, description?, amenities?, isActive?: boolean, mặc định true |
| CourtPatchRequest | Các trường CourtCreate đều tùy chọn, ít nhất một trường |
| BookingCreateRequest | courtId, date, startTime, endTime, expectedUnitPriceVnd |
| DirectBookingRequest | Toàn bộ BookingCreate và customerName, customerPhone |
| CustomerCancelRequest | reason?, có thể gửi {} |
| OwnerCancelRequest | reason bắt buộc |
| MaintenanceCreateRequest | courtId, date, startTime, endTime, reason |

- Các trường mô tả/tiện ích không gửi trong POST được lưu null; giờ cơ sở không gửi thì cả hai null.
- openingTime/closingTime cùng cung cấp khi cấu hình giờ. Ví dụ 06:00–22:00 hợp lệ, 06:30 không hợp lệ.
- BookingCreateRequest không nhận tên/điện thoại khách; backend lấy snapshot từ tài khoản hiện tại.
- expectedUnitPriceVnd chỉ phát hiện giá cũ; backend không ghi tùy ý giá client gửi.
- Upload chỉ nhận một multipart part tên file; không nhận storageKey, đường dẫn file hoặc photoId tùy ý.

## 6. Response DTO

Trừ khi ghi là number/boolean/object/array, giá trị là string theo quy ước ở mục 1. Nullable được trả rõ là null, không tùy tiện lúc có lúc không. Response DTO không chứa trường nội bộ ngoài danh sách.

### 6.1. UserDto

- id: UUID.
- fullName, email, phone.
- roles: mảng CUSTOMER, OWNER, ADMIN.

### 6.2. TokenDto

- accessToken.
- tokenType: luôn Bearer.
- accessTokenExpiresAt: timestamp UTC.
- refreshToken.
- refreshTokenExpiresAt: timestamp UTC.

Access token tối đa 15 phút, không vượt hạn phiên. Refresh giữ nguyên trong phiên, không kéo dài hạn tối đa 7 ngày. Đây là response chỉ dùng cho login/refresh và không được log hoặc cache.

### 6.3. PhotoDto

- id: UUID.
- url: URL truy cập ảnh, dùng được từ thiết bị theo môi trường.
- mimeType.
- sizeBytes: số nguyên; tối đa 5.242.880.

Không có storageKey, đường dẫn ổ đĩa hoặc người upload.

### 6.4. VenueDto — Công khai

- id: UUID.
- name, address, contactPhone.
- description, amenities: string hoặc null.
- photo: PhotoDto hoặc null.
- openingTime, closingTime: giờ đã cấu hình.

Không có email cá nhân hoặc thông tin tài khoản chủ.

### 6.5. OwnerVenueDto

- Toàn bộ VenueDto; openingTime/closingTime có thể cùng null nếu chưa cấu hình.
- ownerId: UUID.
- sourceApplicationId: UUID hoặc null.
- isBookable: boolean, tính từ điều kiện hiển thị/nhận đặt hiện tại.
- createdAt, updatedAt: timestamp UTC.

### 6.6. CourtDto — Công khai

- id, venueId: UUID.
- name.
- description, amenities: string hoặc null.
- photo: PhotoDto hoặc null.
- hourlyPriceVnd: chuỗi tiền.

### 6.7. OwnerCourtDto

- Toàn bộ CourtDto.
- isActive: boolean.
- createdAt, updatedAt: timestamp UTC.

### 6.8. AvailabilityDto

- courtId, venueId: UUID.
- date, timezone: timezone luôn Asia/Ho_Chi_Minh.
- serverTime: timestamp UTC.
- hourlyPriceVnd: chuỗi tiền.
- bookingPolicy: object có minDate, maxDate và cancellationLeadHours; cancellationLeadHours là số nguyên 24.
- slots: mảng object có startTime, endTime, status, selectable; selectable là boolean.

| status | Ý nghĩa |
|---|---|
| AVAILABLE | Còn trống, giờ bắt đầu ở tương lai |
| BOOKED | Đơn đang chiếm khung |
| MAINTENANCE | Bảo trì đang chiếm khung |
| EXPIRED | Giờ bắt đầu đã qua và không có nguồn chiếm khung |
| UNAVAILABLE | Sân ngừng nhận đặt, chỉ ở lịch quản lý |

Chỉ AVAILABLE có selectable = true. Các khung tăng dần theo startTime và chỉ nằm trong giờ hoạt động. Với sân inactive, UNAVAILABLE được ưu tiên; còn lại ưu tiên BOOKED/MAINTENANCE, rồi EXPIRED, rồi AVAILABLE.

Không trả booking ID, tên/điện thoại khách hoặc lý do bảo trì trong DTO lịch. minDate/maxDate được backend tính từ hôm nay và sáu ngày tiếp theo, không do client quyết định.

### 6.9. BookingDto — Chỉ người có quyền xem đơn

- id: UUID; bookingCode.
- venue: object có id, name, address, contactPhone.
- court: object có id, name.
- date, startTime, endTime.
- slotStartTimes: mảng chuỗi giờ, tăng dần.
- unitPriceVnd, totalAmountVnd: chuỗi tiền.
- source: APP hoặc DIRECT.
- status: CONFIRMED, CANCELLED hoặc COMPLETED.
- customer: object có fullName, phone; snapshot lúc đặt.
- createdAt: timestamp UTC.
- cancelledAt, completedAt: timestamp UTC hoặc null.
- cancellationReason: string hoặc null.
- actions: object có canCancel, canComplete; cả hai boolean, tính theo endpoint và người gọi.

Không trả requestHash, idempotencyKey, refresh token hoặc thông tin tài khoản không cần thiết. Đơn cũ vẫn đọc được khi sân inactive hoặc cơ sở không còn công khai. Thông tin cơ sở/sân lấy theo tài nguyên liên quan; tên/điện thoại khách và giá lấy snapshot của đơn.

### 6.10. ReviewDto

- id: UUID.
- submissionNo: số nguyên dương.
- decision: APPROVED hoặc REJECTED.
- rejectionReason: string hoặc null.
- reviewedAt: timestamp UTC.
- submissionSnapshot: object có contactName, contactPhone, email, venueName, venueAddress, venueDescription.

### 6.11. ApplicationDto

- id: UUID.
- contactName, contactPhone, venueName, venueAddress, venueDescription.
- status: PENDING, APPROVED hoặc REJECTED.
- submissionNo: số nguyên dương.
- submittedAt, createdAt, updatedAt: timestamp UTC.
- lastReview: ReviewDto hoặc null.
- initialVenueId: UUID hoặc null, suy ra từ cơ sở tạo khi duyệt.

### 6.12. AdminApplicationDto

- application: ApplicationDto.
- applicant: UserDto.

### 6.13. AdminOwnerDto

- user: UserDto.
- venueCount: số nguyên không âm.
- approvedAt: timestamp UTC được duyệt làm chủ sân.

### 6.14. MaintenanceDto

- id, venueId, courtId: UUID.
- date, startTime, endTime.
- slotStartTimes: mảng giờ tăng dần.
- reason.
- createdAt: timestamp UTC.
- releasedAt: timestamp UTC hoặc null.
- isReleased: boolean tính từ releasedAt.

## 7. Danh sách endpoint

**Tất cả URL trong các bảng dưới có prefix /api/v1.** Request body là dấu — nghĩa là không gửi body. `Page<T>` theo mục 3.3. Mỗi dòng kết hợp với DTO và quy tắc chung là đặc tả đầy đủ cho chức năng, request, response, status, validation, xác thực, lỗi và nghiệp vụ.

### 7.1. Tài khoản và phiên — M01

| Endpoint/chức năng | Auth | Request body | Response thành công | Validation và nghiệp vụ | Lỗi riêng |
|---|---|---|---|---|---|
| **POST /auth/register** — tạo tài khoản | P | RegisterRequest | 201 UserDto | Validation thông tin; email duy nhất; chỉ cấp CUSTOMER; chưa tự đăng nhập | 409 EMAIL_ALREADY_USED |
| **POST /auth/login** — đăng nhập | P | LoginRequest | 200 TokenDto | Kiểm tra BCrypt; tạo phiên tối đa 7 ngày | 401 INVALID_CREDENTIALS, không phân biệt email không tồn tại/sai mật khẩu |
| **POST /auth/refresh** — lấy access token mới | R | RefreshRequest | 200 TokenDto | Kiểm tra hash, hạn, thu hồi; không kéo dài phiên hoặc xoay refresh token | 401 REFRESH_TOKEN_INVALID cho không tồn tại/hết hạn/thu hồi |
| **POST /auth/logout** — thu hồi phiên | R | RefreshRequest | 204, không body | Refresh token dùng để logout cả khi access hết hạn; token đã thu hồi/không tồn tại cũng trả 204 | Body sai: lỗi validation chung |
| **GET /me** — thông tin hiện tại | U | — | 200 UserDto | Đọc quyền mới nhất từ backend | Không có lỗi nghiệp vụ riêng |

### 7.2. Cơ sở, sân và lịch công khai — M02–M03

| Endpoint/chức năng | Auth | Body/query | Response | Validation và nghiệp vụ | Lỗi riêng |
|---|---|---|---|---|---|
| **GET /venues** — danh sách cơ sở | P | Body —; page, size | 200 `Page<VenueDto>` | Chỉ cơ sở đủ điều kiện hiển thị; name tăng dần, rồi id | Không có |
| **GET /venues/{venueId}** — chi tiết cơ sở | P | — | 200 VenueDto | Phải đủ điều kiện hiển thị | 404 RESOURCE_NOT_FOUND nếu chưa công khai |
| **GET /venues/{venueId}/courts** — sân nhận đặt | P | Body —; page, size | 200 `Page<CourtDto>` | Cơ sở công khai, chỉ sân active; name tăng dần, rồi id | 404 RESOURCE_NOT_FOUND |
| **GET /venues/{venueId}/courts/{courtId}** — chi tiết sân | P | — | 200 CourtDto | Đúng cha–con; cơ sở công khai, sân active | 404 RESOURCE_NOT_FOUND |
| **GET /courts/{courtId}/availability** — lịch trống | P | Body —; date bắt buộc | 200 AvailabilityDto | Sân/cơ sở nhận đặt; hôm nay và sáu ngày tiếp theo | 422 BOOKING_DATE_OUT_OF_RANGE; tài nguyên không công khai: 404 |

Không thêm tìm theo GPS, bản đồ hoặc lọc tiện ích ngoài PRD.

### 7.3. Đặt sân và lịch cá nhân — M04–M06

| Endpoint/chức năng | Auth | Body/query/header | Response | Validation và nghiệp vụ | Lỗi riêng |
|---|---|---|---|---|---|
| **POST /bookings** — đặt sân | C | BookingCreateRequest; Idempotency-Key UUID bắt buộc | 201 BookingDto; replay đã thành công: 200 BookingDto | Tên/điện thoại từ tài khoản; kiểm tra giá/khả dụng trong transaction; tạo toàn bộ hoặc rollback | 409 SLOT_UNAVAILABLE, PRICE_CHANGED, COURT_UNAVAILABLE, IDEMPOTENCY_KEY_REUSED; 422 theo quy tắc thời gian |
| **GET /me/bookings** — lịch cá nhân | C | Body —; page, size, view, status? | 200 `Page<BookingDto>` | Chỉ đơn có customer_user_id là người hiện tại | Bộ lọc sai: 400 |
| **GET /me/bookings/{bookingId}** — chi tiết đơn cá nhân | C | — | 200 BookingDto | Chỉ đơn của mình; DIRECT không tự liên kết bằng điện thoại | Không có ngoài lỗi chung |
| **POST /me/bookings/{bookingId}/cancel** — khách hủy | C | CustomerCancelRequest | 200 BookingDto | CONFIRMED và còn ít nhất 24 giờ trước bắt đầu; hủy cả đơn, giải phóng occupancy | 422 CANCELLATION_DEADLINE_PASSED; 409 BOOKING_STATE_CONFLICT nếu đã hoàn thành |

Bộ lọc view:

- Mặc định ALL.
- UPCOMING: CONFIRMED và chưa hết giờ chơi, gồm lượt đang diễn ra.
- HISTORY: đã hủy/hoàn thành hoặc đã hết giờ chơi.
- status, nếu có, là một trong CONFIRMED/CANCELLED/COMPLETED, kết hợp với view.
- UPCOMING sắp xếp ngày/giờ tăng dần; các view khác giảm dần; cuối cùng theo id.
- GET không tự đổi trạng thái thành COMPLETED. canComplete luôn false ở API cá nhân.

### 7.4. Hồ sơ đăng ký chủ sân — M11–M12

| Endpoint/chức năng | Auth | Body/query | Response | Validation và nghiệp vụ | Lỗi riêng |
|---|---|---|---|---|---|
| **POST /me/owner-application** — gửi lần đầu | C | ApplicationInput | 201 ApplicationDto | Chưa có hồ sơ/chưa OWNER; email từ tài khoản; PENDING, submissionNo = 1 | 409 APPLICATION_ALREADY_EXISTS, OWNER_ALREADY_APPROVED |
| **GET /me/owner-application** — theo dõi | C | — | 200 ApplicationDto | Chỉ hồ sơ của mình; chưa có trả 404 | Không có |
| **PUT /me/owner-application** — sửa hồ sơ từ chối | C | ApplicationUpdateRequest | 200 ApplicationDto | Chỉ REJECTED, submissionNo khớp; thay toàn bộ nội dung form; chưa gửi lại | 409 APPLICATION_NOT_EDITABLE, STALE_SUBMISSION |
| **POST /me/owner-application/resubmit** — gửi lại | C | SubmissionRequest | 200 ApplicationDto | Chỉ REJECTED, submissionNo khớp; validation lại dữ liệu đã lưu; tăng lần gửi, chuyển PENDING | 409 APPLICATION_NOT_RESUBMITTABLE, STALE_SUBMISSION |
| **GET /me/owner-application/reviews** — lịch sử xét duyệt | C | Body —; page, size | 200 `Page<ReviewDto>` | Chỉ hồ sơ của mình; submissionNo giảm dần | Chưa có hồ sơ: 404 |

PUT không tự gửi lại. Sau resubmit, không sửa được cho đến khi bị từ chối tiếp. Nếu đã là OWNER, người dùng thêm cơ sở qua nhóm owner/venues thay vì đăng ký lại quyền.

### 7.5. Quản lý nhiều cơ sở và sân — M07, M15

| Endpoint/chức năng | Auth | Body/query | Response | Validation và nghiệp vụ | Lỗi riêng |
|---|---|---|---|---|---|
| **GET /owner/venues** — cơ sở của mình | O | Body —; page, size | 200 `Page<OwnerVenueDto>` | Chỉ owner hiện tại; gồm cơ sở chưa công khai; createdAt giảm dần, rồi id | Không có |
| **POST /owner/venues** — thêm cơ sở | O | VenueCreateRequest | 201 OwnerVenueDto | Owner từ phiên, sourceApplicationId = null; không duyệt lại | Giờ sai: 400 |
| **GET /owner/venues/{venueId}** — chi tiết quản lý | O | — | 200 OwnerVenueDto | Phải sở hữu cơ sở | Không có |
| **PATCH /owner/venues/{venueId}** — cập nhật cơ sở | O | VenuePatchRequest | 200 OwnerVenueDto | Không đổi chủ/nguồn hồ sơ; đổi giờ dưới khóa cơ sở; không vô hiệu hóa lịch CONFIRMED chưa kết thúc | 409 VENUE_HOURS_CONFLICT |
| **GET /owner/venues/{venueId}/courts** — danh sách sân | O | Body —; page, size, isActive? | 200 `Page<OwnerCourtDto>` | Mặc định cả active/inactive; name tăng dần, rồi id | Bộ lọc sai: 400 |
| **POST /owner/venues/{venueId}/courts** — tạo sân | O | CourtCreateRequest | 201 OwnerCourtDto | Giá dương, tên duy nhất trong cơ sở; cơ sở chưa công khai vẫn được tạo sân | 409 COURT_NAME_EXISTS |
| **GET /owner/venues/{venueId}/courts/{courtId}** — chi tiết sân | O | — | 200 OwnerCourtDto | Đúng cơ sở và quyền sở hữu | Không có |
| **PATCH /owner/venues/{venueId}/courts/{courtId}** — sửa sân/giá/trạng thái | O | CourtPatchRequest | 200 OwnerCourtDto | Không đổi cơ sở; giá mới chỉ cho đơn mới; inactive không hủy đơn cũ | 409 COURT_NAME_EXISTS |
| **GET /owner/venues/{venueId}/courts/{courtId}/availability** — lịch quản lý | O | Body —; date bắt buộc | 200 AvailabilityDto | Cửa sổ bảy ngày; cho xem sân inactive; không trả liên hệ khách | 422 VENUE_NOT_READY, BOOKING_DATE_OUT_OF_RANGE |

VENUE_NOT_READY ở lịch quản lý nghĩa là chưa có giờ hoạt động để sinh lịch. Đơn quá khứ xem qua API quản lý đơn, không qua lịch trống. Không có endpoint xóa cơ sở/sân hoặc chuyển quyền sở hữu.

### 7.6. Quản lý đơn và đặt trực tiếp — M08–M09

| Endpoint/chức năng | Auth | Body/query/header | Response | Validation và nghiệp vụ | Lỗi riêng |
|---|---|---|---|---|---|
| **GET /owner/venues/{venueId}/bookings** — lịch cơ sở | O | Body —; date bắt buộc, courtId?, status?, page, size | 200 `Page<BookingDto>` | Ngày hợp lệ bất kỳ để xem lịch sử; courtId phải thuộc cơ sở; startTime tăng dần, rồi id | Bộ lọc sai: 400 |
| **GET /owner/venues/{venueId}/bookings/{bookingId}** — chi tiết quản lý | O | — | 200 BookingDto | Đơn thuộc cơ sở đang quản lý | Không có |
| **POST /owner/venues/{venueId}/bookings** — lịch trực tiếp | O | DirectBookingRequest; Idempotency-Key UUID bắt buộc | 201 BookingDto; replay: 200 BookingDto | Sân thuộc cơ sở; DIRECT, không gắn tài khoản khách; cùng quy tắc thời gian/giá/chống trùng | Lỗi tạo đơn như POST /bookings; thêm 422 VENUE_NOT_READY |
| **POST /owner/venues/{venueId}/bookings/{bookingId}/cancel** — chủ hủy | O | OwnerCancelRequest | 200 BookingDto | Lý do bắt buộc; chỉ trước giờ bắt đầu; giải phóng cả đơn | 422 BOOKING_ALREADY_STARTED; 409 BOOKING_STATE_CONFLICT nếu hoàn thành |
| **POST /owner/venues/{venueId}/bookings/{bookingId}/complete** — hoàn thành | O | — | 200 BookingDto | Chỉ CONFIRMED, đã đến giờ kết thúc; ghi completedAt, giải phóng occupancy còn lại | 422 BOOKING_NOT_FINISHED; 409 BOOKING_STATE_CONFLICT nếu đã hủy |

status lọc là CONFIRMED/CANCELLED/COMPLETED. Không tự hủy lịch quá giờ hoặc tự coi khách đã sử dụng sân.

### 7.7. Bảo trì — M10

| Endpoint/chức năng | Auth | Body/query | Response | Validation và nghiệp vụ | Lỗi riêng |
|---|---|---|---|---|---|
| **GET /owner/venues/{venueId}/maintenance-blocks** — danh sách | O | Body —; date bắt buộc, courtId?, isReleased?, page, size | 200 `Page<MaintenanceDto>` | Ngày lịch sử/tương lai; mặc định cả đã gỡ; startTime tăng dần, rồi id | Bộ lọc sai: 400 |
| **GET /owner/venues/{venueId}/maintenance-blocks/{blockId}** — chi tiết | O | — | 200 MaintenanceDto | Đúng cơ sở và quyền sở hữu | Không có |
| **POST /owner/venues/{venueId}/maintenance-blocks** — khóa | O | MaintenanceCreateRequest | 201 MaintenanceDto | Bắt đầu tương lai, trong giờ cơ sở; không giới hạn bảy ngày như đặt; không chồng đơn/bảo trì hiệu lực | 409 MAINTENANCE_CONFLICT; 422 VENUE_NOT_READY, TIME_OUTSIDE_OPERATING_HOURS, START_TIME_NOT_FUTURE |
| **POST /owner/venues/{venueId}/maintenance-blocks/{blockId}/release** — gỡ | O | — | 200 MaintenanceDto | Ghi người/thời điểm gỡ, xóa occupancy; không phục hồi đơn cũ | Không có lỗi nghiệp vụ riêng |

### 7.8. Admin xét duyệt và tra cứu — M13–M14

| Endpoint/chức năng | Auth | Body/query | Response | Validation và nghiệp vụ | Lỗi riêng |
|---|---|---|---|---|---|
| **GET /admin/owner-applications** — danh sách hồ sơ | A | Body —; status?, page, size | 200 `Page<AdminApplicationDto>` | Mặc định PENDING; submittedAt tăng dần, rồi id | Bộ lọc sai: 400 |
| **GET /admin/owner-applications/{applicationId}** — xem hồ sơ | A | — | 200 AdminApplicationDto | Không trả dữ liệu xác thực của người đăng ký | Không có |
| **GET /admin/owner-applications/{applicationId}/reviews** — lịch sử | A | Body —; page, size | 200 `Page<ReviewDto>` | submissionNo giảm dần | Không có |
| **POST /admin/owner-applications/{applicationId}/approve** — chấp thuận | A | SubmissionRequest | 200 object có application: ApplicationDto và initialVenue: OwnerVenueDto | submissionNo khớp; khóa hồ sơ; duyệt/cấp OWNER/tạo cơ sở cùng transaction | 409 STALE_SUBMISSION, APPLICATION_STATE_CONFLICT |
| **POST /admin/owner-applications/{applicationId}/reject** — từ chối | A | RejectApplicationRequest | 200 ApplicationDto | submissionNo khớp, lý do bắt buộc; lưu review/snapshot | 409 STALE_SUBMISSION, APPLICATION_STATE_CONFLICT |
| **GET /admin/owners** — chủ đã duyệt | A | Body —; page, size | 200 `Page<AdminOwnerDto>` | Chỉ tài khoản OWNER; ngày tạo tài khoản giảm dần, rồi id | Không có |
| **GET /admin/owners/{ownerId}** — chi tiết chủ | A | — | 200 AdminOwnerDto | Tài khoản là chủ đã duyệt | Không phải chủ/không tồn tại: 404 |
| **GET /admin/owners/{ownerId}/venues** — cơ sở của chủ | A | Body —; page, size | 200 `Page<OwnerVenueDto>` | Gồm cơ sở ban đầu/tạo thêm; createdAt giảm dần, rồi id | Không phải chủ/không tồn tại: 404 |

status hồ sơ là PENDING/APPROVED/REJECTED. Admin tra cứu cơ sở, không sửa giá hoặc xử lý đơn/bảo trì qua API Admin.

### 7.9. Ảnh cơ sở và sân

| Endpoint/chức năng | Auth | Request | Response | Validation và nghiệp vụ | Lỗi riêng |
|---|---|---|---|---|---|
| **POST /owner/venues/{venueId}/photo** — thay ảnh cơ sở | O | Multipart, một file | 200 PhotoDto | Kiểm tra quyền trước khi lưu; liên kết ảnh mới vào cơ sở | 413 FILE_TOO_LARGE; 415 UNSUPPORTED_IMAGE_TYPE; 400 INVALID_IMAGE |
| **POST /owner/venues/{venueId}/courts/{courtId}/photo** — thay ảnh sân | O | Multipart, một file | 200 PhotoDto | Sân đúng cơ sở; cùng quy tắc lưu file | 413 FILE_TOO_LARGE; 415 UNSUPPORTED_IMAGE_TYPE; 400 INVALID_IMAGE |
| **GET /media/{mediaId}** — nội dung ảnh | Theo quyền ảnh | Không body | 200 binary JPEG/PNG/WebP | Công khai nếu đang được tham chiếu bởi tài nguyên công khai; nếu không, chỉ chủ quản lý hoặc Admin có quyền tra cứu tài nguyên liên quan | Không tồn tại/không đủ quyền ảnh: 404; thiếu/sai xác thực khi cần: 401 |

Giới hạn 5.242.880 byte, kiểm tra nội dung file thật, không chỉ đuôi hoặc Content-Type. Không công khai ảnh không còn tham chiếu hoặc đường dẫn filesystem. Quyền riêng tư để xem ảnh không mở rộng quyền nghiệp vụ quản lý tài nguyên.

Endpoint tải ảnh trả binary; lỗi vẫn là Problem Details. Upload cập nhật tài nguyên ảnh hiện tại nên trả 200, không tạo API chỉnh sửa metadata hoặc nhận storage key từ client.

## 8. Quy tắc nghiệp vụ chi tiết

### 8.1. Tạo đơn và xác nhận giá

Hai endpoint tạo đơn cùng thực hiện:

1. Kiểm tra người gọi và tài nguyên.
2. Xử lý idempotency.
3. Với ý định mới, ngày phải là hôm nay hoặc sáu ngày tiếp theo.
4. Giờ bắt đầu ở tương lai, toàn bộ khoảng trong giờ hoạt động.
5. Sân đang nhận đặt.
6. Giá hiện tại bằng expectedUnitPriceVnd.
7. Toàn bộ khung trống.
8. Lưu đơn, chi tiết và occupancy trong cùng transaction dưới khóa cơ sở theo ARCHITECTURE.

| HTTP/code | Điều kiện |
|---|---|
| 422 BOOKING_DATE_OUT_OF_RANGE | Ngoài cửa sổ bảy ngày |
| 422 START_TIME_NOT_FUTURE | Giờ bắt đầu không còn ở tương lai |
| 422 TIME_OUTSIDE_OPERATING_HOURS | Ngoài giờ hoạt động |
| 422 VENUE_NOT_READY | Cơ sở chưa có giờ, ở luồng quản lý |

API công khai/tạo đơn khách không được đọc tài nguyên chưa công khai: trả 404. Khi tài nguyên đã được xác định nhưng sân vừa ngừng nhận đặt lúc xác nhận, trả 409 COURT_UNAVAILABLE. Kiểm tra này không cho phép truy cập dữ liệu riêng tư ngoài quyền.

Đổi giá trả 409 PRICE_CHANGED, context có expectedUnitPriceVnd, currentUnitPriceVnd, currentTotalAmountVnd; tất cả là chuỗi tiền. Không tạo đơn hoặc tự chấp nhận giá mới. Frontend hiển thị và chờ xác nhận; ý định mới dùng idempotency key mới.

### 8.2. Idempotency và mất response

- Mỗi ý định tạo đơn có Idempotency-Key UUID; giữ qua retry và refresh access token.
- Backend lưu key, request hash và liên kết đơn theo DATABASE trong cùng transaction.
- Cùng key/cùng nội dung trả cùng mã đơn; lần tạo đầu 201, replay thành công 200.
- Không kiểm tra giá/ngày mới theo cách từ chối một đơn đã tạo trước đó.
- Replay phản ánh trạng thái hiện tại của đơn, không khôi phục đơn đã hủy.
- Cùng key/nội dung khác trả 409 IDEMPOTENCY_KEY_REUSED.
- Key có phạm vi theo người thực hiện, dùng chung giữa hai luồng APP/DIRECT. Dấu nhận diện nội dung bao gồm loại luồng và dữ liệu nghiệp vụ tương ứng, không nhầm APP với DIRECT.
- Token, thời điểm retry và trường server tự tính không tham gia dấu nhận diện.
- Chỉ báo thành công sau xác nhận backend. Không tự tạo key mới khi chưa biết kết quả yêu cầu cũ.

### 8.3. Hủy, hoàn thành và gỡ bảo trì

- Hủy một đơn đã CANCELLED trả 200 sau kiểm tra quyền; không ghi đè metadata hủy.
- Hoàn thành đơn đã COMPLETED trả 200; không đổi completedAt.
- Gỡ lịch đã gỡ trả 200; không đổi người/thời điểm gỡ.
- Không hủy COMPLETED, không hoàn thành CANCELLED: 409 BOOKING_STATE_CONFLICT.
- Lần hủy đầu vẫn phải tuân thời hạn, trạng thái và validation lý do.
- Khách chỉ hủy khi còn ít nhất 24 giờ; chủ hủy trước giờ bắt đầu và bắt buộc lý do.
- Hoàn thành chỉ sau khi đến giờ kết thúc; GET không tự hoàn thành.
- Tất cả giải phóng occupancy và cập nhật trạng thái trong cùng transaction; giữ chi tiết lịch sử.

### 8.4. Xét duyệt và submissionNo

- Admin gửi submissionNo đang xem; khác hiện tại trả 409 STALE_SUBMISSION.
- Duyệt/từ chối chỉ áp dụng lần gửi PENDING.
- Gửi lại đúng quyết định đã thành công cho cùng lần gửi trả 200; không tạo review/cơ sở mới.
- Quyết định khác hoặc sửa lý do review đã lưu trả 409 APPLICATION_STATE_CONFLICT.
- Reject gửi lại yêu cầu lý do khớp bản đã ghi sau chuẩn hóa.
- Approve khóa hồ sơ, cập nhật trạng thái, ghi review/snapshot, cấp OWNER và tạo/gán cơ sở ban đầu trong cùng transaction.
- Cơ sở chưa đủ điều kiện vẫn không công khai, dù chủ đã được duyệt.

### 8.5. Context lỗi được phép

| Code | Context |
|---|---|
| SLOT_UNAVAILABLE | conflictingSlots: mảng có date, startTime, endTime; không liên hệ/mã đơn khách khác |
| PRICE_CHANGED | expectedUnitPriceVnd, currentUnitPriceVnd, currentTotalAmountVnd |
| MAINTENANCE_CONFLICT | conflictingSlots; conflictingBookings: mảng có id, bookingCode, date, startTime, endTime, chỉ của cơ sở đã kiểm tra quyền |
| VENUE_HOURS_CONFLICT | bookingIds: các đơn CONFIRMED chưa kết thúc bị ảnh hưởng, chỉ sau kiểm tra sở hữu |
| STALE_SUBMISSION | submissionNo hiện tại của hồ sơ được quyền xem |

Các lỗi khác dùng context {}. conflictingBookings có thể rỗng nếu chỉ xung đột với bảo trì khác; không trả thông tin khách trong context này.

### 8.6. Cập nhật giờ và dữ liệu lịch sử

- PATCH giờ cơ sở khóa hàng cơ sở và kiểm tra các đơn CONFIRMED chưa kết thúc. Không thu hẹp hoặc xóa giờ nếu làm vô hiệu hóa lịch đó; trả VENUE_HOURS_CONFLICT.
- Ngừng nhận đặt mới ở sân không hủy lịch hiện có, không xóa lịch sử.
- Đổi giá không sửa đơn đã xác nhận.
- Đơn DIRECT có customer_user_id NULL, không nối vào tài khoản theo điện thoại.
- Owner và khách được xem đúng đơn của mình dù tài nguyên không còn xuất hiện ở danh sách công khai.

## 9. Ví dụ request/response đặt sân

POST /api/v1/bookings, có Authorization bearer token và Idempotency-Key UUID.

Request:

```json
{
  "courtId": "33333333-3333-4333-8333-333333333333",
  "date": "2026-11-04",
  "startTime": "18:00",
  "endTime": "20:00",
  "expectedUnitPriceVnd": "120000"
}
```

Response 201:

```json
{
  "id": "44444444-4444-4444-8444-444444444444",
  "bookingCode": "BK-20261104-7X2Q",
  "venue": {
    "id": "22222222-2222-4222-8222-222222222222",
    "name": "Cầu lông Minh Anh",
    "address": "Địa chỉ cơ sở Minh Anh",
    "contactPhone": "0901234567"
  },
  "court": {
    "id": "33333333-3333-4333-8333-333333333333",
    "name": "Sân số 1"
  },
  "date": "2026-11-04",
  "startTime": "18:00",
  "endTime": "20:00",
  "slotStartTimes": ["18:00", "19:00"],
  "unitPriceVnd": "120000",
  "totalAmountVnd": "240000",
  "source": "APP",
  "status": "CONFIRMED",
  "customer": {
    "fullName": "Nguyễn Văn An",
    "phone": "0912345678"
  },
  "createdAt": "2026-11-02T03:00:00Z",
  "cancelledAt": null,
  "completedAt": null,
  "cancellationReason": null,
  "actions": {
    "canCancel": true,
    "canComplete": false
  }
}
```

Location cho ví dụ là /api/v1/me/bookings/44444444-4444-4444-8444-444444444444. Ngày/giờ là dữ liệu minh họa; canCancel tính theo thời gian backend khi trả response. Ví dụ không phải dữ liệu demo đã được tạo trong database.

## 10. Kiểm chứng hợp đồng API

- Mỗi endpoint có DTO vào/ra, validation, auth, status và lỗi; không serialize JPA entity.
- Endpoint công khai không trả dữ liệu khách đặt, tài khoản chủ hoặc dữ liệu nội bộ.
- Không response trả password hash, refresh-token hash, request hash hoặc storage key.
- Vai trò sai trả 403; tài nguyên riêng tư ngoài sở hữu hoặc sai cha–con trả 404.
- Duyệt có hiệu lực tại backend và /me, không cần tạo tài khoản mới.
- Hai yêu cầu trùng lịch chỉ một thành công; lỗi một khung rollback toàn bộ đơn.
- Replay cùng key trả cùng đơn; khác nội dung không tạo thêm đơn.
- Giá đổi phải được xác nhận lại; không tự chấp nhận giá client hoặc sửa giá đơn cũ.
- DIRECT không xuất hiện ở lịch cá nhân chỉ vì trùng điện thoại.
- Phân trang có thứ tự ổn định; trang rỗng đúng định dạng.
- PATCH không đổi sở hữu hoặc cập nhật trường ngoài danh sách.
- Hủy/gỡ khóa giữ lịch sử và cập nhật khả dụng đồng thời.
- Duyệt lặp/stale submission không duyệt nhầm nội dung mới hoặc tạo hai cơ sở.
- Token/phiên hết hạn, thu hồi, refresh và logout được kiểm tra riêng.
- Ảnh quá lớn, sai nội dung hoặc ngoài quyền truy cập bị từ chối.
- Schema/DTO, validation và ví dụ sẽ được phản ánh vào OpenAPI/Swagger khi triển khai.

Các mục trên là tiêu chí kiểm chứng cho giai đoạn lập trình, chưa phải kết quả chạy API thực tế.

## 11. Giới hạn và tài liệu tham khảo

- Không có API thanh toán, QR, push notification, bản đồ, chat, đánh giá hoặc chuyển quyền sở hữu.
- Không thêm API xóa tài khoản/cơ sở/sân hoặc tùy ý chỉnh trạng thái đơn.
- Chưa viết controller, service, DTO Java, migration hoặc frontend; chỉ lưu hợp đồng đã thống nhất.
- Không thay đổi schema đã duyệt; trường dẫn xuất trong DTO không bắt buộc thêm cột database.

Tham khảo chính thức:

- [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html).
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html).
- [RFC 8259: JSON và khả năng tương tác giữa hệ thống](https://www.rfc-editor.org/rfc/rfc8259.html).
