#!/bin/bash

# Script to run all Eatzy apps concurrently for Nginx reverse proxy setup

echo "🚀 Starting all Eatzy apps..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Run all apps in background
echo "📱 Starting Customer app on port 3000..."
pnpm --filter customer dev --port 3000 &

echo "🚗 Starting Driver app on port 3001..."
pnpm --filter driver dev --port 3001 &

echo "🍽️  Starting Restaurant app on port 3002..."
pnpm --filter restaurant dev --port 3002 &

echo "👔 Starting Admin app on port 3003..."
pnpm --filter admin dev --port 3003 &

echo "🔧 Starting Super Admin app on port 3004..."
pnpm --filter super-admin dev --port 3004 &

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All apps started!"
echo ""
echo "Access the apps via Nginx at:"
echo "  • http://eatzy.local/customer"
echo "  • http://eatzy.local/driver"
echo "  • http://eatzy.local/restaurant"
echo "  • http://eatzy.local/admin"
echo "  • http://eatzy.local/super-admin"
echo ""
echo "Or access them directly:"
echo "  • http://localhost:3000/customer"
echo "  • http://localhost:3001/driver"
echo "  • http://localhost:3002/restaurant"
echo "  • http://localhost:3003/admin"
echo "  • http://localhost:3004/super-admin"
echo ""
echo "Press Ctrl+C to stop all apps"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Wait for all background processes
wait
