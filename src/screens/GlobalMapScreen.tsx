import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { supabase } from '../lib/supabase'
import { useAlbums } from '../hooks/useAlbums'
import LocationDrawer from '../components/LocationDrawer'
import LocationPermissionModal, { shouldShowLocationModal } from '../components/LocationPermissionModal'
import type { LocationPhoto } from '../types'

const SPLIT_ZOOM = 7

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)
const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
)
const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

interface GeoPhoto {
  id: string
  albumId: string
  albumName: string
  url: string
  lat: number
  lng: number
  uploaderName: string
  uploaderId: string | null
}

interface AlbumCluster {
  albumId: string
  albumName: string
  lat: number
  lng: number
  thumb: string
  photos: LocationPhoto[]
}

function makePin(thumbUrl: string, color: string, size = 52): L.DivIcon {
  const h = size / 2
  return L.divIcon({
    className: '',
    html: `<div class="photo-pin-wrap"><div class="photo-square" style="border-color:${color}"><img src="${thumbUrl}" alt=""/></div></div>`,
    iconSize: [size, size],
    iconAnchor: [h, h],
  })
}

function makeClusterPin(thumbUrl: string, color: string, count: number): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div class="photo-pin-wrap"><div class="photo-square" style="border-color:${color}"><img src="${thumbUrl}" alt=""/><div class="cluster-count-badge">${count}</div></div></div>`,
    iconSize: [64, 64],
    iconAnchor: [32, 32],
  })
}

function ZoomWatcher({ onZoom }: { onZoom: (z: number) => void }) {
  useMapEvents({ zoomend: e => onZoom(e.target.getZoom()) })
  return null
}

export default function GlobalMapScreen() {
  const navigate = useNavigate()
  const [zoom, setZoom]           = useState(3)
  const [photos, setPhotos]       = useState<GeoPhoto[]>([])
  const [activePin, setActivePin] = useState<{ title: string; photos: LocationPhoto[] } | null>(null)
  const [showModal, setShowModal] = useState(() => shouldShowLocationModal())
  const [filterOpen, setFilterOpen] = useState(false)
  const [checkedAlbums, setCheckedAlbums]       = useState<Set<string>>(new Set())
  const [checkedUploaders, setCheckedUploaders] = useState<Set<string>>(new Set())

  const { albums: userAlbums } = useAlbums()

  useEffect(() => {
    supabase
      .from('album_photos')
      .select('id, album_id, url, lat, lng, uploader_name, uploader_id, albums(name)')
      .not('lat', 'is', null)
      .not('lng', 'is', null)
      .then(({ data }) => {
        if (!data) return
        setPhotos(data.map((row: any) => ({
          id: row.id,
          albumId: row.album_id,
          albumName: row.albums?.name ?? 'Album',
          url: row.url,
          lat: row.lat,
          lng: row.lng,
          uploaderName: row.uploader_name ?? 'Unknown',
          uploaderId: row.uploader_id,
        })))
      })
  }, [])

  // Auto-check any new user albums as they load
  useEffect(() => {
    if (userAlbums.length === 0) return
    setCheckedAlbums(prev => {
      const next = new Set(prev)
      let changed = false
      for (const a of userAlbums) {
        if (!next.has(a.id)) { next.add(a.id); changed = true }
      }
      return changed ? next : prev
    })
  }, [userAlbums])

  // Auto-check any new albums/uploaders found in geotagged photos
  useEffect(() => {
    if (photos.length === 0) return
    setCheckedAlbums(prev => {
      const next = new Set(prev)
      let changed = false
      for (const p of photos) {
        if (!next.has(p.albumId)) { next.add(p.albumId); changed = true }
      }
      return changed ? next : prev
    })
    setCheckedUploaders(prev => {
      const next = new Set(prev)
      let changed = false
      for (const p of photos) {
        const uid = p.uploaderId ?? p.uploaderName
        if (!next.has(uid)) { next.add(uid); changed = true }
      }
      return changed ? next : prev
    })
  }, [photos])

  const isExpanded = zoom >= SPLIT_ZOOM

  // All albums: user's albums + any from geotagged photos not already listed
  const allAlbums = (() => {
    const map = new Map<string, string>()
    for (const a of userAlbums) map.set(a.id, a.name)
    for (const p of photos) if (!map.has(p.albumId)) map.set(p.albumId, p.albumName)
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  })()

  // All uploaders derived from geotagged photos
  const allUploaders = Array.from(
    new Map(photos.map(p => [p.uploaderId ?? p.uploaderName, p.uploaderName])).entries()
  ).map(([id, name]) => ({ id, name }))

  // Count of items that are deselected (for the badge)
  const deselectedCount =
    allAlbums.filter(a => !checkedAlbums.has(a.id)).length +
    allUploaders.filter(u => !checkedUploaders.has(u.id)).length

  function toggleAlbum(id: string) {
    setCheckedAlbums(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }
  function toggleUploader(id: string) {
    setCheckedUploaders(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }
  function resetFilters() {
    setCheckedAlbums(new Set(allAlbums.map(a => a.id)))
    setCheckedUploaders(new Set(allUploaders.map(u => u.id)))
  }

  // Apply filters
  const filtered = photos.filter(p =>
    checkedAlbums.has(p.albumId) &&
    checkedUploaders.has(p.uploaderId ?? p.uploaderName)
  )

  // Build clusters (one per album, averaged position)
  const clusterMap = new Map<string, { photos: GeoPhoto[] }>()
  for (const p of filtered) {
    if (!clusterMap.has(p.albumId)) clusterMap.set(p.albumId, { photos: [] })
    clusterMap.get(p.albumId)!.photos.push(p)
  }

  const clusters: AlbumCluster[] = Array.from(clusterMap.entries()).map(([albumId, { photos: ps }]) => {
    const lat = ps.reduce((s, p) => s + p.lat, 0) / ps.length
    const lng = ps.reduce((s, p) => s + p.lng, 0) / ps.length
    return {
      albumId,
      albumName: ps[0].albumName,
      lat, lng,
      thumb: ps[0].url,
      photos: ps.map(p => ({
        url: p.url,
        caption: '',
        uploader: {
          id: p.uploaderId ?? p.uploaderName,
          name: p.uploaderName,
          initials: p.uploaderName.slice(0, 2).toUpperCase(),
          color: '#4a6358',
          avatar: `https://i.pravatar.cc/80?u=${p.uploaderId ?? p.uploaderName}`,
        },
      })),
    }
  })

  return (
    <div className="screen global-map-screen">
      <div className="global-map-header">
        <button className="icon-btn" onClick={() => navigate('/')}>
          <BackIcon />
        </button>
        <div className="map-header-title">
          <div className="trip-name-map">All Trips</div>
        </div>

        {/* Single filter chip */}
        <button
          className={`map-filter-chip${filterOpen ? ' open' : ''}`}
          onClick={() => setFilterOpen(v => !v)}
        >
          <FilterIcon />
          <span className="map-filter-label">Filters</span>
          {deselectedCount > 0 && (
            <span className="map-filter-badge">{deselectedCount}</span>
          )}
          <ChevronIcon />
        </button>
      </div>

      <div className="global-map-body">
        <MapContainer
          center={[20, 0]} zoom={3} minZoom={2}
          maxBounds={[[-90, -180], [90, 180]]} maxBoundsViscosity={1.0}
          scrollWheelZoom={true} zoomControl={false} attributionControl={false}
          className="global-map-leaflet"
        >
          <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            subdomains={['a', 'b', 'c']} noWrap={true} />
          <ZoomWatcher onZoom={setZoom} />

          {!isExpanded && clusters.map(c => (
            <Marker key={`c-${c.albumId}`} position={[c.lat, c.lng]}
              icon={makeClusterPin(c.thumb, '#1a3327', c.photos.length)}
              eventHandlers={{ click: () => setActivePin({ title: c.albumName, photos: c.photos }) }}
            />
          ))}

          {isExpanded && filtered.map(p => (
            <Marker key={`p-${p.id}`} position={[p.lat, p.lng]}
              icon={makePin(p.url, '#1a3327')}
              eventHandlers={{ click: () => setActivePin({
                title: p.albumName,
                photos: [{ url: p.url, caption: '', uploader: {
                  id: p.uploaderId ?? p.uploaderName,
                  name: p.uploaderName,
                  initials: p.uploaderName.slice(0, 2).toUpperCase(),
                  color: '#4a6358',
                  avatar: `https://i.pravatar.cc/80?u=${p.uploaderId ?? p.uploaderName}`,
                }}],
              })}}
            />
          ))}
        </MapContainer>

        {filtered.length === 0 && photos.length === 0 && (
          <div className="map-empty-overlay">
            <p>No geotagged photos yet.</p>
            <p>Upload photos with location data to see them here.</p>
          </div>
        )}

        {activePin && (
          <LocationDrawer title={activePin.title} photos={activePin.photos}
            onClose={() => setActivePin(null)} noNavOffset />
        )}
        {showModal && <LocationPermissionModal onDismiss={() => setShowModal(false)} />}
      </div>

      {/* Filter panel */}
      {filterOpen && (
        <>
          <div className="map-filter-backdrop" onClick={() => setFilterOpen(false)} />
          <div className="map-filter-panel">
            <div className="drawer-handle-bar" />
            <div className="map-filter-panel-header">
              <span className="map-filter-panel-title">Filters</span>
              {deselectedCount > 0 && (
                <button className="map-filter-reset" onClick={resetFilters}>Reset</button>
              )}
              <button className="map-filter-close" onClick={() => setFilterOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            {/* Albums */}
            <div className="map-filter-section">
              <p className="map-filter-section-title">Albums</p>
              {allAlbums.length === 0 ? (
                <p className="map-filter-empty">No albums yet</p>
              ) : allAlbums.map(a => (
                <label key={a.id} className="map-filter-row">
                  <input
                    type="checkbox"
                    className="map-filter-checkbox"
                    checked={checkedAlbums.has(a.id)}
                    onChange={() => toggleAlbum(a.id)}
                  />
                  <span className="map-filter-row-name">{a.name}</span>
                </label>
              ))}
            </div>

            {/* People */}
            {allUploaders.length > 0 && (
              <div className="map-filter-section">
                <p className="map-filter-section-title">People</p>
                {allUploaders.map(u => (
                  <label key={u.id} className="map-filter-row">
                    <input
                      type="checkbox"
                      className="map-filter-checkbox"
                      checked={checkedUploaders.has(u.id)}
                      onChange={() => toggleUploader(u.id)}
                    />
                    <span className="map-filter-row-name">{u.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
