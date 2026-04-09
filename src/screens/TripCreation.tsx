import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createAlbum } from '../lib/albums'
import { XIcon, CameraAddIcon } from '../components/Icons'

export default function TripCreation() {
  const navigate = useNavigate()
  const [tripName, setTripName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate() {
    if (!tripName.trim()) return
    setLoading(true)
    setError('')
    const result = await createAlbum(tripName.trim())
    setLoading(false)
    if ('error' in result) { setError(result.error); return }
    navigate(`/album/${result.id}`)
  }

  return (
    <div className="screen creation-screen">
      <div className="screen-header">
        <button className="icon-btn" onClick={() => navigate('/')}>
          <XIcon size={20} color="var(--primary)" />
        </button>
        <h2>{tripName || 'Your Trip Name'}</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="creation-scroll">
        <h1 className="display-title">Where to next?</h1>

        <div className="cover-photo-area">
          <div className="cam-icon">
            <CameraAddIcon size={24} color="var(--on-surface-variant)" />
          </div>
          <span className="cover-photo-label">ADD A COVER PHOTO TO SET THE MOOD</span>
        </div>

        <div className="form-group">
          <label className="form-label">TRIP NAME</label>
          <input
            className="form-input"
            placeholder="e.g., The Solitude of Big Sur"
            value={tripName}
            onChange={e => setTripName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
        </div>

        {error && <p style={{ color: '#c0392b', fontSize: 13 }}>{error}</p>}

        <button
          className="btn-primary"
          onClick={handleCreate}
          disabled={loading || !tripName.trim()}
        >
          {loading ? 'Creating…' : 'Begin the Journey →'}
        </button>
      </div>
    </div>
  )
}
