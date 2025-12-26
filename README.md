# DevOps Monorepo – Frontend, Backend, Database, CI/CD, And Monitoring

Repository ini merupakan **monorepo** yang berisi **Frontend (Vue.js + TypeScript)**, **Backend (Express.js + TypeScript)**, dan **Database (PostgreSQL)** yang telah didockerisasi serta dilengkapi **pipeline CI/CD menggunakan GitHub Actions**.

Fokus utama proyek ini adalah:
- Docker & Docker Compose
- CI/CD Pipeline
- Deployment readiness (VM via SSH)
- Health Check pada Container (Frontend, Backend, dan Database)
- Komunikasi Frontend ↔ Backend
- Monitoring dengan Grafana & Prometheus

---

## 📁 Struktur Repository

```
/
├── fe/                           # Frontend (Vue 3 + TypeScript)
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .env.example
│   └── src/
│       ├── main.ts
│       └── App.vue
│
├── be/                           # Backend (Express.js + TypeScript)
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── index.ts
│
├── db/                           # Database (PostgreSQL)
│   ├── Dockerfile
│   └── init.sql
│
├── monitoring/                   # Monitoring dengan Grafana & Prometheus
│   ├── grafana/
│   │   └── data/
│   ├── prometheus/
│   │   └── prometheus.yml
│   └── docker-compose.yml
│
├── nginx/                        # Conf Nginx Reverse Proxy
│   └── nginx.conf
│
├── docker-compose.yml            # Orkestrasi container
├── .gitignore
├── README.md
└── .github/
  └── workflows/
    └── pipeline.yml          # GitHub Actions CI/CD
```

---

## 🐳 Penjelasan Dockerfile

### 1️⃣ Backend (`be/Dockerfile`)
- Menggunakan **Node.js Alpine** untuk image yang ringan
- Build TypeScript → JavaScript
- Menjalankan Express di port `3000`

**Fungsi utama:**
- Menyediakan API untuk FE dan akses service DB dengan endpoint `/api/info`
- Health check `/api/health`
- Mengaktifkan **CORS & security (helmet)**

### 2️⃣ Frontend (`fe/Dockerfile`)
- Build Vue menggunakan **Vite**
- Menggunakan **multi-stage build** untuk optimasi ukuran image
- Image final menggunakan **Nginx** untuk serving static files

Frontend akan mengakses backend melalui:
```env
VITE_API_URL=http://backend:3000/api
```

### 3️⃣ Database (`db/Dockerfile`)
- Menggunakan image resmi **PostgreSQL**
- Menggunakan **init.sql** untuk inisialisasi tabel & data awal
- Environment variable database di-set saat container start

---

## 🧩 Docker Compose (`docker-compose.yml`)

Docker Compose digunakan untuk:
- Menjalankan FE, BE, dan DB secara bersamaan
- Mengatur dependency & health check
- Memastikan komunikasi antar service

**Service yang tersedia:**
- `db` → PostgreSQL (port `5432`)
- `backend` → Express API (port `3000`)
- `frontend` → Vue App (port `80`)

**Komunikasi internal menggunakan service name Docker:**
- FE → `http://backend:3000/api`
- BE → `db:5432`

---

## 🔁 CI/CD Pipeline (GitHub Actions)

Pipeline berada di:
```
.github/workflows/pipeline.yml
```

### Tahapan Pipeline:
1. **Checkout code**
2. **Login ke Docker Hub**
3. **Build image**
   - Frontend
   - Backend
   - Database
4. **Push image ke Docker Registry**
5. **Deploy ke VM via SSH (docker-compose)**

> ⚠️ **Catatan:** Jika VM belum tersedia, step deploy dapat di-comment namun pipeline tetap valid.

---

## 🚀 Cara Menjalankan Aplikasi (LOCAL)

### 1️⃣ Prasyarat
- Docker Desktop (Windows/Mac/Linux)
- Git
- Port `80` & `3000` tidak bentrok

### 2️⃣ Clone Repository
```bash
git clone https://github.com/gilanggustina/knitto-devops-test.git
cd knitto-devops-test
```

### 3️⃣ Jalankan Docker Compose
```bash
docker compose up -d --build
```

### 4️⃣ Akses Aplikasi

**Frontend:**
```
👉 http://localhost
```

**Backend health check:**
```
👉 http://localhost:3000/api/health
```

**API komunikasi FE ↔ BE:**
```
👉 http://localhost:3000/api/info
```

### 5️⃣ Stop Aplikasi
```bash
docker compose down
```

---

## 🔗 Contoh Komunikasi FE ↔ BE

### Endpoint Backend
```
GET /api/info
```

### Response:
```json
{
  "service": "backend",
  "message": "Backend berhasil diakses dari Frontend",
  "user": "DevOps User"
}
```

Frontend akan fetch endpoint tersebut menggunakan:
```javascript
import.meta.env.VITE_API_URL
```

---

## 🚀 Deployment via CI/CD

### Secrets GitHub yang Dibutuhkan:

**Docker Hub:**
- `DOCKER_USER`
- `DOCKER_PASS`

**VM 1 (Primary):**
- `SSH_VM1_HOST`
- `SSH_VM1_PORT`
- `SSH_VM1_USER`
- `SSH_VM1_PRIVATE_KEY`

**VM 2 (Secondary):**
- `SSH_VM2_HOST`
- `SSH_VM2_PORT`
- `SSH_VM2_USER`
- `SSH_VM2_PRIVATE_KEY`

### Pipeline akan:
1. Build & push image ke Docker Hub
2. Pull image di VM
3. Menjalankan `docker compose up -d`
4. Melakukan health check

---

## 📊 Monitoring

Monitoring menggunakan **Grafana** dan **Prometheus** untuk memantau:
- Resource usage (CPU, Memory, Disk)
- Container health status
- Application metrics
- System performance

Akses monitoring dashboard setelah menjalankan `docker-compose.yml` di folder `monitoring/`.

---

## ✅ Fitur Tambahan (Nilai Plus)

- ✅ Health check FE / BE / DB
- ✅ Environment variable FE (`VITE_API_URL`)
- ✅ CORS & security (helmet)
- ✅ Docker multi-stage build
- ✅ Monorepo clean structure
- ✅ CI/CD production-ready
- ✅ Monitoring dengan Grafana dan Prometheus
- ✅ Nginx reverse proxy

---

## 📌 Catatan

Proyek ini tidak fokus pada fitur bisnis, melainkan:
- **Docker & Containerization**
- **CI/CD Automation**
- **Deployment Strategy**
- **Infrastructure Readiness**
- **Health Check Service**
- **Monitoring & Observability**

Sesuai dengan spesifikasi **Technical Test – DevOps** (Docker, Docker Compose, CI/CD, Monitoring, Health Check).

---

## 👥 Contributors

<table>
  <tr>
  <td align="center">
    <a href="https://github.com/gilanggustina">
    <img src="https://github.com/gilanggustina.png" width="100px;" alt="Cahaya Gilang Gustina"/>
    <br />
    <sub><b>Cahaya Gilang Gustina</b></sub>
    </a>
    <br />
    <sub>DevOps Engineer</sub>
  </td>
  </tr>
</table>

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy Coding! 🚀**
