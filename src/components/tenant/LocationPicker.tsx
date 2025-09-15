// src/components/tenant/LocationPicker.tsx
"use client"

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'

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

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void
  initialPosition?: { lat: number; lng: number }
  cityCoordinates?: { lat: number; lng: number }
}

const MapEvents = ({ onLocationSelect, setMarkerPosition }: { onLocationSelect: (location: { lat: number; lng: number }) => void, setMarkerPosition: (position: [number, number]) => void }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      setMarkerPosition([lat, lng])
      onLocationSelect({ lat, lng })
    },
  })
  return null
}

const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 13)
  }, [center, map])
  return null
}

export function LocationPicker({ onLocationSelect, initialPosition, cityCoordinates }: LocationPickerProps) {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    initialPosition ? [initialPosition.lat, initialPosition.lng] : null
  )

  const center: [number, number] = cityCoordinates
    ? [cityCoordinates.lat, cityCoordinates.lng]
    : markerPosition || [-6.2088, 106.8456] // Default to Jakarta if no city or marker

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '400px', width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerPosition && <Marker position={markerPosition} />}
      <MapEvents onLocationSelect={onLocationSelect} setMarkerPosition={setMarkerPosition} />
      {cityCoordinates && <ChangeView center={[cityCoordinates.lat, cityCoordinates.lng]} />}
    </MapContainer>
  )
}