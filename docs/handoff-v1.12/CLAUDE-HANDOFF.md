# ComboFlow — bàn giao cho Claude

Ngày xuất: 17/10/2026. Phiên bản prototype: **v1.12**.

## 1. Mở và sử dụng gói này

- Mở `ComboFlow-standalone.html` bằng Chrome, Edge hoặc Safari để chạy toàn bộ prototype offline. Ảnh, font, CSS, JavaScript và tài liệu validation được nhúng trong file.
- Gửi cho Claude file HTML, tài liệu này và ZIP nếu môi trường của Claude nhận ZIP. Nếu chỉ nhận một file, gửi HTML và dán yêu cầu ở mục 8.
- Để chỉnh sửa tiếp trong VS Code, giải nén và mở thư mục `source/`. Chỉnh các file tách riêng rồi tạo lại HTML; tránh sửa hai bản độc lập.
- `previews/` chứa ảnh chụp bản hiện tại. Storyboard người dùng, nếu có, là tham khảo thị giác; không sao chép chữ tiếng Việt hoặc các claim vận hành trong ảnh.

**Lần xuất này chỉ đóng gói và viết hướng dẫn. Không thay đổi mã prototype, không tạo lại website, không xuất bản thêm phiên bản.** HTML ở thư mục gốc giống từng byte với HTML trong source. Source là toàn bộ file được Git theo dõi ở commit dưới đây, giữ nguyên nội dung và cấu trúc. Không bao gồm lịch sử Git hay thông tin xác thực.

## 2. Định danh bản hiện tại

- Commit: `48e6e408023a0406c119a17c232e44a066802050`
- Sites project: `appgprj_6acfc6a18a048191a8661b4fcb9a39b4`
- Sites saved version: 11; version ID: `appgprj_6acfc6a18a048191a8661b4fcb9a39b4~appgver_685fb36785f481919cc6462aff89f6a6`
- URL: https://comboflow-kiosk-pos-prototype.whitemochi4.chatgpt.site/
- Mã nguồn trong gói là bản local v1.12 đã được dùng cho lần triển khai thành công ngày 17/10/2026, không phải mã được tái dựng từ ảnh chụp hoặc HTML công khai.
- `MANIFEST.sha256` kiểm tra tính toàn vẹn từng file; `EXPORT-INFO.json` ghi thông tin xuất.

## 3. Đã có trong phiên bản này

### Customer Kiosk

- Hai lối vào: **Help me choose** nổi bật và **I know what I want** mở menu đầy đủ.
- Chọn số người 1/2/4; ngân sách dựa trên ngưỡng VND 100,000 và 200,000 nhân số người; ưu tiên Best Fit / Best Value / Fastest to Serve.
- Lọc hợp lệ và minimum Fit trước khi hiển thị tối đa ba combo, với một lựa chọn chính lớn hơn.
- Chọn combo → **Customize your combo**: Original/Spicy khi phù hợp; Pepsi/7UP/Mirinda khi combo có nước.
- **Best add-ons for this combo**: tối đa một món phụ phù hợp, có ADD hoặc SKIP; giá thêm dùng cách diễn đạt “Just VND … more”. Không thêm tự động.
- Trạng thái đã chọn màu xanh lá; tiền tiết kiệm có nhãn DEMO COMPARISON, dựa trên giá tham chiếu mô phỏng cùng nội dung món.
- Review → xác nhận của người dùng. Lựa chọn vị/nước có trong review, xác nhận, event log và mô tả ticket.

### Staff POS và customer display

- Nhập món và chỉnh số lượng; cập nhật một gợi ý theo giỏ hàng.
- Kiểm tra hợp lệ, basket compatibility, nguyên liệu đã được giữ cho đơn chờ và mức độ phục vụ được.
- Ưu tiên phần ăn đã sẵn sàng được nhân viên kiểm tra, rồi khối lượng công việc tại trạm, khả năng dùng chung thành phần với đơn đang chuẩn bị, service class và giá. Không dùng margin.
- Màn hình khách hàng song song hiển thị món, giá, tổng, giảm giá đã áp dụng, gợi ý chưa được thêm và trạng thái đơn; không lộ thông tin vận hành nội bộ.
- Savings của POS chỉ hiện khi ưu đãi demo hợp lệ được nhân viên áp dụng. Thêm món phụ không tự tạo tiết kiệm.
- ADD/SKIP → review → xác nhận. Sau xác nhận, nội dung và tổng tiền được chốt.

### Kitchen dashboard

- Dashboard ngang, thiết kế cho 16:9; hàng đợi, tuổi ticket, nhóm đơn, nguyên liệu, ready items, gợi ý shared prep và phần mô phỏng xu hướng.
- Manager có thể chọn trạng thái Normal/Elevated/High/Safe fallback và chỉnh số lượng ready items.
- Ready items nằm trong lượng nguyên liệu hiện có, không cộng thêm tồn kho. Confirm giữ phần ready tương ứng; Start preparing trừ nguyên liệu một lần.
- Shared prep chỉ là đề xuất nhóm các đơn hiện có; người phụ trách kiểm tra và bắt đầu, không tự nấu hoặc tự phá FIFO.
- **High chặn tất cả upsell** ở kiosk và POS, kể cả món sẵn sàng và branch B. Main-meal ordering vẫn có thể tiếp tục nếu hợp lệ.

## 4. Các nguyên tắc bắt buộc giữ

1. Tên solution duy nhất: **ComboFlow**. Toàn bộ giao diện bằng tiếng Anh.
2. Nhãn chính xác: **Simulated Contextual Ranking (pre-scripted decision table)**. Prototype là heuristic, không phải learned AI.
3. Pipeline: **Rules → Contextual Ranking → Load Gate → Human Decision**. Validity, stock, promotion và minimum Fit không được bỏ qua để upsell.
4. Tối đa **3 gợi ý combo + 1 optional add-on**. Menu đầy đủ là lối chọn thủ công riêng.
5. Primary load signal: **Median waiting-ticket age**. Các band và forecast là simulated/shadow-mode assumptions, không phải capacity model đã kiểm chứng. Không hiện utilization giả hoặc hứa thời gian phục vụ thực.
6. High luôn suppress upsell. Stale kitchen signal tắt workload/ready ranking; POS dùng fixed valid rules với staff check, kiosk tạm dừng extras. Không diễn giải stale như bếp rảnh.
7. Không hiện margin, internal Fit score hoặc kitchen utilization cho khách/nhân viên. Không có contribution data thì bỏ Business Value; nếu bổ sung sau này chỉ là tie-breaker.
8. Luôn có ADD/SKIP và review/confirm của con người. Không chọn thêm món, áp dụng giảm giá hay xác nhận âm thầm.
9. Món, giá, khẩu phần chưa xác minh giữ **[Verify KFC VN menu]**. Không tạo số tiền tiết kiệm nếu thiếu giá so sánh cùng nội dung hợp lệ. Giá mô phỏng không phải giá KFC đã xác thực.
10. Documentation giữ phân biệt A = current KFC flow; B = rules-only; C_sim = contextual heuristic prototype; H_live = heuristic pilot thực; C_AI = learned ranking tương lai. AI gate tương lai phải so C_AI với H_live.
11. Không tuyên bố có user-test results, doanh thu tăng, giảm waste, payback, live integration hoặc prediction accuracy khi chưa có bằng chứng.
12. Không đổi/publish Sites đang hoạt động nếu người dùng chưa yêu cầu bước triển khai mới.

## 5. Bản đồ mã nguồn và cách chỉnh sửa

| File | Vai trò |
|---|---|
| `source/dist/index.html` | Trang đầu và liên kết tài nguyên |
| `source/dist/style.css` | Toàn bộ CSS; các khối v1.12 nằm cuối file |
| `source/dist/app.js` | UI, state, kiosk customization, POS, customer mirror, kitchen view |
| `source/dist/engine.js` | Validity, Fit, heuristic ranking, quote và savings |
| `source/dist/kitchen.js` | Dữ liệu bếp giả lập, nguyên liệu, ready ranking, nhóm shared prep |
| `source/dist/assets/` | Ảnh/logo tham khảo, font Oswald/Roboto và giấy phép font |
| `source/dist/validation.md` | Decision table, scenario set, KPI mapping, giả định và governance |
| `source/dist/test-log-template.csv` | Mẫu log validation chưa điền kết quả nghiên cứu |
| `source/logic-tests.cjs`, `source/kitchen-tests.cjs` | Kiểm tra logic |
| `source/build-delivery.py` | Tạo validation.html, HTML offline và ZIP |
| `source/qa/QA-SUMMARY.md` | Ghi chép engineering QA theo phiên bản |
| `source/.openai/hosting.json` | Cấu hình project/static hosting hiện có; không tự deploy |

Đây là HTML/CSS/JavaScript thuần, không có React/TypeScript/backend hoặc bước cài npm. HTML standalone và validation.html là sản phẩm được tạo từ source.

Chạy tại thư mục `source/`, cần Node và Python 3:

```sh
node --check dist/app.js
node --check dist/kitchen.js
node logic-tests.cjs
node kitchen-tests.cjs
python3 build-delivery.py
python3 -m http.server 8765 --directory dist
```

Mở `http://localhost:8765/`. Nếu cổng bận, dùng cổng khác. Build ghi lại `dist/ComboFlow-standalone.html`, `dist/validation.html` và tạo `ComboFlow-prototype.zip` ở thư mục cha của source. Sau build, copy HTML mới ra vị trí bàn giao nếu cần; bản HTML ở gốc gói không tự cập nhật.

## 6. Kiểm tra đã làm và giới hạn hiện tại

Engineering QA trước khi xuất đã kiểm tra syntax, logic matrix, kiosk chọn vị/nước → thêm món → review/confirm; POS đổi giỏ → đổi gợi ý; High chặn upsell; ready count đổi sau confirm; dashboard 1366×768 và customization mobile 390×844. Chi tiết ở QA-SUMMARY và validation. Đây không phải nghiên cứu khách hàng/nhân viên hoặc dữ liệu bếp thực.

Các giới hạn phải nói rõ:

- Dữ liệu và customer mirror dùng bộ nhớ trong cùng trang; reload bắt đầu lại. Chưa có đồng bộ hai thiết bị, backend, thanh toán hoặc POS/KDS thật.
- Original/Spicy và loại nước là lựa chọn UI mô phỏng, giá trung tính. Ingredient ledger vẫn dùng recipe chung, chưa hạch toán nguyên liệu riêng theo variant.
- Ready counts do người dùng thao tác bằng fixture; chưa có kiểm tra tự động về tuổi món, holding time hay food safety.
- Dự báo bếp là mô phỏng giả định; không phải mô hình được huấn luyện hoặc kiểm định.
- Trong POS hiện tại, ADD/SKIP chuyển sang review; quay lại chỉnh basket có thể xóa extra đã chấp nhận. Đừng mô tả như một giỏ hàng linh hoạt hoàn chỉnh.
- Tài liệu có lịch sử phiên bản. Nếu thấy mâu thuẫn về High từng cho phép món short-prep, **mục 21 v1.12 thay thế hành vi cũ: High chặn mọi upsell**. Đọc tests và code hiện tại trước khi sửa.
- Giấy phép OFL đi kèm font. Logo/ảnh KFC là tài sản thương hiệu tham khảo, không phải tài sản do prototype sở hữu; giữ nguồn và nhãn minh họa.

## 7. Đề xuất chỉnh tiếp — CHƯA THỰC HIỆN trong lần bàn giao này

Ưu tiên theo thứ tự, không thêm feature ngoài yêu cầu:

1. **Rà bố cục theo storyboard**: làm màn customization gọn hơn, giữ hình món rõ, chữ lựa chọn lớn và thao tác chạm dễ. Giữ ba combo/một extra, không mở rộng thành nhiều upsell.
2. **QA Staff POS** tại 1366×768, 1600×1000 và mobile: menu nhập món, recommendation, basket, customer mirror; thử mở/đóng workload details. Chỉ sửa overflow/spacing sau khi tái hiện, không suy luận từ ảnh viewport đang chuyển kích thước.
3. **Tối ưu chỉnh giỏ liên tục**: nếu cần cho phép tiếp tục nhập món sau ADD, giữ extra chỉ khi còn hợp lệ; cập nhật quote/customer mirror tức thời và vẫn cần review/confirm. Không thêm lại món đã SKIP mà không có hành động rõ ràng.
4. **Variant mapping**: nếu cần mô phỏng sâu hơn, thêm bảng fixture availability/recipe cho vị gà và loại nước; đánh dấu simulated, không tự xem đây là recipe KFC thật. Bảo vệ phép trừ tồn kho và confirm lặp.
5. **Ready-item governance**: chỉ thêm freshness/holding-time bằng dữ liệu hoặc giả định được ghi rõ. Không dùng món tồn để bỏ qua Fit, availability hoặc an toàn thực phẩm.
6. **Dọn tài liệu lịch sử**: làm rõ policy v1.12 là hiện hành, giữ changelog riêng; đối chiếu KPI còn tranh chấp với nguồn gốc trước khi chốt. Không tự biến pilot targets thành observed results.

Acceptance checks sau bất kỳ chỉnh sửa nào: English-only; 3+1; zero auto-add; High zero upsell; stale fallback; promotion expired; unavailable item; no eligible recommendation; manual menu; manager suppression; savings đúng cả kiosk/POS; customer display không lộ nội bộ; tổng tiền khớp; variant giữ đúng; confirm không trừ hai lần; mobile không tràn ngang; standalone chạy offline; không publish tự động.

## 8. Prompt gửi Claude

> Tôi gửi source và HTML hiện tại của ComboFlow v1.12 cùng CLAUDE-HANDOFF.md. Trước tiên hãy đọc hướng dẫn, xem source và cho biết bạn đã nhận đủ file. Đây là bản có sẵn cần tiếp tục, không tạo lại từ đầu. Đối chiếu storyboard theo phong cách KFC nhưng giữ English-only, simulated heuristic, tối đa 3 combo + 1 optional add-on, human checkpoint, High chặn tất cả upsell và nhãn [Verify KFC VN menu]. Các đề xuất ở mục 7 CHƯA được triển khai. Hãy đề xuất phạm vi sửa cụ thể từ mục 7 để tôi chọn trước; chưa sửa, chưa deploy hoặc thay đổi Site hiện tại ở bước tiếp nhận. Khi tôi yêu cầu thực hiện, sửa source tách riêng, chạy checks, tạo lại HTML offline và trả bản HTML + source ZIP cùng danh sách thay đổi. Không bịa dữ liệu thực hoặc savings, không dùng claim trong ảnh làm bằng chứng vận hành.
