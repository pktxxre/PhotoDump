import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ColorPicker from '../components/ColorPicker'
import { supabase } from '../lib/supabase'
import { useAlbums } from '../hooks/useAlbums'

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const PencilIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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

const BUDDIES = [
  { id: 'b1', name: 'Maya',   avatar: 'https://i.pravatar.cc/80?img=9'  },
  { id: 'b2', name: 'Julian', avatar: 'https://i.pravatar.cc/80?img=12' },
  { id: 'b3', name: 'Elena',  avatar: 'https://i.pravatar.cc/80?img=16' },
  { id: 'b4', name: 'Cass',   avatar: 'https://i.pravatar.cc/80?img=20' },
]

export default function ProfileScreen() {
  const navigate = useNavigate()
  const [mapColor, setMapColor] = useState('1a3327')
  const [mapAlpha, setMapAlpha] = useState(1)
  const { albums } = useAlbums()
  const [userEmail, setUserEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? '')
      setAvatarUrl(data.user?.user_metadata?.avatar_url ?? null)
    })
  }, [])

  return (
    <div className="screen profile-screen">

      {/* Header */}
      <div className="profile-header">
        <button className="icon-btn" onClick={() => navigate('/')}>
          <BackIcon />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="profile-scroll">

        {/* Avatar */}
        <div className="profile-avatar-wrap">
          {avatarUrl
            ? <img className="profile-avatar-img" src={avatarUrl} alt="Profile" style={{ borderColor: `#${mapColor}` }} />
            : <div className="profile-avatar-placeholder" style={{ borderColor: `#${mapColor}` }}>{userEmail.slice(0, 2).toUpperCase()}</div>
          }
          <button className="profile-avatar-edit" aria-label="Edit photo">
            <PencilIcon />
          </button>
        </div>

        {/* Name + subtitle */}
        <h1 className="profile-name">{userEmail.split('@')[0] || 'Explorer'}</h1>
        <p className="profile-subtitle">Wanderer &amp; Chronicler</p>

        {/* Stats */}
        <div className="profile-stats">
          <div className="profile-stat-card">
            <span className="profile-stat-num">{albums.length}</span>
            <span className="profile-stat-label">ALBUMS</span>
          </div>
        </div>

        {/* Map color */}
        <div className="profile-section">
          <div className="profile-section-header">
            <span className="profile-section-title">Your Map Color</span>
            <span className="profile-section-hint">Visible on shared routes</span>
          </div>
          <div className="profile-color-preview" style={{ background: `#${mapColor}` }} />
          <ColorPicker
            value={mapColor}
            alpha={mapAlpha}
            onChange={(hex, a) => { setMapColor(hex); setMapAlpha(a) }}
          />
        </div>

        {/* Travel Buddies */}
        <div className="profile-section">
          <div className="profile-section-header">
            <span className="profile-section-title">Travel Buddies</span>
          </div>
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
              <span className="profile-buddy-name">Inv...</span>
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
    </div>
  )
}
