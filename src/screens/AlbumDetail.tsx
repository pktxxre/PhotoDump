import { useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ALBUMS, getAlbumDayGroups, renameAlbum } from '../data'
import UserAvatar from '../components/UserAvatar'

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

export default function AlbumDetail() {
  const { id }    = useParams<{ id: string }>()
  const navigate  = useNavigate()
  const uploadRef = useRef<HTMLInputElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  const album     = ALBUMS.find(a => a.id === id) ?? ALBUMS[0]
  const dayGroups = getAlbumDayGroups(album.id)

  const [editing, setEditing] = useState(false)
  const [nameVal, setNameVal] = useState(album.name)

  function startEditing() {
    setNameVal(album.name)
    setEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 0)
  }

  function commitName() {
    const trimmed = nameVal.trim()
    if (trimmed) {
      renameAlbum(album.id, trimmed)
      album.name = trimmed
    } else {
      setNameVal(album.name)
    }
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitName()
    if (e.key === 'Escape') { setNameVal(album.name); setEditing(false) }
  }

  return (
    <div className="screen album-detail-screen">

      {/* Header */}
      <div className="album-detail-header">
        <button className="icon-btn" onClick={() => navigate('/')}>
          <BackIcon />
        </button>
        <div className="album-detail-title-group">
          {editing ? (
            <input
              ref={inputRef}
              className="album-name-input"
              value={nameVal}
              onChange={e => setNameVal(e.target.value)}
              onBlur={commitName}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <button className="album-detail-name-btn" onClick={startEditing}>
              <h2 className="album-detail-name">{album.name}</h2>
              <span className="album-name-edit-icon"><EditIcon /></span>
            </button>
          )}
          <span className="album-detail-date">{album.dateLabel}</span>
        </div>
        <div className="album-detail-header-right">
          <div className="album-detail-members">
            {album.members.slice(0, 3).map(u => (
              <UserAvatar key={u.id} user={u} size={26} />
            ))}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={uploadRef}
        type="file"
        accept="image/*,video/*"
        multiple
        style={{ display: 'none' }}
        onChange={() => {}}
      />

      {/* Content */}
      {dayGroups.length === 0 ? (
        <div className="album-empty-state">
          <p className="album-empty-title">No photos yet</p>
          <p className="album-empty-sub">Upload your first photos or videos to get started.</p>
          <button className="btn-primary" onClick={() => uploadRef.current?.click()}>
            <UploadIcon /> Upload Photos
          </button>
        </div>
      ) : (
        <>
          <div className="album-timeline-scroll">
            {dayGroups.map(group => (
              <div key={group.dateLabel + group.location} className="album-day-group">
                <div className="album-day-header">
                  <span className="album-day-date">{group.dateLabel}</span>
                  <span className="album-day-location">{group.location}</span>
                </div>
                <div className="album-day-grid">
                  {group.photos.map(p => (
                    <div key={p.id} className="album-photo-cell">
                      <img src={p.thumb} alt="" loading="lazy" />
                      <div className="album-photo-avatar">
                        <UserAvatar user={p.uploader} size={20} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="album-upload-bar">
            <button className="btn-primary" onClick={() => uploadRef.current?.click()}>
              <UploadIcon /> Upload New Photos
            </button>
          </div>
        </>
      )}

    </div>
  )
}
