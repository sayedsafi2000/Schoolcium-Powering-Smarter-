# Coolify Deployment Guide — Schoolcium

## Live URLs

| Service      | URL                                               |
|--------------|---------------------------------------------------|
| Public Site  | https://schoolcium.pixelsbee.com                  |
| Admin Panel  | https://schoolciumadmin.pixelsbee.com             |
| Backend API  | https://schoolciumserver.pixelsbee.com            |

## Service Ports

| Service | Description        | Internal Port |
|---------|--------------------|---------------|
| mongo   | MongoDB database   | 27017 (internal only) |
| backend | Express API        | 5000          |
| admin   | Admin Panel (Next) | 3000          |
| website | Public Website     | 3001          |

---

## Step 1 — Push to GitHub (public repo)

```bash
git add .
git commit -m "chore: add Docker + Coolify deployment config"
git push origin main
```

---

## Step 2 — Create Project in Coolify

1. Coolify Dashboard → **New Project**
2. Add Resource → **Docker Compose**
3. Connect your GitHub repo
4. **Docker Compose Location**: `docker-compose.coolify.yml`

---

## Step 3 — Set Domains in Coolify UI

> ⚠️ You MUST include the internal container port in the domain field.
> This tells Traefik's reverse proxy which port to forward traffic to.

| Service | Domain field in Coolify                         |
|---------|-------------------------------------------------|
| backend | `https://schoolciumserver.pixelsbee.com:5000`   |
| admin   | `https://schoolciumadmin.pixelsbee.com:3000`    |
| website | `https://schoolcium.pixelsbee.com:3001`         |

---

## Step 4 — Set Environment Variables in Coolify UI

Go to **Environment Variables** tab and add:

```
MONGO_ROOT_USER=schoolcium
MONGO_ROOT_PASS=<your strong password>

MONGODB_URI=mongodb://schoolcium:<your strong password>@mongo:27017/school-management?authSource=admin

JWT_SECRET=<run: openssl rand -base64 64>
JWT_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=domn2k79e
CLOUDINARY_API_KEY=382733537575279
CLOUDINARY_API_SECRET=X8Lqo_AbMGsrSefDBzQk46aDJ40

CORS_ORIGIN=https://schoolciumadmin.pixelsbee.com,https://schoolcium.pixelsbee.com

NEXT_PUBLIC_API_URL=https://schoolciumserver.pixelsbee.com/api
WEBSITE_API_URL=https://schoolciumserver.pixelsbee.com/api
```

---

## Step 5 — Deploy

Click **Deploy**. Coolify will:
1. Pull your GitHub repo
2. Build all 4 Docker images (`mongo`, `backend`, `admin`, `website`)
3. Start containers in the correct order (mongo → backend → admin + website)
4. Route HTTPS traffic via Traefik

---

## Step 6 — Create First Admin User

After deploy, register once via API:

```bash
curl -X POST https://schoolciumserver.pixelsbee.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YourStrongPassword","role":"admin"}'
```

Then login at: **https://schoolciumadmin.pixelsbee.com**

---

## Local Testing

```bash
# Copy env template
cp .env.example .env
# Edit .env with your values

# Start everything locally with host ports
docker compose -f docker-compose.yml -f docker-compose.local.yml up --build

# Access locally:
# Backend  → http://localhost:5000
# Admin    → http://localhost:3000
# Website  → http://localhost:3001
```

---

## Useful Docker Commands

```bash
# View all logs
docker compose logs -f

# Logs for one service
docker compose logs -f backend

# Restart one service (without rebuild)
docker compose restart backend

# Rebuild and restart one service
docker compose up -d --build backend

# Stop all
docker compose down

# Stop and wipe MongoDB data (DANGER)
docker compose down -v
```
