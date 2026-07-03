# Lộ trình học Automation & Performance Testing

Nền tảng sẵn có: manual QC, API testing, database. Mục tiêu: thành thạo
Playwright (API + UI), k6 và JMeter, tích hợp AI vào quy trình test.

> Cách dùng tài liệu này: mỗi giai đoạn có bài tập. Làm xong bài nào, tick vào
> ô đó và commit — lịch sử commit chính là bằng chứng học tập trên CV.

## Giai đoạn 1 — JavaScript + API automation (tuần 1-4)

Kiến thức: biến, hàm, object/array, `async/await`, JSON.

- [ ] Đọc hiểu toàn bộ `tests/api/auth.spec.ts` và `booking-crud.spec.ts`
- [ ] Thêm test cho `GET /booking?firstname=...` (filter theo tên)
- [ ] Thêm negative test: `PATCH /booking/:id` không có token → expect 403
- [ ] Thêm test cho `PUT /booking/:id` (update toàn bộ)
- [ ] Tự viết lại file `booking-crud.spec.ts` từ đầu mà không nhìn bản gốc

## Giai đoạn 2 — UI automation với Playwright (tuần 5-10)

Kiến thức: locator (ưu tiên `getByRole`), auto-wait, Page Object Model, fixture.

- [ ] Đọc hiểu `tests/ui/login.spec.ts` và `checkout.spec.ts`
- [ ] Thêm test: sort sản phẩm theo giá và verify thứ tự
- [ ] Thêm test: remove sản phẩm khỏi cart
- [ ] Refactor sang Page Object Model (`pages/login.page.ts`, `pages/inventory.page.ts`)
- [ ] Dùng `storageState` để login một lần cho cả suite
- [ ] Chạy test trên CI và đọc HTML report artifact

## Giai đoạn 3 — Performance testing với k6 (tuần 11-14)

Kiến thức: load vs stress vs spike vs soak, VU, throughput, p90/p95/p99,
threshold, cách đọc kết quả.

- [ ] Cài k6 (`winget install k6.k6`) và chạy `performance/k6/smoke-api.js`
- [ ] Giải thích được từng dòng output của k6 (http_req_duration, iterations...)
- [ ] Viết load test dùng `stages` (ramp-up → steady → ramp-down)
- [ ] Viết spike test và quan sát error rate
- [ ] Dựng một app local (ví dụ restful-booker chạy bằng Docker) để bắn load thật

## Giai đoạn 4 — JMeter (tuần 15-18)

- [ ] Cài Java + JMeter, dựng test plan đầu tiên bằng GUI
- [ ] Tái hiện scenario của `smoke-api.js` bằng JMeter → so sánh 2 tool
- [ ] Dùng CSV Data Set Config để parameterize dữ liệu
- [ ] Chạy CLI mode và generate HTML dashboard report
- [ ] Viết một bài so sánh k6 vs JMeter (đăng LinkedIn — content cho profile!)

## Giai đoạn 5 — AI-assisted testing (tuần 19+)

- [ ] Setup Playwright MCP + Playwright Agents (`npx playwright init-agents --loop=claude`)
- [ ] Dùng Planner agent tạo test plan cho SauceDemo, so sánh với plan tự viết
- [ ] Dùng Generator agent sinh test, review và sửa những chỗ AI làm dở
- [ ] Cố tình làm hỏng một locator, dùng Healer agent tự sửa
- [ ] Viết bài chia sẻ trải nghiệm AI testing (LinkedIn)

## Nguyên tắc

1. **AI là mentor, không phải người học hộ** — nhờ AI generate, nhưng phải
   giải thích được từng dòng và tự viết lại được.
2. **Commit thường xuyên** — mỗi bài tập xong là một commit có message rõ ràng.
3. **Chỉ bắn load vào hệ thống mình sở hữu hoặc được phép.**
