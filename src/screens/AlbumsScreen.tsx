import { useNavigate } from 'react-router-dom'
import { ALBUMS } from '../data'
import UserAvatar from '../components/UserAvatar'

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export default function AlbumsScreen() {
  const navigate = useNavigate()

  return (
    <div className="screen albums-root-screen">
      {/* Header */}
      <div className="albums-root-header">
        <span className="albums-root-brand">Field Journal</span>
        <button className="albums-new-btn" onClick={() => navigate('/create')}>
          <PlusIcon />
        </button>
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
