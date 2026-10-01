# Tuvio App — Device Search Prototype

## Запуск

```bash
npm install
npm run dev
```

## Структура

- `src/screens/DeviceSearchScreen.tsx` — экран поиска устройства (Figma 295:9458)
- `src/components/DeviceCarousel.tsx` — бесконечная карусель устройств
- `public/assets/devices/` — картинки устройств (device-01…12.png)
- `public/assets/icons/` — иконки статуса / scan / info

Пока локальных файлов нет, используются временные URL из Figma MCP (живут ~7 дней).

```bash
bash scripts/download-assets.sh
npm install
npm run dev
```
