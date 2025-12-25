# PowerShell script to run proxy server + all apps

Write-Host "🚀 Starting Eatzy Development Environment..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Start proxy server in a new window
Write-Host "🌐 Starting Proxy Server on port 80..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node proxy-server.js"

# Wait a bit for proxy to start
Start-Sleep -Seconds 2

# Start all apps in separate processes
Write-Host "📱 Starting Customer app on port 3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "pnpm --filter customer dev --port 3000"

Write-Host "🚗 Starting Driver app on port 3001..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "pnpm --filter driver dev --port 3001"

Write-Host "🍽️  Starting Restaurant app on port 3002..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "pnpm --filter restaurant dev --port 3002"

Write-Host "👔 Starting Admin app on port 3003..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "pnpm --filter admin dev --port 3003"

Write-Host "🔧 Starting Super Admin app on port 3004..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "pnpm --filter super-admin dev --port 3004"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "✅ All services started in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "⏳ Please wait 30-60 seconds for all apps to finish building..." -ForegroundColor Yellow
Write-Host ""
Write-Host "📡 Access the apps at:" -ForegroundColor Yellow
Write-Host "  • http://eatzy.local/customer" -ForegroundColor White
Write-Host "  • http://eatzy.local/driver" -ForegroundColor White
Write-Host "  • http://eatzy.local/restaurant" -ForegroundColor White
Write-Host "  • http://eatzy.local/admin" -ForegroundColor White
Write-Host "  • http://eatzy.local/super-admin" -ForegroundColor White
Write-Host ""
Write-Host "or directly via:" -ForegroundColor DarkGray
Write-Host "  • http://localhost:3000/customer" -ForegroundColor DarkGray
Write-Host "  • http://localhost:3001/driver" -ForegroundColor DarkGray
Write-Host "  • http://localhost:3002/restaurant" -ForegroundColor DarkGray
Write-Host "  • http://localhost:3003/admin" -ForegroundColor DarkGray
Write-Host "  • http://localhost:3004/super-admin" -ForegroundColor DarkGray
Write-Host ""
Write-Host "🛑 To stop: Close all 6 PowerShell windows" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to close"
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
