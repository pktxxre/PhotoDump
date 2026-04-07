import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ALBUMS, DAY_GROUPS, getAlbumPhotos, getAlbumLocations } from '../data'
import UserAvatar from '../components/UserAvatar'
import AlbumMap from '../components/AlbumMap'

type Tab = 'photos' | 'map' | 'journal'

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="5" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="19" r="1" fill="currentColor" />
  </svg>
)

export default function AlbumDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('photos')

  const album = ALBUMS.find(a => a.id === id) ?? ALBUMS[0]
  const photos = getAlbumPhotos(album.id, album.photoCount > 20 ? 18 : album.photoCount)
  const locations = getAlbumLocations(album.id)

  // Compute a sensible map center from locations
  const avgLat = locations.reduce((s, l) => s + l.lat, 0) / locations.length
  const avgLng = locations.reduce((s, l) => s + l.lng, 0) / locations.length

  return (
    <div className="screen album-detail-screen">
      {/* Header */}
      <div className="album-detail-header">
        <button className="icon-btn" onClick={() => navigate('/')}>
          <BackIcon />
        </button>
        <div className="album-detail-title-group">
          <h2 className="album-detail-name">{album.name}</h2>
          <span className="album-detail-date">{album.dateLabel}</span>
        </div>
        <div className="album-detail-header-right">
          <div className="album-detail-members">
            {album.members.slice(0, 3).map(u => (
              <UserAvatar key={u.id} user={u} size={26} />
            ))}
          </div>
          <button className="icon-btn"><MoreIcon /></button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="album-tabs-bar">
        {(['photos', 'map', 'journal'] as Tab[]).map(t => (
          <button
            key={t}
            className={`album-tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="album-tab-content">
        {tab === 'photos' && (
          <div className="album-photos-grid">
            {photos.map(p => (
              <div key={p.id} className="album-photo-cell">
                <img src={p.thumb} alt="" loading="lazy" />
                <div className="album-photo-avatar">
                  <UserAvatar user={p.uploader} size={20} />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'map' && (
          <AlbumMap
            locations={locations}
            center={[avgLat, avgLng]}
            zoom={9}
          />
        )}

        {tab === 'journal' && (
          <div className="album-journal-scroll">
            {DAY_GROUPS.map(group => (
              <div key={group.dateLabel} className="day-section">
                <div className="day-meta">{group.dateLabel}</div>
                <h2 className="day-title">{group.dayTitle}</h2>
                {group.photos.map(photo => (
                  <div key={photo.id} className="gallery-photo-card">
                    <img src={photo.url} alt={photo.caption} loading="lazy" />
                    <div className="gallery-card-meta">
                      {photo.caption
                        ? <p className="gallery-caption">{photo.caption}</p>
                        : <p className="gallery-location">{photo.location.name}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
