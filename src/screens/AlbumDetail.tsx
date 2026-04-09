import { useRef, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchAlbum, renameAlbum, updateAlbumCover } from '../lib/albums'
import { uploadPhoto, extractMeta } from '../lib/uploadPhoto'
import { useAlbumPhotos } from '../hooks/useAlbumPhotos'
import type { Album } from '../lib/albums'
import type { AlbumDayGroup } from '../data'

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

interface LocalPhoto {
  localId: string
  blobUrl: string
  dateTaken: Date | null
  progress: number
  done: boolean
  error: boolean
}

const ME = {
  id: 'local-user',
  name: 'You',
  initials: 'YO',
  color: '#1a3327',
  avatar: 'https://i.pravatar.cc/80?img=3',
}

function groupLocalByDay(photos: LocalPhoto[]): AlbumDayGroup[] {
  const map = new Map<string, LocalPhoto[]>()
  for (const p of photos) {
    const key = (p.dateTaken ?? new Date()).toDateString()
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(p)
  }
  return Array.from(map.entries()).map(([key, dayPhotos]) => {
    const date = new Date(key)
    return {
      dateLabel: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      location: '',
      photos: dayPhotos.map(p => ({ id: p.localId, thumb: p.blobUrl, uploader: ME })),
    }
  })
}

export default function AlbumDetail() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const uploadRef = useRef<HTMLInputElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  const [album, setAlbum]     = useState<Album | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [editing, setEditing]  = useState(false)
  const [nameVal, setNameVal]  = useState('')
  const [localPhotos, setLocalPhotos] = useState<LocalPhoto[]>([])

  const { dayGroups: remoteGroups, loading: photosLoading, refetch } = useAlbumPhotos(id ?? '')

  useEffect(() => {
    if (!id) return
    fetchAlbum(id).then(a => {
      if (!a) { setNotFound(true); return }
      setAlbum(a)
      setNameVal(a.name)
    })
  }, [id])

  useEffect(() => () => { localPhotos.forEach(p => URL.revokeObjectURL(p.blobUrl)) }, [])

  const isUploading = localPhotos.some(p => !p.done && !p.error)
  const allDone     = localPhotos.length > 0 && localPhotos.every(p => p.done || p.error)
  const overallPct  = localPhotos.length
    ? localPhotos.reduce((s, p) => s + p.progress, 0) / localPhotos.length
    : 0

  // Once all uploads are done AND remote data has loaded, clear local blobs
  // that now exist in remoteGroups (to avoid duplicates)
  useEffect(() => {
    if (!allDone) return
    const remoteIds = new Set(remoteGroups.flatMap(g => g.photos.map(p => p.id)))
    const t = setTimeout(() => {
      setLocalPhotos(prev => {
        // Keep photos that failed OR are not yet in remote data
        const keep = prev.filter(p => p.error || !remoteIds.size)
        return keep
      })
    }, 1500)
    return () => clearTimeout(t)
  }, [allDone, remoteGroups])

  // Always show all local photos (blob URLs are always valid for the session)
  const localGroups = groupLocalByDay(localPhotos)

  // Merge local + remote, deduplicate by dateLabel
  const mergedGroups: AlbumDayGroup[] = []
  const seen = new Set<string>()
  for (const g of [...localGroups, ...remoteGroups]) {
    if (seen.has(g.dateLabel)) {
      const existing = mergedGroups.find(x => x.dateLabel === g.dateLabel)!
      const ids = new Set(existing.photos.map(p => p.id))
      for (const p of g.photos) if (!ids.has(p.id)) existing.photos.push(p)
    } else {
      mergedGroups.push({ ...g, photos: [...g.photos] })
      seen.add(g.dateLabel)
    }
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length || !id) return
    e.target.value = ''

    const newLocals: LocalPhoto[] = await Promise.all(
      files.map(async file => {
        const meta = await extractMeta(file)
        return {
          localId: `local-${Date.now()}-${Math.random()}`,
          blobUrl: URL.createObjectURL(file),
          dateTaken: meta.dateTaken ?? null,
          progress: 0,
          done: false,
          error: false,
        }
      })
    )
    setLocalPhotos(prev => [...prev, ...newLocals])

    for (let i = 0; i < files.length; i++) {
      const localId = newLocals[i].localId
      const result = await uploadPhoto(files[i], id, pct => {
        setLocalPhotos(prev => prev.map(p => p.localId === localId ? { ...p, progress: pct } : p))
      })
      setLocalPhotos(prev =>
        prev.map(p => p.localId === localId
          ? { ...p, progress: 100, done: true, error: !result }
          : p)
      )
      // Set cover photo if this is the first upload
      if (result && album && !album.coverUrl) {
        await updateAlbumCover(id, result.url)
        setAlbum(a => a ? { ...a, coverUrl: result.url } : a)
      }
    }
    refetch()
  }

  function startEditing() {
    setEditing(true)
    setTimeout(() => { inputRef.current?.focus(); inputRef.current?.select() }, 0)
  }

  async function commitName() {
    const trimmed = nameVal.trim()
    if (trimmed && album && trimmed !== album.name) {
      await renameAlbum(album.id, trimmed)
      setAlbum(a => a ? { ...a, name: trimmed } : a)
    } else {
      setNameVal(album?.name ?? '')
    }
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitName()
    if (e.key === 'Escape') { setNameVal(album?.name ?? ''); setEditing(false) }
  }

  if (notFound) return (
    <div className="screen album-detail-screen">
      <div className="album-empty-state">
        <p className="album-empty-title">Album not found</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Go back</button>
      </div>
    </div>
  )

  if (!album) return (
    <div className="screen album-detail-screen">
      <div className="album-empty-state"><p className="album-empty-sub">Loading…</p></div>
    </div>
  )

  const hasContent = mergedGroups.length > 0

  return (
    <div className="screen album-detail-screen">

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
          <span className="album-detail-date">
            {album.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>
        <div style={{ width: 36 }} />
      </div>

      <input
        ref={uploadRef}
        type="file"
        accept="image/*,video/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFiles}
      />

      {localPhotos.length > 0 && (
        <div className={`upload-banner${allDone ? ' upload-banner-done' : ''}`}>
          <div className="upload-banner-text">
            {allDone
              ? `${localPhotos.filter(p => p.done).length} photo${localPhotos.length !== 1 ? 's' : ''} uploaded`
              : `Uploading ${localPhotos.filter(p => p.done).length + 1} of ${localPhotos.length}…`}
          </div>
          <div className="upload-banner-bar-wrap">
            <div className="upload-banner-bar-fill" style={{ width: `${overallPct}%` }} />
          </div>
        </div>
      )}

      {!photosLoading && !hasContent ? (
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
            {mergedGroups.map(group => (
              <div key={group.dateLabel + group.location} className="album-day-group">
                <div className="album-day-header">
                  <span className="album-day-date">{group.dateLabel}</span>
                  {group.location && <span className="album-day-location">{group.location}</span>}
                </div>
                <div className="album-day-grid">
                  {group.photos.map(p => {
                    const local = localPhotos.find(lp => lp.localId === p.id)
                    return (
                      <div key={p.id} className="album-photo-cell">
                        <img src={p.thumb} alt="" loading="lazy" />
                        {local && !local.done && (
                          <div className="photo-upload-overlay">
                            <div className="photo-upload-ring">
                              <svg viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                                <circle
                                  cx="18" cy="18" r="15" fill="none" stroke="#fff" strokeWidth="3"
                                  strokeDasharray={`${2 * Math.PI * 15}`}
                                  strokeDashoffset={`${2 * Math.PI * 15 * (1 - local.progress / 100)}`}
                                  strokeLinecap="round"
                                  transform="rotate(-90 18 18)"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                        {local?.error && (
                          <div className="photo-upload-overlay photo-upload-error">
                            <span className="photo-error-icon">!</span>
                          </div>
                        )}
                        <div className="album-photo-avatar">
                          <img
                            className="album-photo-uploader-img"
                            src={p.uploader.avatar}
                            alt={p.uploader.name}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="album-upload-bar">
            <button
              className="btn-primary"
              onClick={() => uploadRef.current?.click()}
              disabled={isUploading}
            >
              <UploadIcon />
              {isUploading ? 'Uploading…' : 'Upload New Photos'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
