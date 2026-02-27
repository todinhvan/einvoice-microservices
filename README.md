# E-Invoice Microservices

## 1. Giới thiệu project
E-Invoice là một hệ thống hóa đơn điện tử được thiết kế theo kiến trúc Microservices. Dự án cung cấp các dịch vụ liên quan đến quản lý người dùng, sản phẩm, thanh toán, tạo và quản lý hóa đơn, gửi email, và lưu trữ tài liệu. Hệ thống được phát triển trong một Nx workspace nhằm tối ưu hóa việc quản lý và chia sẻ thư viện dùng chung (monorepo).

## 2. Tài liệu kỹ thuật và công nghệ sử dụng
Hệ thống sử dụng các công nghệ và thư viện hiện đại để đảm bảo hiệu suất, bảo mật và khả năng mở rộng:

**Ngôn ngữ & Framework:**
- **Node.js** & **TypeScript**
- **NestJS**: Framework chính xây dựng các microservices.
- **Nx**: Quản lý monorepo workspace (`nx`, `@nx/nest`).

**Cơ sở dữ liệu & Caching:**
- **PostgreSQL** (thông qua TypeORM): Cơ sở dữ liệu quan hệ (relational).
- **MongoDB** (thông qua Mongoose): Cơ sở dữ liệu NoSQL cho các dữ liệu phi cấu trúc.
- **Redis**: Phục vụ caching và tính năng Rate Limiting (Throttler).

**Giao tiếp giữa các Microservices:**
- **gRPC** & **Kafka**: Cho việc giao tiếp nội bộ giữa các service đòi hỏi hiệu suất cao và xử lý kiến trúc hướng sự kiện (Event-driven).
- **REST API** / **BFF (Backend for Frontend)**: Cung cấp Web API trực tiếp cho các client.

**Bảo mật & Xác thực:**
- **Keycloak**: Nền tảng Identity and Access Management (IAM) chuyên nghiệp.
- **JWT (JSON Web Token)** & **Bcrypt**: Xác thực và mã hóa.

**Observability, Logging & Monitoring:**
- **Prometheus** & **Grafana**: Thu thập và trực quan hóa các metrics hệ thống.
- **Loki** & **Promtail**: Phân tích và quản lý centralized logs.
- **Tempo** & **OpenTelemetry**: Distributed tracing (theo dõi lời gọi qua lại giữa các microservices).
- **Pino**: Công cụ logging phân tán hiệu năng cao.

**Các thư viện/Dịch vụ khác:**
- **Stripe**: Tích hợp thanh toán trực tuyến.
- **Cloudinary**: Lưu trữ phương tiện và tệp (media).
- **Puppeteer**: Sinh (generate) file PDF cho các hóa đơn.
- **Nodemailer**: Gửi email thông báo cho người dùng.

## 3. Cấu trúc dự án
Dự án theo kiến trúc Nx monorepo với cấu trúc thư mục chính như sau:

```text
einvoice-microservices/
├── apps/                        # Chứa mã nguồn các microservices độc lập
│   ├── authorizer               # Dịch vụ phân quyền và xác thực
│   ├── bff                      # Backend for Frontend (Cổng giao tiếp chính cho UI)
│   ├── invoice                  # Dịch vụ quản lý hóa đơn điện tử
│   ├── mail                     # Dịch vụ gửi email thông báo
│   ├── media                    # Dịch vụ quản lý tệp đính kèm và phương tiện
│   ├── payment                  # Dịch vụ xử lý thanh toán (Stripe)
│   ├── pdf-generator            # Dịch vụ tạo PDF hóa đơn (Sử dụng Puppeteer)
│   ├── product                  # Dịch vụ quản lý sản phẩm
│   └── user-access              # Dịch vụ quản lý quyền truy cập người dùng
├── libs/                        # Chứa các thư viện và code dùng chung (interfaces, utils, dto...)
├── docker/                      # Cấu hình file Docker Compose và Infrastructure
│   ├── docker-compose.provider.yaml # Chứa Database, Kafka, Redis, Monitoring...
│   └── docker_data/             # Thư mục map volumes (dữ liệu cục bộ của DB/v.v.)
├── package.json                 # Quản lý dependencies (pnpm)
└── nx.json                      # Cấu hình của hệ sinh thái Nx
```

## 4. Hướng dẫn cài đặt và sử dụng

### Yêu cầu hệ thống
- **Node.js**: (Bản tương thích, nên sử dụng bản LTS/version dựa trên `pnpm`).
- **pnpm**: Package manager ưu tiên của dự án.
- **Docker** & **Docker Compose**: Máy tính cần cài sẵn Docker để boot các Backing services.

### Các bước cài đặt

**Bước 1: Clone dự án và cài dependencies**
```sh
# Clone dự án về máy
git clone <repository_url>
cd einvoice-microservices

# Cài đặt các gói phụ thuộc (dependencies)
pnpm install
```

**Bước 2: Khởi chạy môi trường Infrastructure (Docker)**
Hệ thống yêu cầu các thành phần nền tảng (databases, broker, monitoring) trước khi có thể chạy API.
```sh
# Mở các dịch vụ nền tảng (Postgres, Mongo, Keycloak, Kafka, Redis, Grafana, v.v...)
# ở chế độ chạy ngầm (-d)
docker compose -f docker-compose.provider.yaml up -d
```
*Lưu ý: Dữ liệu docker được mount với folder local tại `./docker/docker_data/`.*

**Bước 3: Chạy các Microservices**
Để làm việc trên môi trường phát triển (Dev local), sử dụng các câu lệnh sau:
```sh
# Để khởi chạy tất cả các microservices hiện có
pnpm dev

# Hoặc khởi chạy một cấu hình nhỏ nhẹ (VD: chỉ bật BFF và Invoice app)
pnpm dev-lite

# Hoặc chạy cục bộ một service cụ thể bằng Nx (cú pháp chuẩn nx: npx nx serve <app-name>)
npx nx serve invoice
```

### Các lệnh hữu ích khác từ Nx CLI

**Build ứng dụng phục vụ Production:**
```sh
# Build 1 app (VD: bff)
npx nx build bff
```

**Xem biểu đồ phụ thuộc (Dependency Graph):**
Lệnh này mở giao diện trên trình duyệt giúp hình dung sự trao đổi dữ liệu và chia sẻ mã nguồn giữa các thư viện và `apps`.
```sh
npx nx graph
```

**Liệt kê các module đang có:**
```sh
npx nx show projects
```
