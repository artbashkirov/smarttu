#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/public/assets/devices" "$ROOT/public/assets/icons"

download() {
  local url="$1" out="$2"
  echo "→ $out"
  curl -fsSL -o "$out" "$url"
}

# Devices (Figma MCP assets — expire ~7 days)
download "https://www.figma.com/api/mcp/asset/baa5ea1e-8bf6-44b0-8a4a-cd40c9050ebc.png" "$ROOT/public/assets/devices/device-01.png"
download "https://www.figma.com/api/mcp/asset/3a427557-706c-43fa-82b4-95e3f2d511e2.png" "$ROOT/public/assets/devices/device-02.png"
download "https://www.figma.com/api/mcp/asset/85e3e845-f9c6-4d41-a305-66cdd5c50474.png" "$ROOT/public/assets/devices/device-03.png"
download "https://www.figma.com/api/mcp/asset/d8a0f6df-4e4c-4826-ac8a-2a6ffe6ef01b.png" "$ROOT/public/assets/devices/device-04.png"
download "https://www.figma.com/api/mcp/asset/d201998c-ff74-433d-a1f5-f74d5eb4b2b1.png" "$ROOT/public/assets/devices/device-05.png"
download "https://www.figma.com/api/mcp/asset/85732c97-bcd8-446a-b491-069d9915d8ea.png" "$ROOT/public/assets/devices/device-06.png"
download "https://www.figma.com/api/mcp/asset/1ddb3bcd-544f-4a84-b44c-2aef2b10f6b4.png" "$ROOT/public/assets/devices/device-07.png"
download "https://www.figma.com/api/mcp/asset/e054928f-e693-4da2-9091-8dad541b4326.png" "$ROOT/public/assets/devices/device-08.png"
download "https://www.figma.com/api/mcp/asset/95bf4eae-0fca-484b-ac1d-a88bda5f56ea.png" "$ROOT/public/assets/devices/device-09.png"
download "https://www.figma.com/api/mcp/asset/19a89894-9ee5-4baa-aef1-5d1f8c82eadc.png" "$ROOT/public/assets/devices/device-10.png"
download "https://www.figma.com/api/mcp/asset/6d5729e6-53f8-4cf0-8ef1-8e8e00005bd3.png" "$ROOT/public/assets/devices/device-11.png"
download "https://www.figma.com/api/mcp/asset/83d9e90a-e46b-427f-a890-030f4d4d64c8.png" "$ROOT/public/assets/devices/device-12.png"

# Icons
download "https://www.figma.com/api/mcp/asset/8b3a79ae-4ebc-40ad-8c1e-63f32d11abf3.svg" "$ROOT/public/assets/icons/scan.svg"
download "https://www.figma.com/api/mcp/asset/3270df74-aeb4-4a18-bcac-9975258d4dde.svg" "$ROOT/public/assets/icons/info.svg"
download "https://www.figma.com/api/mcp/asset/13f1e117-2fd5-4b6e-a920-f9daba937834.svg" "$ROOT/public/assets/icons/status-levels.svg"
download "https://www.figma.com/api/mcp/asset/96a902ba-5fb0-4f3c-b93e-b8dbbdc67050.svg" "$ROOT/public/assets/icons/status-time.svg"

echo "Done."
