import type { LocationPhoto } from '../types'

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

interface Props {
  title: string
  photos: LocationPhoto[]
  onClose: () => void
  noNavOffset?: boolean
}

export default function LocationDrawer({ title, photos, onClose, noNavOffset }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose} />

      {/* Drawer */}
      <div className={`location-drawer${noNavOffset ? ' location-drawer--flush' : ''}`}>
        {/* Handle bar */}
        <div className="drawer-handle-bar" />

        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <h3 className="drawer-location-name">{title}</h3>
            <span className="drawer-photo-count">{photos.length} photo{photos.length !== 1 ? 's' : ''}</span>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close">
            <XIcon />
          </button>
        </div>

        {/* Grid — always shown */}
        <div className="drawer-grid">
          {photos.map((photo, i) => (
            <div key={i} className="drawer-grid-item">
              <img className="drawer-grid-photo" src={photo.url} alt="" loading={i < 4 ? 'eager' : 'lazy'} />
              <div className="drawer-grid-uploader">
                <span className="drawer-grid-uploader-name">{photo.uploader.name}</span>
                <img
                  className="drawer-grid-uploader-avatar"
                  src={photo.uploader.avatar}
                  alt={photo.uploader.name}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
