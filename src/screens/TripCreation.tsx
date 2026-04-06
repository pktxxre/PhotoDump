import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { USERS, TRIP } from '../data'
import {
  XIcon, QuestionIcon, CameraAddIcon, CalendarIcon, CopyIcon,
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
        <h2>{TRIP.name}</h2>
        <button className="icon-btn">
          <QuestionIcon size={20} color="var(--primary)" />
        </button>
      </div>

      {/* Scrollable form */}
      <div className="creation-scroll">
        <div>
          <h1 className="display-title">Where to next?</h1>
        </div>
        <p className="display-subtitle">
          Take a breath, clear your mind, and let the road reveal itself.
          Your next field journal starts here.
        </p>

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

        {/* Date range */}
        <div className="form-group">
          <label className="form-label">DATE RANGE</label>
          <div className="date-range-field">
            <CalendarIcon size={18} color="var(--outline-variant)" />
            <span>Select starting day...</span>
            <span className="end-date">End date</span>
          </div>
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

        <p className="trip-quote">"The road goes ever on and on..."</p>

        <button
          className="btn-primary"
          onClick={() => navigate('/')}
        >
          Begin the Journey &rarr;
        </button>
      </div>
    </div>
  )
}
