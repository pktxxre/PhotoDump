import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { supabase } from '../lib/supabase'
import LocationDrawer from '../components/LocationDrawer'
import LocationPermissionModal, { shouldShowLocationModal } from '../components/LocationPermissionModal'
import type { LocationPhoto } from '../types'

const SPLIT_ZOOM = 7

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)
const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
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

function FilterDropdown({
  label, options, value, onChange,
}: {
  label: string
  options: { id: string; name: string; avatar?: string }[]
  value: string
  onChange: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find(o => o.id === value)

  return (
    <div className="map-filter-wrap">
      <button className={`map-filter-chip ${open ? 'open' : ''}`} onClick={() => setOpen(v => !v)}>
        {selected?.avatar && <img className="map-filter-avatar" src={selected.avatar} alt="" />}
        <span className="map-filter-label">{selected?.name ?? label}</span>
        <ChevronIcon />
      </button>
      {open && (
        <div className="map-filter-menu">
          {options.map(opt => (
            <button
              key={opt.id}
              className={`map-filter-option ${value === opt.id ? 'active' : ''}`}
              onMouseDown={() => { onChange(opt.id); setOpen(false) }}
            >
              {opt.avatar && <img className="map-filter-option-avatar" src={opt.avatar} alt="" />}
              {opt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function GlobalMapScreen() {
  const navigate = useNavigate()
  const [zoom, setZoom]           = useState(3)
  const [photos, setPhotos]       = useState<GeoPhoto[]>([])
  const [activePin, setActivePin] = useState<{ title: string; photos: LocationPhoto[] } | null>(null)
  const [showModal, setShowModal] = useState(() => shouldShowLocationModal())
  const [albumFilter, setAlbumFilter]     = useState('all')
  const [uploaderFilter, setUploaderFilter] = useState('all')

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

  const isExpanded = zoom >= SPLIT_ZOOM

  // Unique albums + uploaders for filters
  const albumOptions = [
    { id: 'all', name: 'Album' },
    ...Array.from(new Map(photos.map(p => [p.albumId, p.albumName])).entries())
      .map(([id, name]) => ({ id, name })),
  ]
  const uploaderOptions = [
    { id: 'all', name: 'Person' },
    ...Array.from(new Map(photos.map(p => [p.uploaderId ?? p.uploaderName, p.uploaderName])).entries())
      .map(([id, name]) => ({ id: id ?? name, name })),
  ]

  // Apply filters
  const filtered = photos.filter(p => {
    if (albumFilter !== 'all' && p.albumId !== albumFilter) return false
    if (uploaderFilter !== 'all' && (p.uploaderId ?? p.uploaderName) !== uploaderFilter) return false
    return true
  })

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
      lat,
      lng,
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
        <div className="map-filters-row">
          <FilterDropdown label="Album" options={albumOptions} value={albumFilter}
            onChange={v => { setAlbumFilter(v); setActivePin(null) }} />
          <FilterDropdown label="Person" options={uploaderOptions} value={uploaderFilter}
            onChange={v => { setUploaderFilter(v); setActivePin(null) }} />
        </div>
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
    </div>
  )
}
