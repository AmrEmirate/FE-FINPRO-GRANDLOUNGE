// src/components/property/property-map.tsx
'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix untuk ikon default Leaflet yang rusak dengan Next.js
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
})

interface PropertyMapProps {
  latitude: number
  longitude: number
  propertyName: string
}

export function PropertyMap({ latitude, longitude, propertyName }: PropertyMapProps) {
  if (typeof window === 'undefined' || !latitude || !longitude) {
    return (
        <div className="h-96 w-full bg-gray-200 flex items-center justify-center rounded-lg">
            <p className="text-gray-500">Peta tidak tersedia.</p>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Lokasi Properti</h3>
        <MapContainer
            center={[latitude, longitude]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: '400px', width: '100%', borderRadius: '8px' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[latitude, longitude]}>
                <Popup>
                    {propertyName}
                </Popup>
            </Marker>
        </MapContainer>
    </div>
  )
}