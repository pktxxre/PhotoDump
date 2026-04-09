import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import { getAlbumClusters, ALBUMS } from '../data'
import type { AlbumCluster } from '../types'
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
  const navigate = useNavigate()
  const [activeCluster, setActiveCluster] = useState<AlbumCluster | null>(null)
  const [showModal, setShowModal] = useState(() => shouldShowLocationModal())

  const clusters = getAlbumClusters()
  const albumCount = ALBUMS.length
  const stopCount = clusters.length

  return (
    <div className="screen global-map-screen">

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

      <div className="global-map-body">
        <MapContainer
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

          {clusters.map(cluster => (
            <Marker
              key={cluster.albumId}
              position={[cluster.lat, cluster.lng]}
              icon={makeSquarePin(cluster.primaryThumb, cluster.primaryColor)}
              eventHandlers={{ click: () => setActiveCluster(cluster) }}
            />
          ))}
        </MapContainer>

        {activeCluster && (
          <LocationDrawer
            title={activeCluster.albumName}
            photos={activeCluster.photos}
            onClose={() => setActiveCluster(null)}
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
