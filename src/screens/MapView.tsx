import { useState } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import { USERS } from '../data'
import { MenuIcon, SearchIcon, MapIcon } from '../components/Icons'
import UserAvatar from '../components/UserAvatar'
import BottomNav from '../components/BottomNav'
import LocationDrawer from '../components/LocationDrawer'
import type { LocationPin } from '../types'

const LOCATIONS: LocationPin[] = [
  {
    id: 'bigsur',
    label: 'Big Sur',
    lat: 36.270,
    lng: -121.808,
    primaryThumb: 'https://picsum.photos/seed/bigsurredwood/200/200',
    primaryColor: USERS[0].color,
    photos: [
      { url: 'https://picsum.photos/seed/bigsurredwood/800/600', caption: 'Into the redwoods.', uploader: USERS[0] },
      { url: 'https://picsum.photos/seed/bigsurcliff/800/600', caption: 'Cliffside view at dusk.', uploader: USERS[1] },
      { url: 'https://picsum.photos/seed/bigsurtrail/800/600', caption: 'Morning hike.', uploader: USERS[2] },
      { url: 'https://picsum.photos/seed/bigsurstream/800/600', caption: 'Hidden creek crossing.', uploader: USERS[0] },
    ],
  },
  {
    id: 'bixby',
    label: 'Bixby',
    lat: 36.371,
    lng: -121.904,
    highlight: true,
    primaryThumb: 'https://picsum.photos/seed/bixbycreek/200/200',
    primaryColor: USERS[1].color,
    photos: [
      { url: 'https://picsum.photos/seed/bixbycreek/800/600', caption: 'Bixby Creek Canyon.', uploader: USERS[1] },
      { url: 'https://picsum.photos/seed/bixbybridge/800/600', caption: 'Bridge from below.', uploader: USERS[3] },
      { url: 'https://picsum.photos/seed/bixbyfog/800/600', caption: 'Fog rolling in.', uploader: USERS[2] },
    ],
  },
  {
    id: 'pfeiffer',
    label: 'Pfeiffer',
    lat: 36.195,
    lng: -121.773,
    primaryThumb: 'https://picsum.photos/seed/pfeifferbeach/200/200',
    primaryColor: USERS[3].color,
    photos: [
      { url: 'https://picsum.photos/seed/pfeifferbeach/800/600', caption: 'Pfeiffer Beach.', uploader: USERS[3] },
      { url: 'https://picsum.photos/seed/pfeiffersurf/800/600', caption: 'Purple sand at sunset.', uploader: USERS[0] },
      { url: 'https://picsum.photos/seed/pfeifferrock/800/600', caption: 'Sea arch.', uploader: USERS[1] },
      { url: 'https://picsum.photos/seed/pfeifferpath/800/600', caption: 'Trail through the pines.', uploader: USERS[2] },
      { url: 'https://picsum.photos/seed/pfeiffercamp/800/600', caption: 'Campfire at dusk.', uploader: USERS[3] },
    ],
  },
]

function makeSquarePin(thumbUrl: string, userColor: string, highlight: boolean): L.DivIcon {
  const ring = highlight ? `border-color:${userColor}` : `border-color:#fff`
  return L.divIcon({
    className: '',
    html: `
      <div class="photo-pin-wrap">
        <div class="photo-square" style="${ring}">
          <img src="${thumbUrl}" alt="" />
        </div>
      </div>
    `,
    iconSize: [64, 64],
    iconAnchor: [32, 32],
  })
}

function makeClusterPin(count: number): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div class="cluster-badge">${count}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

const TRIP_NAME = 'Pacific Coast Highway'
const MEMBERS = USERS
const TOTAL_MI = 452
const PARKS = 3

export default function MapView() {
  const [activeLocation, setActiveLocation] = useState<LocationPin | null>(null)

  return (
    <div className="screen map-screen">
      <MapContainer
        center={[36.3, -121.85]}
        zoom={9}
        className="map-container"
        zoomControl={false}
        scrollWheelZoom={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          subdomains={['a', 'b', 'c']}
        />

        {LOCATIONS.map(loc => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={makeSquarePin(loc.primaryThumb, loc.primaryColor, !!loc.highlight)}
            eventHandlers={{ click: () => setActiveLocation(loc) }}
          />
        ))}

        <Marker
          position={[36.62, -121.58]}
          icon={makeClusterPin(12)}
        />
      </MapContainer>

      {/* Glass header */}
      <div className="map-header">
        <button className="icon-btn">
          <MenuIcon size={22} color="var(--primary)" />
        </button>
        <div className="map-header-title">
          <div className="trip-name-map">{TRIP_NAME}</div>
        </div>
        <div className="header-actions">
          <button className="icon-btn">
            <SearchIcon size={20} color="var(--primary)" />
          </button>
          <button className="icon-btn active">
            <MapIcon size={20} color="var(--primary)" />
          </button>
        </div>
      </div>

      {/* Shared trail */}
      <div className="shared-trail">
        <div className="avatar-row">
          {MEMBERS.map(u => (
            <UserAvatar key={u.id} user={u} size={30} />
          ))}
        </div>
        <span className="trail-label">SHARED TRAIL</span>
      </div>

      {/* Stats */}
      <div className="stats-card">
        <div className="stats-label">TOTAL DISTANCE</div>
        <div className="stats-value">{TOTAL_MI} <span>mi</span></div>
        <div className="stats-sub">
          <span>⛺</span>
          <span>{PARKS} Parks Visited</span>
        </div>
      </div>

      {/* Location photo drawer */}
      {activeLocation && (
        <LocationDrawer
          title={activeLocation.label}
          photos={activeLocation.photos}
          onClose={() => setActiveLocation(null)}
        />
      )}

      <BottomNav active="explore" />
    </div>
  )
}
