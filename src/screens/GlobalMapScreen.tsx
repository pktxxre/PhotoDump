import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import { getAllLocations, ALBUMS } from '../data'
import type { LocationPin } from '../types'
import LocationDrawer from '../components/LocationDrawer'
import LocationPermissionModal, { shouldShowLocationModal } from '../components/LocationPermissionModal'

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

function makeSquarePin(thumbUrl: string, userColor: string): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div class="photo-pin-wrap"><div class="photo-square" style="border-color:${userColor}"><img src="${thumbUrl}" alt=""/></div></div>`,
    iconSize: [56, 56],
    iconAnchor: [28, 28],
  })
}

export default function GlobalMapScreen() {
  const navigate  = useNavigate()
  const [activeLocation, setActiveLocation] = useState<LocationPin | null>(null)
  const [showModal, setShowModal] = useState(() => shouldShowLocationModal())

  // Computed once per render — updates automatically if data changes
  const locations  = getAllLocations()
  const albumCount = ALBUMS.length
  const stopCount  = locations.length

  return (
    <div className="screen global-map-screen">

      {/* Fixed header — lives outside MapContainer so it never moves with the map */}
      <div className="global-map-header">
        <button className="icon-btn" onClick={() => navigate('/')}>
          <BackIcon />
        </button>
        <div className="map-header-title">
          <div className="trip-name-map">All Trips</div>
        </div>
        <div className="global-map-album-count">
          {albumCount} albums · {stopCount} stops
        </div>
      </div>

      {/* Map fills remaining height below the header */}
      <div className="global-map-body">
        <MapContainer
          // Global overview — center roughly on the Atlantic so both Americas
          // and Europe/Africa are visible, with room to pan either direction
          center={[20, 0]}
          zoom={3}
          minZoom={2}
          maxBounds={[[-90, -180], [90, 180]]}
          maxBoundsViscosity={1.0}
          scrollWheelZoom={true}
          zoomControl={false}
          attributionControl={false}
          className="global-map-leaflet"
        >
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            subdomains={['a', 'b', 'c']}
            noWrap={true}
          />

          {/*
           * For each world copy offset, render every location as a square photo pin.
           * The latitude is unchanged; only the longitude shifts by ±360°.
           * All copies of the same location store the original location object
           * so the drawer always shows the correct data regardless of which
           * world copy was clicked.
           */}
          {locations.map(loc => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={makeSquarePin(loc.primaryThumb, loc.primaryColor)}
              eventHandlers={{ click: () => setActiveLocation(loc) }}
            />
          ))}
        </MapContainer>

        {/* Single drawer instance — shown when any pin is clicked */}
        {activeLocation && (
          <LocationDrawer
            location={activeLocation}
            onClose={() => setActiveLocation(null)}
            noNavOffset
          />
        )}

        {showModal && (
          <LocationPermissionModal onDismiss={() => setShowModal(false)} />
        )}
      </div>
    </div>
  )
}
