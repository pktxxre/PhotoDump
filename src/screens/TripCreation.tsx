import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { USERS, TRIP, createAlbum } from '../data'
import {
  XIcon, QuestionIcon, CameraAddIcon, CopyIcon,
} from '../components/Icons'
import UserAvatar from '../components/UserAvatar'

export default function TripCreation() {
  const navigate = useNavigate()
  const [tripName, setTripName] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(TRIP.inviteCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="screen creation-screen">
      {/* Header */}
      <div className="screen-header">
        <button className="icon-btn" onClick={() => navigate('/')}>
          <XIcon size={20} color="var(--primary)" />
        </button>
        <h2>{tripName || 'Your Trip Name'}</h2>
        <button className="icon-btn">
          <QuestionIcon size={20} color="var(--primary)" />
        </button>
      </div>

      {/* Scrollable form */}
      <div className="creation-scroll">
        <h1 className="display-title">Where to next?</h1>

        {/* Cover photo */}
        <div className="cover-photo-area">
          <div className="cam-icon">
            <CameraAddIcon size={24} color="var(--on-surface-variant)" />
          </div>
          <span className="cover-photo-label">ADD A COVER PHOTO TO SET THE MOOD</span>
        </div>

        {/* Trip name */}
        <div className="form-group">
          <label className="form-label">TRIP NAME</label>
          <input
            className="form-input"
            placeholder="e.g., The Solitude of Big Sur"
            value={tripName}
            onChange={e => setTripName(e.target.value)}
          />
        </div>

        {/* Invite friends */}
        <div className="invite-section">
          <h3>Invite Friends</h3>
          <p>
            Every journey is better reflected through different eyes.
            Share your code to build the journal together.
          </p>

          <div className="invite-code-row">
            <span className="invite-code-text">{TRIP.inviteCode}</span>
            <button className="icon-btn" onClick={handleCopy}>
              <CopyIcon size={18} color={copied ? 'var(--primary)' : 'var(--on-surface-variant)'} />
            </button>
          </div>

          <div className="invited-users">
            {USERS.slice(0, 2).map(u => (
              <UserAvatar key={u.id} user={u} size={32} />
            ))}
            <button className="add-member-btn">+</button>
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            const id = createAlbum(tripName)
            navigate(`/album/${id}`)
          }}
        >
          Begin the Journey &rarr;
        </button>
      </div>
    </div>
  )
}
