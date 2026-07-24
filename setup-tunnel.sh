#!/usr/bin/env bash
# Automation Script: Cloudflare Tunnel DNS Route & Execution (Bash)
# Usage: ./setup-tunnel.sh [TUNNEL_NAME]

TUNNEL_NAME="${1:-a32448da-6cea-44a6-b41c-ed315437b15d}"

echo "==================================================="
echo "🚀 Cloudflare Tunnel Setup for vnr202.l4st-r4ven.io.vn"
echo "==================================================="

echo "1. Routing DNS for Cloudflare Tunnel to vnr202.l4st-r4ven.io.vn..."
cloudflared tunnel route dns "$TUNNEL_NAME" vnr202.l4st-r4ven.io.vn

echo "2. Running Cloudflare Tunnel with config.yml..."
cloudflared tunnel run --config config.yml "$TUNNEL_NAME"
