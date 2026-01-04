# CI/CD Setup Guide

## 🚀 Overview

CI/CD pipeline tự động build, test và deploy 5 apps:
- Customer App (port 3000)
- Admin App (port 3001)
- Driver App (port 3002)
- Restaurant App (port 3003)
- Super Admin App (port 3004)

## 📋 Prerequisites

### 1. GitHub Secrets Configuration

Vào Settings → Secrets and variables → Actions → New repository secret:

#### Để deploy lên server (SSH):
```
DEPLOY_HOST=your-server-ip
DEPLOY_USER=your-username
DEPLOY_SSH_KEY=your-private-ssh-key
DEPLOY_PORT=22
```

#### Để push lên Docker Hub (optional):
```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password
```

### 2. Enable GitHub Container Registry

1. Vào Settings → Actions → General
2. Scroll xuống "Workflow permissions"
3. Chọn "Read and write permissions"
4. Save

## 🔄 Workflows

### 1. `build-and-deploy.yml` - Main CI/CD Pipeline

**Trigger:**
- Push code lên `main` hoặc `develop` branch
- Tạo Pull Request vào `main`
- Manual trigger từ GitHub UI

**Flow:**
1. Build 5 Docker images song song
2. Push images lên GitHub Container Registry
3. Deploy lên server qua SSH (chỉ khi push lên main/develop)

**Manual trigger:**
```bash
# Trên GitHub: Actions → Build and Deploy All Apps → Run workflow
# Chọn apps muốn build: all, customer, admin, v.v.
```

### 2. `docker-hub.yml` - Push to Docker Hub

**Trigger:**
- Push lên `main` branch
- Tạo tag version (v1.0.0, v2.0.0, ...)
- Manual trigger

**Build multi-platform:**
- linux/amd64
- linux/arm64

### 3. `pr-check.yml` - Pull Request Quality Check

**Trigger:**
- Mở Pull Request vào `main` hoặc `develop`

**Checks:**
- Lint code
- Type check
- Build test từng app
- Docker build test

## 🖥️ Server Setup

### Chuẩn bị server:

```bash
# 1. Install Docker và Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 2. Tạo thư mục deploy
mkdir -p /opt/eatzy-frontend
cd /opt/eatzy-frontend

# 3. Copy docker-compose.prod.yml lên server
scp docker-compose.prod.yml user@server:/opt/eatzy-frontend/docker-compose.yml

# 4. Tạo file .env
cat > .env << EOF
REGISTRY=ghcr.io
IMAGE_PREFIX=your-github-username/eatzy
TAG=latest
NEXT_PUBLIC_API_URL=https://eatzy-be.hoanduong.net
EOF

# 5. Login vào GitHub Container Registry
echo $GITHUB_PAT | docker login ghcr.io -u USERNAME --password-stdin

# 6. Pull và start services
docker compose pull
docker compose up -d
```

### Setup SSH Key cho GitHub Actions:

```bash
# Trên server
ssh-keygen -t ed25519 -C "github-actions"
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys

# Copy private key
cat ~/.ssh/id_ed25519
# → Add vào GitHub Secret: DEPLOY_SSH_KEY
```

## 🔧 Local Development

### Build local với Docker:

```bash
# Build 1 app
docker build --build-arg APP_NAME=customer -t eatzy-customer .

# Build tất cả với docker-compose
docker-compose build

# Run local
docker-compose up
```

### Build với pnpm (development):

```bash
pnpm install
pnpm run dev
```

## 📦 Image Registry

### GitHub Container Registry (Default):
```
ghcr.io/your-username/eatzy-customer:latest
ghcr.io/your-username/eatzy-admin:latest
ghcr.io/your-username/eatzy-driver:latest
ghcr.io/your-username/eatzy-restaurant:latest
ghcr.io/your-username/eatzy-super-admin:latest
```

### Docker Hub (Optional):
```
your-username/eatzy-customer:latest
your-username/eatzy-admin:latest
# ... etc
```

## 🏷️ Versioning & Tags

### Semantic Versioning:

```bash
# Tạo tag
git tag v1.0.0
git push origin v1.0.0

# Images sẽ được tag:
# - v1.0.0
# - 1.0
# - latest
# - main
# - sha-abc123
```

### Branch-based tags:

```bash
# Push lên main → tag: main, latest
# Push lên develop → tag: develop
# PR #123 → tag: pr-123
```

## 🔍 Monitoring & Logs

### Xem logs trên server:

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f customer

# Last 100 lines
docker compose logs --tail=100 customer
```

### Health checks:

```bash
# Check health status
docker compose ps

# Manual health check
curl http://localhost:3000/api/health
```

## 🛠️ Troubleshooting

### Build fails:

```bash
# Clear cache
docker builder prune -af

# Rebuild without cache
docker build --no-cache --build-arg APP_NAME=customer -t eatzy-customer .
```

### Deploy fails:

```bash
# Check SSH connection
ssh -i ~/.ssh/id_ed25519 user@server

# Check GitHub Container Registry
docker login ghcr.io -u your-username

# Pull manually
docker pull ghcr.io/your-username/eatzy-customer:latest
```

### Port conflicts:

```bash
# Check ports in use
netstat -tulpn | grep :3000

# Change ports in .env
CUSTOMER_PORT=8000
ADMIN_PORT=8001
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Turborepo Docker](https://turbo.build/repo/docs/handbook/deploying-with-docker)
