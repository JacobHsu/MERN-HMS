# Prescripto Project Management Script
# Usage:
#   .\dev.ps1 install   - Install all project dependencies
#   .\dev.ps1 start     - Start backend, frontend, and admin simultaneously
#   .\dev.ps1 clean     - Remove all node_modules and lock files
#   .\dev.ps1 help      - Show help

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

# Set console encoding to UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Project paths
$BackendPath = ".\backend"
$FrontendPath = ".\frontend"
$AdminPath = ".\admin"

# Color output function
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Show header
function Show-Header {
    param([string]$Title)
    Write-Host ""
    Write-ColorOutput "========================================" "Cyan"
    Write-ColorOutput "  $Title" "Cyan"
    Write-ColorOutput "========================================" "Cyan"
    Write-Host ""
}

# Check if pnpm is installed
function Test-Pnpm {
    try {
        $null = Get-Command pnpm -ErrorAction Stop
        return $true
    } catch {
        Write-ColorOutput "Error: pnpm not found!" "Red"
        Write-ColorOutput "Please install pnpm first: npm install -g pnpm" "Yellow"
        return $false
    }
}

# Install dependencies
function Install-Dependencies {
    Show-Header "Install Project Dependencies"

    if (-not (Test-Pnpm)) {
        return
    }

    Write-ColorOutput "Starting installation of all project dependencies..." "Green"

    # Backend
    Write-ColorOutput "`n[1/3] Installing backend dependencies..." "Yellow"
    Set-Location $BackendPath
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "Backend dependency installation failed!" "Red"
        Set-Location ..
        return
    }
    Set-Location ..

    # Frontend
    Write-ColorOutput "`n[2/3] Installing frontend dependencies..." "Yellow"
    Set-Location $FrontendPath
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "Frontend dependency installation failed!" "Red"
        Set-Location ..
        return
    }
    Set-Location ..

    # Admin
    Write-ColorOutput "`n[3/3] Installing admin dependencies..." "Yellow"
    Set-Location $AdminPath
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "Admin dependency installation failed!" "Red"
        Set-Location ..
        return
    }
    Set-Location ..

    Write-ColorOutput "`n[SUCCESS] All dependencies installed successfully!" "Green"
}

# Start all services
function Start-AllServices {
    Show-Header "Start Prescripto Project"

    if (-not (Test-Pnpm)) {
        return
    }

    Write-ColorOutput "Starting all three services simultaneously..." "Green"
    Write-ColorOutput "  - Backend Service" "Cyan"
    Write-ColorOutput "  - Frontend Service" "Cyan"
    Write-ColorOutput "  - Admin Service" "Cyan"
    Write-Host ""
    Write-ColorOutput "Tip: Press Ctrl+C in each window to stop services" "Yellow"
    Write-Host ""

    # Start multiple PowerShell jobs
    $backend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BackendPath'; Write-Host 'Starting Backend Service...' -ForegroundColor Green; pnpm run server" -PassThru
    Start-Sleep -Seconds 2

    $frontend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FrontendPath'; Write-Host 'Starting Frontend Service...' -ForegroundColor Green; pnpm run dev" -PassThru
    Start-Sleep -Seconds 2

    $admin = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$AdminPath'; Write-Host 'Starting Admin Service...' -ForegroundColor Green; pnpm run dev" -PassThru

    Write-ColorOutput "[SUCCESS] All services launched in new windows!" "Green"
    Write-Host ""
    Write-ColorOutput "Service Information:" "Cyan"
    Write-ColorOutput "  Backend API: http://localhost:4000 (typically)" "White"
    Write-ColorOutput "  Frontend: http://localhost:5173 (typically)" "White"
    Write-ColorOutput "  Admin: http://localhost:5174 (typically)" "White"
    Write-Host ""
    Write-ColorOutput "Check each terminal window for the exact port numbers" "Yellow"
}

# Clean dependencies
function Clear-Dependencies {
    Show-Header "Clean Project Dependencies"

    Write-ColorOutput "About to delete all node_modules and lock files..." "Yellow"
    Write-Host ""

    $confirm = Read-Host "Are you sure you want to continue? (y/N)"
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-ColorOutput "Cleanup operation cancelled" "Yellow"
        return
    }

    Write-ColorOutput "`nStarting cleanup..." "Green"

    # Backend
    Write-ColorOutput "`n[1/3] Cleaning backend..." "Yellow"
    if (Test-Path "$BackendPath\node_modules") {
        Remove-Item -Recurse -Force "$BackendPath\node_modules"
        Write-ColorOutput "  [OK] Removed backend/node_modules" "Gray"
    }
    if (Test-Path "$BackendPath\pnpm-lock.yaml") {
        Remove-Item -Force "$BackendPath\pnpm-lock.yaml"
        Write-ColorOutput "  [OK] Removed backend/pnpm-lock.yaml" "Gray"
    }

    # Frontend
    Write-ColorOutput "`n[2/3] Cleaning frontend..." "Yellow"
    if (Test-Path "$FrontendPath\node_modules") {
        Remove-Item -Recurse -Force "$FrontendPath\node_modules"
        Write-ColorOutput "  [OK] Removed frontend/node_modules" "Gray"
    }
    if (Test-Path "$FrontendPath\pnpm-lock.yaml") {
        Remove-Item -Force "$FrontendPath\pnpm-lock.yaml"
        Write-ColorOutput "  [OK] Removed frontend/pnpm-lock.yaml" "Gray"
    }

    # Admin
    Write-ColorOutput "`n[3/3] Cleaning admin..." "Yellow"
    if (Test-Path "$AdminPath\node_modules") {
        Remove-Item -Recurse -Force "$AdminPath\node_modules"
        Write-ColorOutput "  [OK] Removed admin/node_modules" "Gray"
    }
    if (Test-Path "$AdminPath\pnpm-lock.yaml") {
        Remove-Item -Force "$AdminPath\pnpm-lock.yaml"
        Write-ColorOutput "  [OK] Removed admin/pnpm-lock.yaml" "Gray"
    }

    Write-ColorOutput "`n[SUCCESS] Cleanup completed!" "Green"
}

# Show help
function Show-Help {
    Show-Header "Prescripto Project Management Script"

    Write-Host "Usage:"
    Write-Host ""
    Write-ColorOutput "  .\dev.ps1 install" "Cyan"
    Write-Host "    Install all project dependencies (Backend, Frontend, Admin)"
    Write-Host ""
    Write-ColorOutput "  .\dev.ps1 start" "Cyan"
    Write-Host "    Start all services simultaneously (Backend, Frontend, Admin)"
    Write-Host ""
    Write-ColorOutput "  .\dev.ps1 clean" "Cyan"
    Write-Host "    Remove all node_modules and lock files"
    Write-Host ""
    Write-ColorOutput "  .\dev.ps1 help" "Cyan"
    Write-Host "    Show this help message"
    Write-Host ""
    Write-ColorOutput "Examples:" "Yellow"
    Write-Host "  .\dev.ps1 install    # First-time project setup"
    Write-Host "  .\dev.ps1 start      # Start development environment"
    Write-Host "  .\dev.ps1 clean      # Clean before reinstalling"
    Write-Host ""
}

# Main program
switch ($Command.ToLower()) {
    "install" {
        Install-Dependencies
    }
    "start" {
        Start-AllServices
    }
    "run" {
        Start-AllServices
    }
    "clean" {
        Clear-Dependencies
    }
    "help" {
        Show-Help
    }
    default {
        Write-ColorOutput "Unknown command: $Command" "Red"
        Write-Host ""
        Show-Help
    }
}
