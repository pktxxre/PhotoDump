import { useNavigate } from 'react-router-dom'
import { DAY_GROUPS, USERS } from '../data'
import { MenuIcon, MapIcon } from '../components/Icons'
import UserAvatar from '../components/UserAvatar'
import BottomNav from '../components/BottomNav'
import { TRIP } from '../data'

export default function TripGallery() {
  const navigate = useNavigate()

  const userMap = Object.fromEntries(USERS.map(u => [u.id, u]))

  return (
    <div className="screen gallery-screen">
      {/* Header */}
      <div className="screen-header gallery-header">
        <button className="icon-btn">
          <MenuIcon size={22} color="var(--primary)" />
        </button>
        <h2 style={{ textAlign: 'left', flex: 1 }}>{TRIP.name}</h2>
        <button className="switch-map-btn" onClick={() => navigate('/explore')}>
          <MapIcon size={14} color="var(--on-surface)" />
          Switch to Map
        </button>
      </div>

      {/* Photo feed */}
      <div className="gallery-scroll">
        {DAY_GROUPS.map(group => (
          <div key={group.dateLabel} className="day-section">
            <div className="day-meta">{group.dateLabel}</div>
            <h2 className="day-title">{group.dayTitle}</h2>

            {group.photos.map(photo => {
              const uploader = userMap[photo.uploaderId]
              return (
                <div key={photo.id} className="gallery-photo-card">
                  <img src={photo.url} alt={photo.caption} loading="lazy" />
                  <div className="gallery-card-meta">
                    {photo.caption ? (
                      <p className="gallery-caption">{photo.caption}</p>
                    ) : (
                      <p className="gallery-location">{photo.location.name}</p>
                    )}
                    {uploader && <UserAvatar user={uploader} size={28} />}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <BottomNav active="journal" />
    </div>
  )
}
