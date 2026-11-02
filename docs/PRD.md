# PRD — Ứng dụng Android đặt sân cầu lông

- **Phiên bản:** 1.0
- **Ngày cập nhật:** 02/11/2026
- **Trạng thái:** Đã được người dùng phê duyệt để lưu tài liệu.
- **Tên đề tài:** Xây dựng ứng dụng Android đặt sân và quản lý lịch sân cầu lông.
- **Mục tiêu thời gian:** 6–8 tuần; cần đối chiếu nguồn lực thực tế khi lập kế hoạch triển khai.
- **Phạm vi được duyệt:** Nhiều cơ sở, nhiều chủ sân; ba vai trò; chủ sân đăng ký để Admin xét duyệt; một chủ quản lý nhiều cơ sở.

Tài liệu mô tả nghiệp vụ và phạm vi sản phẩm, không phải thiết kế kỹ thuật. Việc phê duyệt tài liệu không đồng nghĩa triển khai các chức năng ngoài MVP.

## 1. Bối cảnh và mục tiêu

### 1.1. Vấn đề cần giải quyết

- Khách phải gọi điện hoặc nhắn tin để hỏi lịch trống tại các cơ sở cầu lông.
- Lịch đặt qua ứng dụng, điện thoại và tại quầy dễ bị ghi thiếu hoặc trùng nhau.
- Khách khó tra cứu lịch đã đặt và điều kiện hủy.
- Một chủ có thể kinh doanh nhiều địa điểm và cần quản lý chúng bằng cùng tài khoản.
- Nền tảng cần Admin xét duyệt người đăng ký làm chủ sân và theo dõi các chủ sân, cơ sở tương ứng.

### 1.2. Mục tiêu sản phẩm

- Khách xem cơ sở, chọn sân và giờ trống, đặt sân và quản lý lịch cá nhân.
- Chủ sân quản lý tập trung các cơ sở thuộc sở hữu, bao gồm lịch trực tuyến và trực tiếp.
- Ngăn đặt trùng, tính đúng tiền, giữ lịch sử và giới hạn quyền theo chủ sở hữu.
- Có UI rõ ràng, dễ dùng trên Android và luồng demo hoàn chỉnh cho bài tập lớn.

### 1.3. Công nghệ đã chọn

| Thành phần | Công nghệ |
|---|---|
| Frontend Android | React Native, TypeScript, Expo |
| Backend | Java, Spring Boot |
| Database | PostgreSQL |
| Công cụ phát triển | Android Studio Emulator, VS Code, Codex CLI |

## 2. Thuật ngữ và mô hình nghiệp vụ

| Thuật ngữ | Ý nghĩa |
|---|---|
| Cơ sở | Một địa điểm kinh doanh cầu lông, có địa chỉ và thông tin riêng |
| Sân | Một sân chơi vật lý bên trong một cơ sở |
| Chủ sân | Người được Admin duyệt, có thể sở hữu nhiều cơ sở |
| Khung giờ | Một khoảng đặt sân dài 60 phút |
| Đơn đặt sân | Một lượt đặt gồm một hoặc nhiều khung liên tiếp, cùng sân và cùng ngày |
| Hồ sơ chủ sân | Yêu cầu của người dùng để được cấp quyền chủ sân, kèm thông tin cơ sở ban đầu |

Quan hệ sở hữu: **Một chủ sân → nhiều cơ sở → mỗi cơ sở có nhiều sân.** Mỗi cơ sở chỉ có một chủ sở hữu. Khoảng cách giữa các cơ sở không ảnh hưởng quyền sở hữu.

Ví dụ: chủ A sở hữu cơ sở Minh Anh và Minh Anh 2 tại hai địa chỉ khác nhau. Cả hai có thể có sân mang tên “Sân số 1”; lịch và giá của các sân này độc lập.

## 3. Nhóm người dùng và phân quyền

| Nhóm | Quyền chính |
|---|---|
| Khách chưa đăng nhập | Xem cơ sở, sân, giá và lịch trống |
| Khách hàng | Đặt sân, xem/hủy đơn của mình; gửi và theo dõi hồ sơ đăng ký chủ sân |
| Chủ sân | Giữ khả năng sử dụng như khách hàng; thêm cơ sở và quản lý thông tin, sân, giá, lịch đặt, bảo trì tại cơ sở thuộc sở hữu |
| Admin | Xem và xét duyệt hồ sơ chủ sân; tra cứu chủ sân và cơ sở tương ứng |

- Khách chưa đăng nhập là trạng thái sử dụng, không phải vai trò tài khoản.
- “Chờ duyệt” là trạng thái hồ sơ, không phải vai trò.
- Đăng ký công khai chỉ tạo tài khoản khách hàng. Tài khoản Admin được cấp sẵn.
- Chủ sân chỉ được cấp quyền sau khi Admin chấp thuận hồ sơ.
- Admin không có chức năng xử lý thay chủ sân các đơn đặt, giá hoặc lịch bảo trì trong MVP.
- Thông tin liên hệ người đặt chỉ hiển thị cho người sở hữu đơn, nếu có tài khoản, và chủ sở hữu cơ sở nhận đơn.
- Backend phải kiểm tra cả vai trò và quyền sở hữu. Ẩn chức năng trên giao diện không thay thế việc kiểm tra này.

## 4. Phạm vi và quy ước MVP

| Nội dung | Quy định |
|---|---|
| Quy mô | Nhiều cơ sở và nhiều chủ sân; một chủ được sở hữu nhiều cơ sở |
| Giao diện | Ba vai trò sử dụng cùng ứng dụng Android, giao diện theo quyền |
| Đăng ký chủ sân | Người dùng gửi hồ sơ; Admin chấp thuận hoặc từ chối |
| Cơ sở ban đầu | Tạo và gán cho người đăng ký đồng thời khi hồ sơ được chấp thuận |
| Cơ sở bổ sung | Chủ đã được duyệt tự tạo thêm; không cần xét duyệt lại từng cơ sở |
| Hiển thị cơ sở cho khách | Có thông tin bắt buộc, giờ hoạt động hợp lệ và ít nhất một sân đang nhận đặt có giá hợp lệ |
| Giờ hoạt động | Cố định theo từng cơ sở, giống nhau mỗi ngày, không qua đêm |
| Khung giờ | 60 phút; cho phép đặt nhiều khung liên tiếp |
| Phạm vi một đơn | Một sân, một ngày, các khung liên tiếp |
| Khoảng ngày đặt | Hôm nay và sáu ngày tiếp theo; giờ bắt đầu phải ở tương lai |
| Xác nhận đơn | Đặt thành công là xác nhận ngay, không chờ chủ sân duyệt |
| Giá MVP | Một mức giá theo giờ cho từng sân; VND nguyên đồng |
| Thanh toán | Tại sân, ngoài luồng xử lý của ứng dụng MVP |
| Hủy của khách | Còn ít nhất 24 giờ trước giờ bắt đầu |
| Hủy của chủ sân | Trước giờ bắt đầu, phải ghi lý do |
| Kết nối | Cần Internet để xem lịch mới nhất và thực hiện đặt/hủy |

Việc duyệt hồ sơ chủ sân độc lập với xác nhận đơn đặt sân. Không bổ sung bước chủ sân duyệt từng đơn.

## 5. Danh sách chức năng và ưu tiên

- **Must Have:** Bắt buộc để nghiệm thu MVP, gồm M01–M15.
- **Should Have:** Xem xét sau khi MVP hoàn chỉnh; chưa thuộc phạm vi triển khai.
- **Could Have:** Tùy chọn giai đoạn sau; chưa thuộc phạm vi triển khai.

### 5.1. Must Have: user stories và tiêu chí nghiệm thu

#### M01 — Đăng ký, đăng nhập, đăng xuất và phân quyền

**User story:** Là người dùng, tôi muốn đăng nhập để sử dụng đúng chức năng của mình và bảo vệ dữ liệu thuộc quyền quản lý.

**Tiêu chí nghiệm thu:**

- Đăng ký bằng họ tên, email, số điện thoại và mật khẩu; email tài khoản không được trùng.
- Tài khoản mới là khách hàng; không thể tự chọn quyền chủ sân hoặc Admin trong yêu cầu đăng ký.
- Đăng nhập hợp lệ mở giao diện tương ứng; thông tin sai được thông báo rõ ràng.
- Đăng xuất khiến thao tác cần xác thực yêu cầu đăng nhập lại.
- Gửi yêu cầu trực tiếp đến backend cũng không thể truy cập chức năng sai vai trò hoặc dữ liệu ngoài quyền sở hữu.

#### M02 — Xem danh sách cơ sở và thông tin sân

**User story:** Là khách, tôi muốn xem các cơ sở, địa chỉ, hình ảnh, tiện ích và giá sân để chọn nơi chơi.

**Tiêu chí nghiệm thu:**

- Khách xem được danh sách cơ sở đủ điều kiện hiển thị, chọn cơ sở rồi xem các sân bên trong.
- Chi tiết cơ sở có tên, địa chỉ, số liên hệ và giờ hoạt động; chi tiết sân có tên, ảnh, mô tả, tiện ích và giá theo giờ.
- Có thao tác chuyển sang lịch trống của đúng cơ sở và sân.
- Sân ngừng nhận đặt không nằm trong danh sách cho phép đặt mới; không làm mất thông tin trong đơn cũ.
- Màn hình có trạng thái tải, rỗng, lỗi và thao tác thử lại khi phù hợp.

#### M03 — Xem lịch trống

**User story:** Là khách, tôi muốn biết sân nào còn trống theo ngày và giờ để chọn lịch phù hợp.

**Tiêu chí nghiệm thu:**

- Chọn được ngày trong phạm vi cho phép; lịch xác định rõ cơ sở và sân.
- Khung giờ có nhãn phân biệt còn trống, đã đặt, bảo trì; không chỉ dựa vào màu.
- Khung đã bắt đầu, ngoài giờ hoạt động hoặc không trống không được chọn.
- Lịch công khai không lộ thông tin liên hệ người đã đặt.
- Có thể tải lại lịch; lịch được cập nhật sau thao tác đặt/hủy thành công.

#### M04 — Đặt sân

**User story:** Là khách hàng, tôi muốn chọn sân và giờ rồi xác nhận để có lịch chơi được ghi nhận.

**Tiêu chí nghiệm thu:**

- Chỉ chọn các khung liên tiếp thuộc cùng một sân, cùng ngày; yêu cầu đăng nhập trước khi đặt.
- Trước xác nhận, hiển thị cơ sở, địa chỉ, sân, ngày, giờ bắt đầu/kết thúc, số giờ, đơn giá, tổng tiền và chính sách hủy.
- Backend kiểm tra lại quyền đặt, thời gian, trạng thái sân, tình trạng khung và giá.
- Thành công tạo mã đặt sân duy nhất với trạng thái “Đã xác nhận”.
- Nếu một khung bị xung đột, toàn bộ yêu cầu thất bại, không tạo đơn một phần.
- Hai yêu cầu trùng sân và giờ không thể cùng thành công, kể cả một yêu cầu do chủ sân nhập trực tiếp.
- Gửi lại cùng yêu cầu do bấm lặp hoặc mạng chập chờn không tạo đơn trùng.
- Nếu giá thay đổi so với báo giá, hiển thị giá mới và yêu cầu khách xác nhận lại.

#### M05 — Xem lịch đặt cá nhân

**User story:** Là khách hàng, tôi muốn xem các lịch mình đã đặt để chuẩn bị đi chơi và kiểm tra lịch sử.

**Tiêu chí nghiệm thu:**

- Có danh sách lịch sắp tới và lịch đã qua/đã hủy; chỉ hiển thị đơn thuộc tài khoản hiện tại.
- Chi tiết có mã đặt, cơ sở, địa chỉ, sân, ngày giờ, số tiền và trạng thái.
- Đơn bị chủ sân hủy hiển thị lý do.
- Chưa có đơn thì có thông báo và thao tác đi đặt sân.
- Qua giờ không tự đổi trạng thái thành hoàn thành.

#### M06 — Khách hủy lịch

**User story:** Là khách hàng, tôi muốn hủy lịch khi kế hoạch thay đổi và còn trong thời hạn cho phép.

**Tiêu chí nghiệm thu:**

- Chỉ hủy đơn của mình ở trạng thái “Đã xác nhận”, còn ít nhất 24 giờ đến giờ bắt đầu.
- Có bước xác nhận trước khi hủy; hủy toàn bộ đơn, không hủy riêng từng khung.
- Thành công chuyển trạng thái “Đã hủy”, giải phóng các khung và giữ đơn trong lịch sử.
- Quá hạn hủy hiển thị lý do và thông tin liên hệ cơ sở; backend cũng từ chối thao tác.

#### M07 — Quản lý sân và giá

**User story:** Là chủ sân, tôi muốn quản lý các sân và giá tại cơ sở của mình để khách thấy thông tin đúng.

**Tiêu chí nghiệm thu:**

- Chọn được cơ sở thuộc sở hữu rồi thêm/sửa tên sân, mô tả, ảnh, tiện ích và giá theo giờ.
- Tên sân không trùng trong cùng cơ sở; được trùng giữa hai cơ sở. Giá phải lớn hơn 0.
- Được chuyển sân sang ngừng nhận đặt mới; không tự hủy các đơn đã có.
- Không xóa mất dữ liệu sân có lịch sử đặt; đơn cũ vẫn tra cứu được.
- Giá mới chỉ áp dụng đơn mới; đơn đã xác nhận giữ giá đã lưu.
- Không được tạo/sửa sân tại cơ sở của người khác, kể cả bằng cách thay mã cơ sở trong yêu cầu.

#### M08 — Quản lý đơn đặt sân

**User story:** Là chủ sân, tôi muốn xem và xử lý lịch đặt tại các cơ sở của mình để điều hành hoạt động.

**Tiêu chí nghiệm thu:**

- Chọn cơ sở, xem lịch theo ngày, sân và trạng thái; chỉ thấy dữ liệu thuộc quyền quản lý.
- Chi tiết gồm liên hệ khách, thời gian, số tiền và nguồn đặt: ứng dụng hoặc trực tiếp.
- Đơn “Đã xác nhận” chỉ chuyển sang “Hoàn thành” sau giờ kết thúc.
- Chủ sân được hủy đơn “Đã xác nhận” trước giờ bắt đầu với lý do bắt buộc, kể cả khi khách đã quá hạn tự hủy.
- Hủy giải phóng các khung; khách thấy trạng thái và lý do mới khi tải lại đơn.
- Đơn “Đã hủy” hoặc “Hoàn thành” không được chuyển lại “Đã xác nhận”.

#### M09 — Tạo lịch cho khách trực tiếp

**User story:** Là chủ sân, tôi muốn nhập lịch nhận qua điện thoại hoặc tại quầy để ứng dụng phản ánh đúng số chỗ còn trống.

**Tiêu chí nghiệm thu:**

- Nhập tên, số điện thoại khách, cơ sở, sân, ngày và các khung liên tiếp; khách không cần có tài khoản.
- Chỉ chọn sân tại cơ sở thuộc sở hữu; áp dụng cùng quy tắc giá, thời gian và chống trùng như đặt qua ứng dụng.
- Thành công tạo đơn “Đã xác nhận”, nguồn “Trực tiếp”; các khung không còn khả dụng cho người khác.
- Không tự gắn đơn trực tiếp vào tài khoản chỉ vì trùng số điện thoại.

#### M10 — Khóa và gỡ khóa bảo trì

**User story:** Là chủ sân, tôi muốn khóa thời gian sân không sử dụng được để khách không đặt nhầm.

**Tiêu chí nghiệm thu:**

- Chọn sân thuộc cơ sở của mình, ngày, các khung tương lai và nhập lý do.
- Khung bị khóa không nhận đặt qua ứng dụng hoặc nhập trực tiếp.
- Không được khóa khoảng đang có đơn còn hiệu lực; hiển thị các đơn xung đột để chủ sân xử lý trước.
- Kiểm tra xung đột vẫn đúng khi thao tác đặt và khóa diễn ra đồng thời.
- Gỡ khóa tính lại lịch khả dụng; không khôi phục đơn từng bị hủy.

#### M11 — Gửi hồ sơ đăng ký chủ sân

**User story:** Là người có cơ sở cầu lông, tôi muốn gửi hồ sơ để được cấp quyền quản lý cơ sở trên ứng dụng.

**Tiêu chí nghiệm thu:**

- Người dùng phải đăng nhập; email hồ sơ lấy từ tài khoản.
- Hồ sơ bắt buộc có họ tên liên hệ, số điện thoại, tên cơ sở ban đầu, địa chỉ và mô tả ngắn.
- Gửi hợp lệ tạo hồ sơ “Chờ duyệt”; không tự cấp quyền chủ sân.
- Mỗi tài khoản có tối đa một hồ sơ đang chờ duyệt; gửi lặp không tạo hồ sơ trùng.
- Chủ sân đã được duyệt sử dụng chức năng thêm cơ sở, không đăng ký lại quyền chủ sân.

#### M12 — Theo dõi kết quả và gửi lại hồ sơ

**User story:** Là người đăng ký, tôi muốn biết trạng thái và lý do từ chối để bổ sung thông tin khi cần.

**Tiêu chí nghiệm thu:**

- Chỉ xem hồ sơ của mình; hiển thị “Chờ duyệt”, “Đã duyệt” hoặc “Bị từ chối”.
- Bị từ chối phải hiển thị lý do; người dùng được sửa và gửi lại, chuyển về “Chờ duyệt”.
- Không sửa hồ sơ đang chờ duyệt hoặc đã được duyệt.
- Gửi lại vẫn giữ lịch sử kết quả xét duyệt trước đó.
- Đang chờ hoặc bị từ chối không làm mất khả năng sử dụng tài khoản khách hàng.

#### M13 — Admin xét duyệt hồ sơ

**User story:** Là Admin, tôi muốn xem và chấp thuận hoặc từ chối hồ sơ để kiểm soát việc cấp quyền chủ sân.

**Tiêu chí nghiệm thu:**

- Chỉ Admin xem danh sách/chi tiết xét duyệt và xử lý hồ sơ “Chờ duyệt”.
- Từ chối bắt buộc ghi lý do.
- Chấp thuận đồng thời cấp quyền chủ sân và tạo cơ sở ban đầu thuộc người đăng ký.
- Nếu xử lý thất bại, không để trạng thái đã duyệt/cấp quyền nhưng chưa tạo và gán được cơ sở.
- Duyệt lặp không tạo cơ sở trùng; hai thao tác xét duyệt đồng thời chỉ có một kết quả hợp lệ.
- Lưu người xét duyệt, thời điểm và kết quả xét duyệt.
- Cơ sở ban đầu chưa hiển thị cho khách cho đến khi đáp ứng điều kiện thông tin, giờ hoạt động và sân nhận đặt.

#### M14 — Admin tra cứu chủ sân và cơ sở

**User story:** Là Admin, tôi muốn biết từng chủ sân đang sở hữu những cơ sở nào để quản lý danh sách trên nền tảng.

**Tiêu chí nghiệm thu:**

- Xem được danh sách chủ sân đã duyệt, thông tin liên hệ và tất cả cơ sở của từng chủ.
- Bao gồm cả cơ sở ban đầu và cơ sở do chủ tạo thêm.
- Thông tin chủ sở hữu khớp với kết quả duyệt hoặc người tạo cơ sở bổ sung.
- Khách và chủ sân không được truy cập danh sách quản trị này.

#### M15 — Chủ sân quản lý nhiều cơ sở

**User story:** Là chủ sân đã được duyệt, tôi muốn thêm và quản lý nhiều cơ sở bằng cùng một tài khoản để điều hành các địa điểm kinh doanh của mình.

**Tiêu chí nghiệm thu:**

- Cùng một tài khoản tạo được ít nhất hai cơ sở tại các địa chỉ khác nhau; không cần Admin xét duyệt lại quyền hoặc từng cơ sở bổ sung.
- Cơ sở mới tự thuộc chủ đang tạo; không được tự gán sang tài khoản khác.
- Chủ xem danh sách cơ sở của mình và cập nhật thông tin như tên, địa chỉ, liên hệ, mô tả, ảnh, tiện ích và giờ hoạt động.
- Mỗi cơ sở có danh sách sân, giá và lịch riêng; chuyển cơ sở hiển thị đúng dữ liệu cơ sở được chọn.
- Tạo/sửa tại một cơ sở không làm thay đổi dữ liệu cơ sở khác. Thay đổi thông tin hoặc giờ hoạt động không được làm mất hay vô hiệu hóa lịch đã xác nhận.
- Cơ sở chỉ xuất hiện cho khách khi đáp ứng điều kiện tại mục 4.
- Chủ khác không được truy cập chức năng quản lý của các cơ sở này; không có chức năng tự đổi chủ sở hữu.

### 5.2. Should Have — Ngoài MVP

#### S01 — Giá theo khung giờ

**User story:** Là chủ sân, tôi muốn áp dụng giá giờ thường và giờ cao điểm tại sân của mình.

**Tiêu chí nghiệm thu khi được đưa vào triển khai:**

- Cấu hình giá theo khung; khung chưa cấu hình dùng giá cơ bản.
- Tổng đơn bằng tổng giá từng khung, được hiển thị rõ trước khi xác nhận.
- Đơn đã xác nhận giữ nguyên giá khi cấu hình thay đổi.
- Chỉ chủ sở hữu được cấu hình giá của sân.

#### S02 — Ghi nhận thanh toán tại sân

**User story:** Là chủ sân, tôi muốn đánh dấu đã thu tiền để theo dõi việc thanh toán từng đơn.

**Tiêu chí nghiệm thu khi được đưa vào triển khai:**

- Trạng thái thanh toán tách biệt trạng thái đơn.
- Chỉ chủ sở hữu cơ sở được xác nhận thu đủ tiền cho đơn hoàn thành; lưu thời điểm xác nhận.
- Thao tác lặp không tạo lần thu mới; khách chỉ xem, không tự đánh dấu đã trả.
- Đây là ghi nhận thủ công, không xử lý giao dịch tiền hoặc hoàn tiền.

### 5.3. Could Have — Ngoài MVP

Các tham số vận hành của mục này sẽ được chốt nếu được duyệt triển khai sau này.

#### C01 — Nhắc lịch trên điện thoại

**User story:** Là khách hàng, tôi muốn được nhắc trước giờ chơi để hạn chế quên lịch.

**Tiêu chí nghiệm thu dự kiến:** Có quyền thông báo thì lên lịch nhắc trước giờ chơi theo khoảng thời gian được chốt; không tạo nhắc trùng khi mở lại ứng dụng; gỡ nhắc khi ứng dụng ghi nhận đơn đã hủy; từ chối quyền không cản trở đặt sân.

#### C02 — Check-in bằng QR

**User story:** Là chủ sân, tôi muốn quét mã đặt sân để ghi nhận khách đến.

**Tiêu chí nghiệm thu dự kiến:** QR xác định đúng đơn; chỉ chủ cơ sở nhận đơn được check-in đơn còn hiệu lực; lưu thời điểm; mã sai, đơn đã hủy hoặc đã check-in có thông báo; quét lặp không ghi nhận trùng.

#### C03 — Thống kê hoạt động

**User story:** Là chủ sân, tôi muốn xem số đơn và số giờ sử dụng tại cơ sở của mình để đánh giá hoạt động.

**Tiêu chí nghiệm thu dự kiến:** Chọn cơ sở thuộc sở hữu và khoảng ngày; số đơn theo trạng thái và số giờ của đơn hoàn thành khớp dữ liệu nguồn; không tính đơn hủy vào giờ sử dụng; không có dữ liệu hiển thị 0.

## 6. Quy tắc nghiệp vụ

| Mã | Quy tắc |
|---|---|
| BR01 | Một chủ có nhiều cơ sở, mỗi cơ sở có một chủ, mỗi sân thuộc một cơ sở. |
| BR02 | Tất cả lịch theo giờ Việt Nam; backend quyết định thời gian hợp lệ. |
| BR03 | Khung dài 60 phút trong giờ hoạt động và cùng ngày. 18–19 giờ và 19–20 giờ là hai khung liền kề, không trùng. |
| BR04 | Cho phép đặt hôm nay và sáu ngày tiếp theo; giờ bắt đầu phải ở tương lai. |
| BR05 | Một đơn chỉ chứa một sân và các khung liên tiếp trong một ngày. Khác sân hoặc khoảng rời nhau phải tạo đơn riêng. |
| BR06 | Một sân chỉ có tối đa một đơn còn hiệu lực ở mỗi khung. Áp dụng cả đặt trực tuyến và trực tiếp. |
| BR07 | Chọn khung trên giao diện chưa giữ chỗ. Chỗ được ghi nhận khi backend xác nhận thành công. |
| BR08 | Đơn nhiều khung thành công toàn bộ hoặc thất bại toàn bộ. |
| BR09 | Tổng tiền MVP bằng đơn giá theo giờ nhân số khung; dùng VND nguyên đồng. Backend tính và lưu giá lúc đặt. |
| BR10 | Giá thay đổi so với báo giá phải được người đặt xác nhận lại; không sửa tiền đơn đã xác nhận. |
| BR11 | Khách chỉ hủy toàn bộ đơn của mình khi còn ít nhất 24 giờ đến giờ bắt đầu. |
| BR12 | Chủ sở hữu được hủy trước giờ bắt đầu, bắt buộc ghi lý do. Không hủy đơn đã bắt đầu. |
| BR13 | Không sửa sân, ngày hoặc giờ trên đơn đã xác nhận; muốn đổi phải hủy theo chính sách và đặt mới. |
| BR14 | Chủ xác nhận hoàn thành sau giờ kết thúc; hệ thống không tự suy luận khách đã chơi. |
| BR15 | Ngừng nhận đặt mới hoặc đổi giá không tự hủy hay thay đổi các đơn đã tồn tại. |
| BR16 | Bảo trì không chồng lên đơn còn hiệu lực; gỡ bảo trì không khôi phục đơn đã hủy. |
| BR17 | Lịch công khai chỉ thể hiện khả dụng, không lộ thông tin người đặt. |
| BR18 | Chỉ Admin duyệt quyền chủ sân. Người đăng ký không tự thay trạng thái hồ sơ hoặc quyền tài khoản. |
| BR19 | Hồ sơ chờ duyệt không được sửa; hồ sơ bị từ chối được sửa và gửi lại, có giữ lịch sử xét duyệt. |
| BR20 | Chấp thuận hồ sơ đồng thời cấp quyền và tạo/gán cơ sở ban đầu; không được hoàn tất một phần. |
| BR21 | Chủ đã duyệt được tạo nhiều cơ sở; mỗi cơ sở bổ sung tự thuộc chủ tạo, không xét duyệt lại. |
| BR22 | Không có chức năng tự đổi chủ sở hữu. Vai trò và quyền sở hữu phải được kiểm tra ở backend cho mọi thao tác quản lý. |
| BR23 | Tên sân chỉ cần duy nhất trong cùng cơ sở; hai cơ sở có thể cùng có “Sân số 1”. |
| BR24 | Cơ sở chưa đủ thông tin, giờ hoạt động hoặc chưa có sân nhận đặt với giá hợp lệ không xuất hiện cho khách đặt mới. |
| BR25 | Đơn trực tiếp không tự liên kết tài khoản bằng số điện thoại. |

### 6.1. Vòng đời đơn đặt sân

```text
Đặt thành công → Đã xác nhận → Hoàn thành
                            ↘ Đã hủy
```

“Hoàn thành” và “Đã hủy” là trạng thái kết thúc. MVP chưa xử lý riêng khách không đến và không có trạng thái chờ chủ sân duyệt đơn.

### 6.2. Vòng đời hồ sơ chủ sân

```text
Gửi hồ sơ → Chờ duyệt → Đã duyệt
                     ↘ Bị từ chối → Sửa và gửi lại → Chờ duyệt
```

“Đã duyệt” kết thúc việc đăng ký quyền chủ sân. Các cơ sở bổ sung được quản lý qua M15.

## 7. Luồng sử dụng chính

### 7.1. Đăng ký và xét duyệt chủ sân

1. Người dùng đăng ký hoặc đăng nhập tài khoản khách hàng.
2. Chọn đăng ký làm chủ sân, nhập liên hệ và cơ sở ban đầu, gửi hồ sơ.
3. Admin xem hồ sơ chờ duyệt.
4. Chấp thuận: cấp quyền chủ sân và tạo/gán cơ sở ban đầu đồng thời.
5. Từ chối: ghi lý do; người dùng đọc, sửa và gửi lại nếu muốn.
6. Chủ được duyệt bổ sung thông tin cơ sở, giờ hoạt động, sân và giá để đủ điều kiện xuất hiện cho khách.

### 7.2. Chủ sân thêm cơ sở

1. Chủ đã được duyệt mở danh sách cơ sở của mình.
2. Tạo cơ sở mới với thông tin và địa chỉ riêng.
3. Hệ thống tự gán quyền sở hữu cho người tạo.
4. Chủ thêm sân, giá và hoàn thiện thông tin cần thiết.
5. Cơ sở đủ điều kiện xuất hiện trong danh sách cho khách; không cần duyệt lại.
6. Chủ chuyển giữa các cơ sở để quản lý sân và lịch tương ứng.

### 7.3. Khách đặt sân

1. Xem danh sách và chọn cơ sở.
2. Xem thông tin, chọn ngày, sân và các khung liên tiếp.
3. Đăng nhập nếu cần.
4. Kiểm tra địa điểm, lịch, giá và chính sách hủy; xác nhận.
5. Backend kiểm tra lại thời gian, khả dụng và giá.
6. Thành công: nhận mã đặt và xem đơn trong lịch cá nhân.
7. Khung bị đặt mất: cập nhật lịch để chọn lại. Giá thay đổi: hiển thị và yêu cầu xác nhận lại.

### 7.4. Khách hủy lịch

1. Mở lịch cá nhân và chọn đơn còn hiệu lực.
2. Yêu cầu hủy; hệ thống kiểm tra chủ đơn và thời hạn.
3. Người dùng xác nhận; đơn chuyển “Đã hủy”, khung được giải phóng.
4. Quá hạn: thông báo và hiển thị liên hệ của đúng cơ sở.

### 7.5. Chủ sân nhập lịch trực tiếp

1. Chọn cơ sở thuộc sở hữu, sân, ngày và giờ trống.
2. Nhập tên và số điện thoại khách; kiểm tra giá rồi xác nhận.
3. Backend kiểm tra quyền và chống trùng; tạo đơn nguồn “Trực tiếp”.
4. Khung tương ứng không còn khả dụng cho người khác.

### 7.6. Bảo trì và hoàn tất lượt chơi

- **Bảo trì:** Chủ chọn sân thuộc sở hữu, giờ và lý do; xử lý các đơn xung đột trước; khóa các khung. Khi gỡ khóa, hệ thống tính lại khả dụng.
- **Hoàn thành:** Chủ chọn đơn tại cơ sở của mình đã qua giờ kết thúc, xác nhận hoàn thành; khách và chủ xem được trạng thái mới.

## 8. Phạm vi màn hình MVP

| Nhóm | Màn hình/luồng |
|---|---|
| Chung | Đăng ký, đăng nhập; giao diện theo vai trò |
| Khách hàng | Danh sách cơ sở; chi tiết cơ sở/sân; lịch trống; xác nhận đặt; danh sách/chi tiết đơn; xác nhận hủy |
| Đăng ký chủ sân | Form hồ sơ; trạng thái, lý do từ chối; sửa và gửi lại |
| Chủ sân | Danh sách/thêm/sửa cơ sở; danh sách/thêm/sửa sân và giá; lịch theo cơ sở/ngày; chi tiết/xử lý đơn; nhập lịch trực tiếp; khóa/gỡ bảo trì |
| Admin | Danh sách/chi tiết hồ sơ và xét duyệt; danh sách/chi tiết chủ sân cùng các cơ sở |

Ưu tiên UI: dễ nhận biết đang xem cơ sở nào; bảng lịch có nhãn trạng thái; giá và địa chỉ rõ trước xác nhận; thao tác đặt ngắn gọn; thông báo lỗi dễ hiểu. Mỗi vai trò sử dụng dữ liệu nhất quán theo đúng quyền.

## 9. Chức năng chưa triển khai

- S01–S02 và C01–C03 khi chưa có phê duyệt mở rộng.
- Bản đồ, GPS, tìm sân gần vị trí.
- Cổng thanh toán, đặt cọc, hoàn tiền.
- Đặt lịch cố định hằng tuần/tháng hoặc giờ bắt đầu/kết thúc tùy ý.
- Giữ chỗ tạm có đếm ngược; chủ sân duyệt từng đơn đặt.
- Hủy một phần đơn, đổi lịch trực tiếp, trạng thái khách không đến.
- Mã giảm giá, điểm thưởng, thành viên.
- Chat, đánh giá sân, ghép người chơi.
- Quản lý nhân viên, khóa tài khoản chủ sân, chuyển quyền sở hữu hoặc xử lý khiếu nại.
- Đăng nhập mạng xã hội, OTP, tự khôi phục mật khẩu.
- Xác minh danh tính, tải giấy tờ, quy trình duyệt riêng từng cơ sở bổ sung.
- Lịch mở cửa khác nhau theo ngày, ngoại lệ ngày lễ, hoạt động qua đêm.
- Đặt sân ngoại tuyến hoặc đồng bộ thao tác đặt khi có mạng trở lại.

## 10. Tiêu chí nghiệm thu chung và kịch bản kiểm tra

### 10.1. Luồng nghiệp vụ

- Khách đăng ký, xem cơ sở, đặt, xem và hủy đơn đúng chính sách.
- Người dùng gửi hồ sơ; Admin từ chối có lý do; người dùng sửa/gửi lại; Admin duyệt thành công.
- Duyệt tạo đúng một cơ sở và cấp quyền, kể cả khi gửi lại yêu cầu.
- Chủ đã duyệt tạo và quản lý được hai cơ sở, không cần duyệt lại.
- Chủ nhập lịch trực tiếp, quản lý giá, bảo trì và hoàn thành lượt chơi đúng quyền.

### 10.2. Tính nhất quán và xung đột

- Hai yêu cầu đặt cùng sân/cùng giờ chỉ một thành công; gồm trường hợp khách đặt và chủ nhập trực tiếp.
- Đơn nhiều khung thất bại toàn bộ nếu một khung xung đột.
- Đặt và khóa bảo trì đồng thời không tạo lịch chồng lấn.
- Hai sân cùng tên ở hai cơ sở không ảnh hưởng lịch của nhau.
- Đổi giá không sửa đơn cũ; giá thay đổi lúc đặt phải được xác nhận lại.
- Hủy và gỡ bảo trì phản ánh đúng lịch khi tải lại.
- Kiểm tra biên: đúng giờ bắt đầu, ngày cuối được đặt, ngoài giờ hoạt động và đúng mốc hủy 24 giờ.

### 10.3. Phân quyền

- Khách không xem/sửa đơn người khác hoặc dùng chức năng chủ sân/Admin.
- Người chờ duyệt hoặc bị từ chối chưa có quyền quản lý cơ sở.
- Chủ A quản lý được cả hai cơ sở của mình nhưng không xem dữ liệu quản lý hoặc sửa sân, giá, đơn, bảo trì của chủ B.
- Chủ không tự đổi chủ sở hữu, tự duyệt hồ sơ hoặc cấp quyền.
- Các kiểm tra trên phải đúng cả khi gọi trực tiếp backend với mã dữ liệu khác.

### 10.4. Trải nghiệm và bản demo

- Dữ liệu mới nhất xuất hiện khi tải lại; không hiển thị đặt thành công khi chưa nhận xác nhận.
- Mất kết nối trong lúc đặt có cách kiểm tra lại đơn mà không tạo trùng.
- Màn hình dữ liệu có trạng thái tải/rỗng/lỗi và thông báo lỗi nhập liệu rõ ràng.
- Có bản Android cài đặt, kết nối backend và dữ liệu demo được.
- Bộ dữ liệu demo gồm Admin, khách hàng, ít nhất hai chủ sân; một chủ có ít nhất hai cơ sở; hồ sơ chờ duyệt/bị từ chối/đã duyệt; đơn và lịch bảo trì đủ thể hiện các luồng.

## 11. Quản lý phạm vi và các điểm cho bước lập kế hoạch

- MVP được nghiệm thu theo M01–M15 và các quy tắc trong tài liệu này.
- Should Have/Could Have là danh sách tham khảo, không phải cam kết triển khai.
- Mọi chức năng ngoài phạm vi phải được người dùng xem xét trước khi bổ sung.
- Số thành viên, kinh nghiệm và thời gian làm mỗi tuần chưa được cung cấp; mục tiêu 6–8 tuần chưa phải cam kết tiến độ.
- Giờ mở/đóng cửa cụ thể và nội dung mẫu của các cơ sở sẽ được xác định khi chuẩn bị dữ liệu; không làm phát sinh nghiệp vụ lịch linh hoạt ngoài MVP.

## 12. Lịch sử thống nhất

1. Chọn ứng dụng Android đặt sân cầu lông và bộ công nghệ nêu trên.
2. Xem PRD dự kiến với chức năng, ưu tiên, user stories, quy tắc, luồng và tiêu chí nghiệm thu.
3. Chuyển từ giả định một cơ sở sang nền tảng nhiều cơ sở, nhiều chủ sân và bổ sung Admin.
4. Chọn chủ sân tự đăng ký, Admin xét duyệt.
5. Bỏ giới hạn một cơ sở cho một chủ; chủ đã duyệt được tự thêm và quản lý nhiều cơ sở.
6. Người dùng xác nhận chốt nội dung và yêu cầu tạo `docs/PRD.md`.
