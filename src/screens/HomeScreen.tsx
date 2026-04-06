import { useNavigate } from 'react-router-dom'
import { TRIPS, USERS } from '../data'
import type { TripEntry } from '../types'
import UserAvatar from '../components/UserAvatar'
import HomeNav from '../components/HomeNav'

const BarChartIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

const ChevronDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="3" y1="7" x2="21" y2="7" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="17" x2="21" y2="17" />
  </svg>
)

function TripCard({ trip, onClick }: { trip: TripEntry; onClick: () => void }) {
  const { cover, name, location, dateLabel, durationLabel, description, members, otherCount, isSolo } = trip
  const me = USERS[0]

  return (
    <article className="trip-entry-card" onClick={onClick}>
      {/* Cover area */}
      {cover.type === 'photo' ? (
        <div className="trip-cover-photo">
          <img src={cover.url} alt={name} loading="lazy" />
          {cover.dateBadge && (
            <div className="cover-date-badge">{cover.dateBadge}</div>
          )}
          {cover.label && (
            <div className="cover-photo-label-overlay">{cover.label}</div>
          )}
        </div>
      ) : (
        <div className="trip-cover-illustrated" style={{ background: cover.gradient }}>
          {cover.icon && <div className="illustrated-icon">{cover.icon}</div>}
          <div className="illustrated-label">
            <span>{cover.label}</span>
            {cover.sublabel && <span className="illustrated-sublabel">{cover.sublabel}</span>}
          </div>
        </div>
      )}

      {/* Card body */}
      <div className="trip-card-body">
        {/* Date + duration row */}
        <div className="trip-date-row">
          {cover.type === 'illustrated' && (
            <span className="trip-date-text">{dateLabel}</span>
          )}
          {durationLabel && (
            <span className="trip-duration">&bull; {durationLabel}</span>
          )}
        </div>

        <h3 className="trip-entry-title">{name}</h3>

        {location && (
          <div className="trip-location">
            <PinIcon />
            <span>{location}</span>
          </div>
        )}

        {description && (
          <p className="trip-description">{description}</p>
        )}

        {/* Participants */}
        <div className="trip-participants">
          {members.slice(0, 3).map(u => (
            <UserAvatar key={u.id} user={u} size={28} />
          ))}
          {otherCount && (
            <div className="others-chip">+{otherCount} others</div>
          )}
          {isSolo && (
            <div className="solo-chip">
              <UserAvatar user={me} size={22} />
              <span>Solo Journey</span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default function HomeScreen() {
  const navigate = useNavigate()

  return (
    <div className="screen home-screen">
      {/* Top bar */}
      <div className="home-topbar">
        <button className="icon-btn">
          <MenuIcon />
        </button>
        <span className="home-brand">Field Journal</span>
        <div className="home-avatar-wrap">
          <UserAvatar user={USERS[0]} size={32} />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="home-scroll">
        {/* Hero heading */}
        <div className="home-hero">
          <h1 className="home-display">Your<br />Wanderings</h1>
          <p className="home-tagline">
            The quiet collection of trails taken, mountains climbed, and the
            memories captured along the way.
          </p>

          <button
            className="btn-primary start-trip-btn"
            onClick={() => navigate('/create')}
          >
            <BarChartIcon />
            Start a New Trip
          </button>
        </div>

        {/* Trip list */}
        <div className="trip-list">
          {TRIPS.map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              onClick={() => navigate(trip.route)}
            />
          ))}
        </div>

        {/* Older entries */}
        <button className="older-entries-btn">
          <ChevronDown />
          OLDER ENTRIES
        </button>
      </div>

      <HomeNav active="trips" />
    </div>
  )
}
