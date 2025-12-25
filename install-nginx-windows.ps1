# Download and install Nginx on Windows
$nginxVersion = "1.24.0"
$downloadUrl = "http://nginx.org/download/nginx-$nginxVersion.zip"
$downloadPath = "$env:TEMP\nginx.zip"
$extractPath = "C:\nginx"

Write-Host "📥 Downloading Nginx $nginxVersion..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $downloadUrl -OutFile $downloadPath

Write-Host "📦 Extracting Nginx..." -ForegroundColor Cyan
Expand-Archive -Path $downloadPath -DestinationPath "C:\" -Force

# Rename folder
if (Test-Path "C:\nginx-$nginxVersion") {
    if (Test-Path $extractPath) {
        Remove-Item -Path $extractPath -Recurse -Force
    }
    Rename-Item -Path "C:\nginx-$nginxVersion" -NewName "nginx"
}

Write-Host "✅ Nginx installed at C:\nginx" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy nginx config: Copy-Item nginx-eatzy.conf C:\nginx\conf\eatzy.conf" -ForegroundColor White
Write-Host "2. Update nginx.conf to include eatzy.conf" -ForegroundColor White
Write-Host "3. Start Nginx: C:\nginx\nginx.exe" -ForegroundColor White
