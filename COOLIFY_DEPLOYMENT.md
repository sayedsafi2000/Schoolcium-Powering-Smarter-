# Coolify Deployment Guide — Schoolcium

## Services & Ports

| Service | Description        | Internal Port |
|---------|--------------------|---------------|
| mongo   | MongoDB database   | 27017         |
| backend | Express API        | 5000          |
| admin   | Admin Panel (Next) | 3000          |
| website | Public Website     | 3001          |

---

## Step 1 — Push to GitHub

Make sure your repo is public (or connected via Coolify's Git source).

```bash
git add .
git commit -m "Add Docker + Coolify deployment config"
git push origin main
```

---

## Step 2 — Create Project in Coolify

1. Coolify Dashboard → **New Project**
2. Add a new **Resource** → **Docker Compose**
3. Connect your GitHub repo
4. Set **Docker Compose Location**: `docker-compose.coolify.yml`

---

## Step 3 — Set Environment Variables

In Coolify UI → **Environment Variables**, add:

```
MONGO_ROOT_USER=schoolcium
MONGO_ROOT_PASS=your_strong_password_here

MONGODB_URI=mongodb://schoolcium:your_strong_password_here@mongo:27017/school-management?authSource=admin

JWT_SECRET=generate-with-openssl-rand-base64-64

CLOUDINARY_CLOUD_NAME=domn2k79e
CLOUDINARY_API_KEY=382733537575279
CLOUDINARY_API_SECRET=X8Lqo_AbMGsrSefDBzQk46aDJ40

CORS_ORIGIN=https://admin.yourdomain.com,https://yourdomain.com

NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
WEBSITE_API_URL=https://api.yourdomain.com/api
```

---

## Step 4 — Set Domains in Coolify UI

> ⚠️ Include the internal container port in the domain field — this tells Traefik which port to proxy to.

| Service | Domain field in Coolify              |
|---------|---------------------------------------|
| backend | `https://api.yourdomain.com:5000`     |
| admin   | `https://admin.yourdomain.com:3000`   |
| website | `https://yourdomain.com:3001`         |

---

## Step 5 — Deploy

Click **Deploy**. Coolify will:
1. Pull your repo
2. Build all 4 Docker images
3. Start containers
4. Route traffic via Traefik

---

## Local Testing (before pushing)

```bash
# Copy and fill in your values
cp .env.example .env

# Start everything locally with host ports exposed
docker compose -f docker-compose.yml -f docker-compose.local.yml up --build

# Access:
# Backend  → http://localhost:5000
# Admin    → http://localhost:3000
# Website  → http://localhost:3001
```

---

## Useful Commands

```bash
# View logs
docker compose logs -f

# View logs for one service
docker compose logs -f backend

# Restart one service
docker compose restart backend

# Stop everything
docker compose down

# Stop and remove volumes (WARNING: deletes MongoDB data)
docker compose down -v
```

---

## First Admin User

After first deploy, register via:
```
POST https://api.yourdomain.com/api/auth/register
{
  "username": "admin",
  "password": "YourPassword123",
  "role": "admin"
}
```
Then login at `https://admin.yourdomain.com`
