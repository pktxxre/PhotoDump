import { useState, useEffect, useRef } from 'react'
import { useAlbumPhotos } from '../hooks/useAlbumPhotos'
import { uploadPhoto, extractMeta } from '../lib/uploadPhoto'
import { updateAlbumCover } from '../lib/albums'
import PhotoViewer from './PhotoViewer'
import type { Album } from '../lib/albums'
import type { AlbumDayGroup } from '../data'

interface LocalPhoto {
  localId: string
  blobUrl: string
  uploadedUrl: string | null
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

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

interface Props {
  album: Album
  originRect: DOMRect
  onClose: () => void
  onAlbumUpdate: (patch: Partial<Album>) => void
}

export default function AlbumExpanded({ album: initialAlbum, originRect, onClose, onAlbumUpdate }: Props) {
  const [album, setAlbum] = useState(initialAlbum)
  const [open, setOpen]   = useState(false)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [localPhotos, setLocalPhotos] = useState<LocalPhoto[]>([])

  // Drag-to-close state
  const [dragY, setDragY]     = useState(0)
  const [dragging, setDragging] = useState(false)
  const dragStartY = useRef<number | null>(null)

  const uploadRef = useRef<HTMLInputElement>(null)

  const { dayGroups: remoteGroups, loading: photosLoading, refetch } = useAlbumPhotos(album.id)

  // Trigger expand on mount
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)))
    return () => cancelAnimationFrame(id)
  }, [])

  // Revoke blob URLs on unmount
  useEffect(() => () => { localPhotos.forEach(p => URL.revokeObjectURL(p.blobUrl)) }, [])

  // Drop local photo once its URL appears in remote data
  useEffect(() => {
    if (localPhotos.length === 0) return
    const remoteUrls = new Set(remoteGroups.flatMap(g => g.photos.map(p => p.thumb)))
    setLocalPhotos(prev => {
      const next = prev.filter(p => p.error || !p.uploadedUrl || !remoteUrls.has(p.uploadedUrl))
      return next.length === prev.length ? prev : next
    })
  }, [remoteGroups])

  const isUploading = localPhotos.some(p => !p.done && !p.error)
  const allDone     = localPhotos.length > 0 && localPhotos.every(p => p.done || p.error)
  const overallPct  = localPhotos.length
    ? localPhotos.reduce((s, p) => s + p.progress, 0) / localPhotos.length
    : 0

  // Merge remote + local (remote first so new photos land at bottom)
  const localGroups = groupLocalByDay(localPhotos)
  const mergedGroups: AlbumDayGroup[] = []
  const seen = new Set<string>()
  for (const g of [...remoteGroups, ...localGroups]) {
    if (seen.has(g.dateLabel)) {
      const existing = mergedGroups.find(x => x.dateLabel === g.dateLabel)!
      const ids = new Set(existing.photos.map(p => p.id))
      for (const p of g.photos) if (!ids.has(p.id)) existing.photos.push(p)
    } else {
      mergedGroups.push({ ...g, photos: [...g.photos] })
      seen.add(g.dateLabel)
    }
  }

  const hasContent = mergedGroups.length > 0
  const allViewerPhotos = mergedGroups.flatMap(g =>
    g.photos.map(p => ({ url: p.thumb, uploaderName: p.uploader.name, uploaderAvatar: p.uploader.avatar }))
  )

  function doClose() {
    setOpen(false)
    setDragY(0)
    setTimeout(onClose, 360)
  }

  // Cover swipe-down-to-close (only fires when touch starts on the cover zone,
  // above the sheet — won't conflict with sheet scroll)
  function onCoverTouchStart(e: React.TouchEvent) {
    dragStartY.current = e.touches[0].clientY
  }
  function onCoverTouchMove(e: React.TouchEvent) {
    if (dragStartY.current === null) return
    const dy = e.touches[0].clientY - dragStartY.current
    if (dy > 0) { setDragging(true); setDragY(dy) }
  }
  function onCoverTouchEnd() {
    dragStartY.current = null
    if (dragY > 90) { doClose() } else { setDragY(0); setDragging(false) }
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    e.target.value = ''

    const newLocals: LocalPhoto[] = await Promise.all(
      files.map(async file => {
        const meta = await extractMeta(file)
        return {
          localId: `local-${Date.now()}-${Math.random()}`,
          blobUrl: URL.createObjectURL(file),
          uploadedUrl: null,
          dateTaken: meta.dateTaken ?? null,
          progress: 0, done: false, error: false,
        }
      })
    )
    setLocalPhotos(prev => [...prev, ...newLocals])

    for (let i = 0; i < files.length; i++) {
      const localId = newLocals[i].localId
      const result = await uploadPhoto(files[i], album.id, pct => {
        setLocalPhotos(prev => prev.map(p => p.localId === localId ? { ...p, progress: pct } : p))
      })
      setLocalPhotos(prev =>
        prev.map(p => p.localId === localId
          ? { ...p, progress: 100, done: true, error: !result, uploadedUrl: result?.url ?? null }
          : p)
      )
      if (result && !album.coverUrl) {
        await updateAlbumCover(album.id, result.url)
        setAlbum(a => ({ ...a, coverUrl: result.url }))
        onAlbumUpdate({ coverUrl: result.url })
      }
    }
    refetch()
  }

  // Overlay position: tile rect → full screen
  const closedStyle = {
    top:    originRect.top,
    left:   originRect.left,
    width:  originRect.width,
    height: originRect.height,
    borderRadius: 20, // matches .album-tile-cover border-radius: var(--radius-lg)
  }
  const openStyle = { top: 0, left: 0, width: '100%', height: '100%', borderRadius: 0 }
  const posStyle  = open ? openStyle : closedStyle

  // Rubber-band drag offset (soften above ~100px)
  const visualDragY = dragging ? Math.min(dragY, 100) + Math.max(0, dragY - 100) * 0.25 : 0

  return (
    <>
      <div
        className={`ae-overlay${open ? ' ae-open' : ''}${dragging ? ' ae-dragging' : ''}`}
        style={{ ...posStyle, transform: visualDragY > 0 ? `translateY(${visualDragY}px)` : undefined }}
      >
        {/* ── Top half: cover photo ── */}
        <div
          className="ae-hero"
          onTouchStart={onCoverTouchStart}
          onTouchMove={onCoverTouchMove}
          onTouchEnd={onCoverTouchEnd}
        >
          {album.coverUrl
            ? <img src={album.coverUrl} className="ae-cover-img" alt="" />
            : <div className="ae-cover-placeholder" />}
          <div className="ae-cover-gradient" />

          <button className="ae-back" onClick={doClose} aria-label="Back">
            <BackIcon />
          </button>

          <div className="ae-cover-meta">
            <h2 className="ae-cover-name">{album.name}</h2>
            <p className="ae-cover-date">
              {album.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* ── Bottom half: photos on surface background ── */}
        <div className="ae-body">
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

          <div className="ae-scroll">
            {photosLoading && !hasContent ? (
              <div className="ae-skeleton-grid">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="ae-skeleton-cell skeleton-block" />
                ))}
              </div>
            ) : !photosLoading && !hasContent ? (
              <div className="ae-empty-state">
                <p className="ae-empty-title">No photos yet</p>
                <p className="ae-empty-sub">Tap below to start uploading.</p>
              </div>
            ) : (
              (() => {
                let flatIdx = 0
                return mergedGroups.map(group => (
                  <div key={group.dateLabel} className="album-day-group">
                    <div className="album-day-header">
                      <span className="album-day-date">{group.dateLabel}</span>
                      {group.location && <span className="album-day-location">{group.location}</span>}
                    </div>
                    <div className="album-day-grid">
                      {group.photos.map(p => {
                        const photoIdx = flatIdx++
                        const local = localPhotos.find(lp => lp.localId === p.id)
                        return (
                          <div key={p.id} className="album-photo-cell" onClick={() => setViewerIndex(photoIdx)}>
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
                                      strokeLinecap="round" transform="rotate(-90 18 18)"
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
                              <img className="album-photo-uploader-img" src={p.uploader.avatar} alt={p.uploader.name} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))
              })()
            )}
          </div>

          <div className="ae-upload-bar">
            <button className="btn-primary" onClick={() => uploadRef.current?.click()} disabled={isUploading}>
              <UploadIcon />
              {isUploading ? 'Uploading…' : 'Upload Photos'}
            </button>
          </div>
        </div>

        <input ref={uploadRef} type="file" accept="image/*,video/*" multiple style={{ display: 'none' }} onChange={handleFiles} />
      </div>

      {viewerIndex !== null && (
        <PhotoViewer photos={allViewerPhotos} initialIndex={viewerIndex} onClose={() => setViewerIndex(null)} />
      )}
    </>
  )
}
