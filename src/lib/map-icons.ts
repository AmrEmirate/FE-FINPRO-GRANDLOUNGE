// src/lib/map-icons.ts

import L from 'leaflet';

// Fungsi untuk membuat ikon dari SVG string
const createSvgIcon = (svg: string, size: [number, number], anchor: [number, number], popupAnchor?: [number, number]) => {
  return new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(svg),
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor: popupAnchor,
  });
};

// SVG untuk User Icon
const userSvg = `
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="16" fill="#2563EB" fill-opacity="0.3" style="animation: pulse 2s infinite; transform-origin: center;"/>
    <circle cx="32" cy="32" r="8" fill="#2563EB"/>
    <style>@keyframes pulse { 0% { transform: scale(0.8); } 70% { transform: scale(1.2); } 100% { transform: scale(0.8); } }</style>
  </svg>`;

// SVG untuk Property Icon
const propertySvg = `
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0L3 9v12h18V9L12 0zm-2 19H5v-7h5v7zm2-10.5L6.47 5h11.06L12 8.5zM19 19h-5v-7h5v7z" fill="#111827"/>
  </svg>`;

export const userIcon = createSvgIcon(userSvg, [64, 64], [32, 32]);
export const propertyIcon = createSvgIcon(propertySvg, [32, 32], [16, 32], [0, -32]);