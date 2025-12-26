# DevOps Monorepo – Frontend, Backend, Database, CI/CD

Repository ini merupakan **monorepo** yang berisi **Frontend (Vue.js + TypeScript)**, **Backend (Express.js + TypeScript)**, dan **Database (PostgreSQL)** yang telah didockerisasi serta dilengkapi **pipeline CI/CD menggunakan GitHub Actions**.

Fokus utama proyek ini adalah:
- Docker & Docker Compose
- CI/CD Pipeline
- Deployment readiness (VM via SSH)
- Komunikasi Frontend ↔ Backend

---

## 📁 Struktur Repository

```
/
├── fe/                      # Frontend (Vue 3 + TypeScript)
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .env.example
│   └── src/
│       ├── main.js
│       └── App.vue
│
├── be/                      # Backend (Express.js + TypeScript)
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── index.ts
│
├── db/                      # Database (PostgreSQL)
│   ├── Dockerfile
│   └── init.sql
│
├── docker-compose.yml       # Orkestrasi container
├── .gitignore
└── .github/
  └── workflows/
    └── pipeline.yml     # GitHub Actions CI/CD
```

---

## 🐳 Dockerfile Penjelasan

### 1️⃣ Backend (`be/Dockerfile`)
- Menggunakan **Node.js Alpine**
- Build TypeScript → JavaScript
- Menjalankan Express di port `3000`

Fungsi utama:
- Menyediakan API untuk FE dan akses service DB dengan endpoint `/api/info`
- Health check `/api/health`
- Mengaktifkan **CORS & security (helmet)**

### 2️⃣ Frontend (`fe/Dockerfile`)
- Build Vue menggunakan **Vite**
- Menggunakan **multi-stage build**
- Image final menggunakan **Nginx**

Frontend akan mengakses backend melalui:
```env
VITE_API_URL=http://backend:3000
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

Service yang tersedia:
- `db` → PostgreSQL
- `backend` → Express API
- `frontend` → Vue App (port `80`)

Komunikasi internal menggunakan **service name Docker**:
- FE → `http://backend:3000`
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

> ⚠️ Jika VM belum tersedia, step deploy dapat di-comment namun pipeline tetap valid.

---

## 🚀 Cara Menjalankan Aplikasi (LOCAL)

### 1️⃣ Prasyarat
- Docker Desktop (Windows)
- Git
- Port `80` & `3000` tidak bentrok

### 2️⃣ Clone Repository
```bash
git clone https://github.com/username/devops-monorepo.git
cd devops-monorepo
```

### 3️⃣ Jalankan Docker Compose
```bash
docker compose up -d --build
```

### 4️⃣ Akses Aplikasi

**Frontend:**
👉 http://localhost

**Backend health check:**
👉 http://localhost:3000/health

**API komunikasi FE ↔ BE:**
👉 http://localhost:3000/api/message

---

## 🔗 Contoh Komunikasi FE ↔ BE

### Endpoint Backend
```
GET /api/message
```

### Response:
```json
{
  "message": "Hello from Backend"
}
```

Frontend akan fetch endpoint tersebut menggunakan:
```javascript
import.meta.env.VITE_API_URL
```

---

## 🚀 Deployment via CI/CD

### Secrets GitHub yang Dibutuhkan:
- `DOCKER_USER`
- `DOCKER_PASS`
- `VM_IP`
- `VM_USER`
- `SSH_PRIVATE_KEY`

### Pipeline akan:
1. Build & push image ke Docker Hub
2. Pull image di VM
3. Menjalankan `docker compose up -d`

---

## ✅ Fitur Tambahan (Nilai Plus)

- Health check FE / BE / DB
- Environment variable FE (`VITE_API_URL`)
- CORS & security (helmet)
- Docker multi-stage build
- Monorepo clean structure
- CI/CD production-ready

---

## 📌 Catatan

Proyek ini tidak fokus pada fitur bisnis, melainkan:
- Docker
- CI/CD
- Deployment
- Infrastructure readiness

Sesuai dengan spesifikasi Technical Test – DevOps (Docker, Docker Compose, CI/CD).
