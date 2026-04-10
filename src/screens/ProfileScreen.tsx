import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ColorPicker from '../components/ColorPicker'
import { supabase } from '../lib/supabase'
import { useAlbums } from '../hooks/useAlbums'

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const CameraIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
)

const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const BUDDIES = [
  { id: 'b1', name: 'Maya',   avatar: 'https://i.pravatar.cc/80?img=9'  },
  { id: 'b2', name: 'Julian', avatar: 'https://i.pravatar.cc/80?img=12' },
  { id: 'b3', name: 'Elena',  avatar: 'https://i.pravatar.cc/80?img=16' },
  { id: 'b4', name: 'Cass',   avatar: 'https://i.pravatar.cc/80?img=20' },
]

// ── Avatar Cropper ────────────────────────────────────────────
const CROP_SIZE = 240

function AvatarCropper({ file, onConfirm, onCancel }: {
  file: File
  onConfirm: (blob: Blob) => void
  onCancel: () => void
}) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [imageUrl] = useState(() => URL.createObjectURL(file))
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 })
  const [baseScale, setBaseScale] = useState(1)
  const [userScale, setUserScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null)

  const totalScale = baseScale * userScale
  const displayW = naturalSize.w * totalScale
  const displayH = naturalSize.h * totalScale

  function clamp(ox: number, oy: number, dw: number, dh: number) {
    return {
      x: Math.min(0, Math.max(CROP_SIZE - dw, ox)),
      y: Math.min(0, Math.max(CROP_SIZE - dh, oy)),
    }
  }

  const handleLoad = () => {
    const img = imgRef.current!
    const bs = Math.max(CROP_SIZE / img.naturalWidth, CROP_SIZE / img.naturalHeight)
    const dw = img.naturalWidth * bs
    const dh = img.naturalHeight * bs
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
    setBaseScale(bs)
    setUserScale(1)
    setOffset({ x: (CROP_SIZE - dw) / 2, y: (CROP_SIZE - dh) / 2 })
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    setOffset(clamp(dragRef.current.ox + dx, dragRef.current.oy + dy, displayW, displayH))
  }

  const handlePointerUp = () => { dragRef.current = null }

  const handleZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = parseFloat(e.target.value)
    const nextTotal = baseScale * next
    const dw = naturalSize.w * nextTotal
    const dh = naturalSize.h * nextTotal
    setUserScale(next)
    setOffset(prev => clamp(prev.x, prev.y, dw, dh))
  }

  const handleConfirm = () => {
    const OUTPUT = 600
    const canvas = document.createElement('canvas')
    canvas.width = OUTPUT
    canvas.height = OUTPUT
    const ctx = canvas.getContext('2d')!
    const img = imgRef.current!
    const srcX = -offset.x / totalScale
    const srcY = -offset.y / totalScale
    const srcW = CROP_SIZE / totalScale
    const srcH = CROP_SIZE / totalScale
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUTPUT, OUTPUT)
    canvas.toBlob(blob => { if (blob) onConfirm(blob) }, 'image/jpeg', 0.92)
  }

  return (
    <div className="avatar-cropper-overlay">
      <div className="avatar-cropper-sheet">
        <div className="drawer-handle-bar" />
        <p className="avatar-cropper-title">Adjust Photo</p>

        <div
          className="avatar-cropper-circle"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <img
            ref={imgRef}
            src={imageUrl}
            onLoad={handleLoad}
            draggable={false}
            style={{
              position: 'absolute',
              left: offset.x,
              top: offset.y,
              width: displayW,
              height: displayH,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
        </div>

        <p className="avatar-cropper-hint">Drag to reposition</p>

        <input
          type="range"
          className="avatar-cropper-zoom"
          min={1} max={3} step={0.01}
          value={userScale}
          onChange={handleZoom}
        />

        <div className="avatar-cropper-actions">
          <button className="avatar-cropper-cancel" onClick={onCancel}>Cancel</button>
          <button className="avatar-cropper-confirm" onClick={handleConfirm}>Use Photo</button>
        </div>
      </div>
    </div>
  )
}

// ── Profile Screen ────────────────────────────────────────────
export default function ProfileScreen() {
  const navigate = useNavigate()
  const [mapColor, setMapColor] = useState(() => localStorage.getItem('mapColor') ?? '1a3327')
  const [savedColor, setSavedColor] = useState(() => localStorage.getItem('mapColor') ?? '1a3327')
  const { albums } = useAlbums()
  const totalPhotos = albums.reduce((sum, a) => sum + a.photoCount, 0)
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [pendingAvatar, setPendingAvatar] = useState<File | null>(null)
  const [pendingAvatarPreview, setPendingAvatarPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const isDirty = mapColor !== savedColor || pendingAvatar !== null

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? '')
      setUserId(data.user?.id ?? null)
      setAvatarUrl(data.user?.user_metadata?.avatar_url ?? null)
    })
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCropFile(file)
    e.target.value = ''
  }

  const handleCropConfirm = (blob: Blob) => {
    const cropped = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
    setPendingAvatar(cropped)
    setPendingAvatarPreview(URL.createObjectURL(blob))
    setCropFile(null)
  }

  const handleSave = async () => {
    if (!isDirty) return
    setSaving(true)
    try {
      if (pendingAvatar && userId) {
        const path = `avatars/${userId}/avatar.jpg`
        const { error } = await supabase.storage
          .from('photos')
          .upload(path, pendingAvatar, { contentType: 'image/jpeg', upsert: true })
        if (error) {
          console.error('Avatar upload failed:', error.message)
        } else {
          const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(path)
          await supabase.auth.updateUser({ data: { avatar_url: publicUrl } })
          setAvatarUrl(publicUrl)
          setPendingAvatar(null)
          setPendingAvatarPreview(null)
        }
      }
      localStorage.setItem('mapColor', mapColor)
      setSavedColor(mapColor)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2200)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="screen profile-screen">

      {/* Header */}
      <div className="profile-header">
        <button className="icon-btn" onClick={() => navigate('/')}>
          <BackIcon />
        </button>
        <span className="profile-header-title">Profile</span>
        <div className="profile-header-spacer" />
      </div>

      {/* Scrollable body */}
      <div className="profile-scroll">

        {/* Avatar */}
        <label className="profile-avatar-wrap" aria-label="Change profile photo">
          {(pendingAvatarPreview ?? avatarUrl)
            ? <img className="profile-avatar-img" src={pendingAvatarPreview ?? avatarUrl!} alt="Profile" style={{ borderColor: `#${mapColor}` }} />
            : <div className="profile-avatar-placeholder" style={{ borderColor: `#${mapColor}` }}>{userEmail.slice(0, 2).toUpperCase()}</div>
          }
          <div className="profile-avatar-edit" aria-label="Change photo">
            <CameraIcon />
          </div>
          <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
        </label>

        {/* Name */}
        <h1 className="profile-name">{userEmail.split('@')[0] || 'Explorer'}</h1>
        <p className="profile-handle">@{userEmail.split('@')[0] || 'traveler'}</p>

        {/* Stats */}
        <div className="profile-stats">
          <div className="profile-stat-card">
            <span className="profile-stat-num">{albums.length}</span>
            <span className="profile-stat-label">Albums</span>
          </div>
          <div className="profile-stat-card">
            <span className="profile-stat-num">{totalPhotos}</span>
            <span className="profile-stat-label">Photos</span>
          </div>
        </div>

        {/* Accent color */}
        <div className="profile-section">
          <div className="profile-section-header">
            <span className="profile-section-title">Accent Color</span>
            <div className="profile-color-preview" style={{ background: `#${mapColor}` }} />
          </div>
          <p className="profile-section-subtitle">Colors your map pins and profile ring</p>
          <ColorPicker
            value={mapColor}
            onChange={(hex) => setMapColor(hex)}
          />
        </div>

        {/* Travel Buddies */}
        <div className="profile-section">
          <div className="profile-section-header">
            <span className="profile-section-title">Travel Buddies</span>
          </div>
          <p className="profile-section-subtitle" style={{ marginBottom: 14 }}>Friends who can view and add to your trips</p>
          <div className="profile-buddies-scroll">
            {BUDDIES.map(b => (
              <div key={b.id} className="profile-buddy">
                <img className="profile-buddy-avatar" src={b.avatar} alt={b.name} />
                <span className="profile-buddy-name">{b.name}</span>
              </div>
            ))}
            <div className="profile-buddy">
              <div className="profile-buddy-invite">
                <span>+</span>
              </div>
              <span className="profile-buddy-name">Invite</span>
            </div>
          </div>
        </div>

        {/* Settings rows */}
        <div className="profile-settings">
          <button className="profile-settings-row">
            <span>Account Settings</span>
            <ChevronIcon />
          </button>
          <button className="profile-settings-row">
            <span>Privacy Preferences</span>
            <ChevronIcon />
          </button>
        </div>

        {/* Log out */}
        <button
          className="profile-logout"
          onClick={async () => { await supabase.auth.signOut(); navigate('/login') }}
        >
          <span>Log Out</span>
          <LogoutIcon />
        </button>

      </div>

      {/* Sticky save bar — slides up when dirty */}
      <div className={`profile-save-bar${isDirty ? ' is-dirty' : ''}`}>
        <button
          className="profile-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {/* Saved toast */}
      <div className={`profile-toast${showToast ? ' visible' : ''}`}>
        <CheckIcon />
        Changes saved
      </div>

      {/* Avatar cropper */}
      {cropFile && (
        <AvatarCropper
          file={cropFile}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropFile(null)}
        />
      )}
    </div>
  )
}
