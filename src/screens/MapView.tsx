import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import { TRIP, USERS } from '../data'
import { MenuIcon, SearchIcon, MapIcon } from '../components/Icons'
import UserAvatar from '../components/UserAvatar'
import BottomNav from '../components/BottomNav'

// Build a photo pin icon for Leaflet
function photoPin(thumbUrl: string, label: string, userColor: string, highlight = false): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `
      <div class="photo-pin-wrap">
        <div class="photo-circle" style="border-color:${userColor}">
          <img src="${thumbUrl}" alt="${label}" />
        </div>
        <div class="pin-label${highlight ? ' pin-label-highlight' : ''}">${label.toUpperCase()}</div>
      </div>
    `,
    iconSize: [90, 100],
    iconAnchor: [45, 50],
  })
}

function clusterPin(count: number): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div class="cluster-badge">${count}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

export default function MapView() {
  const { name, photos, members, totalDistanceMi, parksVisited } = TRIP

  // Three pins visible on map
  const pins = [
    { photo: photos[3], user: USERS[0], highlight: false },  // Big Sur
    { photo: photos[4], user: USERS[1], highlight: true },   // Bixby
    { photo: photos[5], user: USERS[3], highlight: false },  // Pfeiffer
  ]

  return (
    <div className="screen map-screen">
      {/* Leaflet map fills entire screen */}
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

        {pins.map(({ photo, user, highlight }) => (
          <Marker
            key={photo.id}
            position={[photo.location.lat, photo.location.lng]}
            icon={photoPin(photo.thumbnail, photo.location.name, user.color, highlight)}
          />
        ))}

        <Marker
          position={[36.62, -121.58]}
          icon={clusterPin(12)}
        />
      </MapContainer>

      {/* Header glass overlay */}
      <div className="map-header">
        <button className="icon-btn">
          <MenuIcon size={22} color="var(--primary)" />
        </button>
        <div className="map-header-title">
          <div className="trip-name-map">{name}</div>
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

      {/* Shared trail row */}
      <div className="shared-trail">
        <div className="avatar-row">
          {members.map(u => (
            <UserAvatar key={u.id} user={u} size={30} />
          ))}
        </div>
        <span className="trail-label">SHARED TRAIL</span>
      </div>

      {/* Stats card */}
      <div className="stats-card">
        <div className="stats-label">TOTAL DISTANCE</div>
        <div className="stats-value">{totalDistanceMi} <span>mi</span></div>
        <div className="stats-sub">
          <span>⛺</span>
          <span>{parksVisited} Parks Visited</span>
        </div>
      </div>

      <BottomNav active="explore" />
    </div>
  )
}
