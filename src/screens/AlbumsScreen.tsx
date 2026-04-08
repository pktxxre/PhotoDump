import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ALBUMS, USERS, deleteAlbum } from '../data'
import UserAvatar from '../components/UserAvatar'

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const DotsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
  </svg>
)

function AlbumTileMenu({ albumId, onClose }: { albumId: string; onClose: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    deleteAlbum(albumId)
    onClose()
  }

  function handleCopyLink(e: React.MouseEvent) {
    e.stopPropagation()
    const link = `${window.location.origin}${window.location.pathname}#/album/${albumId}`
    navigator.clipboard.writeText(link).catch(() => {})
    onClose()
  }

  return (
    <div ref={menuRef} className="album-tile-menu">
      <button className="album-tile-menu-item" onMouseDown={handleCopyLink}>
        Copy Link
      </button>
      <button className="album-tile-menu-item album-tile-menu-delete" onMouseDown={handleDelete}>
        Delete
      </button>
    </div>
  )
}

export default function AlbumsScreen() {
  const navigate = useNavigate()
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [, forceUpdate] = useState(0)

  function handleDotsClick(e: React.MouseEvent, albumId: string) {
    e.stopPropagation()
    setMenuOpenId(prev => prev === albumId ? null : albumId)
  }

  function closeMenu() {
    setMenuOpenId(null)
    forceUpdate(n => n + 1)
  }

  return (
    <div className="screen albums-root-screen">
      {/* Header */}
      <div className="albums-root-header">
        <button className="albums-profile-btn" onClick={() => navigate('/profile')}>
          <img src={USERS[0].avatar} alt={USERS[0].name} className="albums-profile-avatar" />
        </button>
        <span className="albums-root-brand">Field Journal</span>
        <div className="albums-header-actions">
          <button className="albums-map-btn" onClick={() => navigate('/map')}>
            <MapPinIcon />
            <span>Map</span>
          </button>
          <button className="albums-new-btn" onClick={() => navigate('/create')}>
            <PlusIcon />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="albums-root-hero">
        <h1 className="albums-root-display">Your Albums</h1>
        <p className="albums-root-sub">{ALBUMS.length} shared collections</p>
      </div>

      {/* 2-col square grid */}
      <div className="albums-root-scroll">
        <div className="albums-root-grid">
          {ALBUMS.map(album => (
            <div
              key={album.id}
              className="album-tile"
              onClick={() => navigate(`/album/${album.id}`)}
            >
              <div className="album-tile-cover">
                <img src={album.coverUrl} alt={album.name} loading="lazy" />
                <div className="album-tile-count">{album.photoCount}</div>
                <button
                  className="album-tile-dots"
                  onClick={e => handleDotsClick(e, album.id)}
                  aria-label="Album options"
                >
                  <DotsIcon />
                </button>
                {menuOpenId === album.id && (
                  <AlbumTileMenu albumId={album.id} onClose={closeMenu} />
                )}
              </div>
              <div className="album-tile-info">
                <p className="album-tile-name">{album.name}</p>
                <div className="album-tile-members">
                  {album.members.slice(0, 3).map(u => (
                    <UserAvatar key={u.id} user={u} size={20} />
                  ))}
                  {album.members.length > 3 && (
                    <span className="album-tile-overflow">+{album.members.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
