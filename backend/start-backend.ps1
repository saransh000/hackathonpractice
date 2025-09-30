Write-Host "`n Starting Backend Server...`n" -ForegroundColor Cyan

Set-Location C:\Users\saran\Desktop\bachchodi\hackathonpractice\backend

$currentDir = Get-Location
Write-Host "`nCurrent Directory: $currentDir`n" -ForegroundColor Yellow

Write-Host "Running: npm run dev`n" -ForegroundColor Green

npm run dev
