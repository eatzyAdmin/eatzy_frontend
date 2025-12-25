# Eatzy Frontend - Turborepo Monorepo

Food delivery platform with multiple Next.js applications for different user roles.

## 🌐 Multi-App Setup with Nginx

**All apps run under a single origin (`eatzy.local`) to share localStorage/IndexedDB/BroadcastChannel.**

### Quick Start
```bash
# 1. Add to hosts file: 127.0.0.1 eatzy.local
# 2. Setup Nginx (see NGINX_SETUP_GUIDE.md)
# 3. Run all apps:
.\start-all-apps.ps1  # Windows
./start-all-apps.sh   # WSL/Git Bash
```

**Access apps:**
- 🛒 Customer: http://eatzy.local/customer
- 🚗 Driver: http://eatzy.local/driver  
- 🍽️ Restaurant: http://eatzy.local/restaurant
- 👔 Admin: http://eatzy.local/admin
- 🔧 Super Admin: http://eatzy.local/super-admin

📚 **Detailed guides:**
- [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) - Complete setup checklist
- [NGINX_SETUP_GUIDE.md](./NGINX_SETUP_GUIDE.md) - Full Nginx configuration guide
- [NGINX_QUICK_START.md](./NGINX_QUICK_START.md) - Quick reference
- [CROSS_APP_SYNC_GUIDE.md](./CROSS_APP_SYNC_GUIDE.md) - BroadcastChannel usage

---

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `customer`: Customer-facing [Next.js](https://nextjs.org/) app (port 3000)
- `driver`: Driver [Next.js](https://nextjs.org/) app (port 3001)
- `restaurant`: Restaurant management [Next.js](https://nextjs.org/) app (port 3002)
- `admin`: Admin [Next.js](https://nextjs.org/) app (port 3003)
- `super-admin`: Super Admin [Next.js](https://nextjs.org/) app (port 3004)
- `@repo/ui`: Shared React component library with design system
- `@repo/models`: Shared TypeScript types and models
- `@repo/api`: Shared API client utilities
- `@repo/eslint-config`: ESLint configurations
- `@repo/typescript-config`: Shared `tsconfig.json`s

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
