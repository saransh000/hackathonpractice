# Admin Analytics Test Script for PowerShell
# Run this after starting the backend server

Write-Host "Step 1: Logging in as admin..." -ForegroundColor Cyan
Write-Host ""

# Login as admin
$loginBody = @{
    email = "admin@hackathon.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    
    Write-Host "Admin login successful!" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
    
    # Set up headers
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    # Test Task Analytics
    Write-Host "Step 2: Fetching Task Analytics..." -ForegroundColor Cyan
    Write-Host ""
    
    try {
        $taskAnalytics = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/analytics/tasks" -Method Get -Headers $headers
        Write-Host "=== TASK ANALYTICS ===" -ForegroundColor Yellow
        $taskAnalytics | ConvertTo-Json -Depth 10
        Write-Host ""
    } catch {
        Write-Host "Task Analytics Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
    }
    
    # Test Board Analytics
    Write-Host "Step 3: Fetching Board Analytics..." -ForegroundColor Cyan
    Write-Host ""
    
    try {
        $boardAnalytics = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/analytics/boards" -Method Get -Headers $headers
        Write-Host "=== BOARD ANALYTICS ===" -ForegroundColor Yellow
        $boardAnalytics | ConvertTo-Json -Depth 10
        Write-Host ""
    } catch {
        Write-Host "Board Analytics Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Test System Analytics
    Write-Host "Step 4: Fetching System Analytics..." -ForegroundColor Cyan
    Write-Host ""
    
    try {
        $systemAnalytics = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/analytics/system" -Method Get -Headers $headers
        Write-Host "=== SYSTEM ANALYTICS ===" -ForegroundColor Yellow
        $systemAnalytics | ConvertTo-Json -Depth 10
        Write-Host ""
    } catch {
        Write-Host "System Analytics Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "All analytics tests completed!" -ForegroundColor Green
    
} catch {
    Write-Host "Login Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure the backend server is running on http://localhost:5000" -ForegroundColor Yellow
}
