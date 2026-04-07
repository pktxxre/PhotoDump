import { useState } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import type { LocationPin } from '../types'
import LocationDrawer from './LocationDrawer'

function makeSquarePin(thumbUrl: string, userColor: string, highlight: boolean): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div class="photo-pin-wrap"><div class="photo-square" style="border-color:${highlight ? userColor : '#fff'}"><img src="${thumbUrl}" alt=""/></div></div>`,
    iconSize: [64, 64],
    iconAnchor: [32, 32],
  })
}

interface Props {
  locations: LocationPin[]
  center: [number, number]
  zoom: number
}

export default function AlbumMap({ locations, center, zoom }: Props) {
  const [active, setActive] = useState<LocationPin | null>(null)

  return (
    <div className="album-map-wrap">
      <MapContainer
        center={center}
        zoom={zoom}
        className="album-map-leaflet"
        zoomControl={false}
        scrollWheelZoom={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          subdomains={['a', 'b', 'c']}
        />
        {locations.map(loc => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={makeSquarePin(loc.primaryThumb, loc.primaryColor, !!loc.highlight)}
            eventHandlers={{ click: () => setActive(loc) }}
          />
        ))}
      </MapContainer>

      {active && (
        <LocationDrawer location={active} onClose={() => setActive(null)} noNavOffset />
      )}
    </div>
  )
}
