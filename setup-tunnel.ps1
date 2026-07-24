# Automation Script: Cloudflare Tunnel DNS Route & Execution (PowerShell)
# Usage: .\setup-tunnel.ps1 [-TunnelName "your-tunnel-name"]

param(
    [string]$TunnelName = "a32448da-6cea-44a6-b41c-ed315437b15d"
)

Write-Host "===================================================" -ForegroundColor Gold
Write-Host "🚀 Cloudflare Tunnel Setup for vnr202.l4st-r4ven.io.vn" -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Gold

Write-Host "1. Routing DNS for Cloudflare Tunnel to vnr202.l4st-r4ven.io.vn..." -ForegroundColor Cyan
cloudflared tunnel route dns $TunnelName vnr202.l4st-r4ven.io.vn

Write-Host "2. Running Cloudflare Tunnel with config.yml..." -ForegroundColor Green
cloudflared tunnel run --config config.yml $TunnelName
