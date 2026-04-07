import { useState, useRef } from 'react'
import type { LocationPin } from '../types'
import UserAvatar from './UserAvatar'

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const SliderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="8 12 2 12" /><polyline points="22 12 16 12" />
    <polyline points="8 8 8 16" /><polyline points="16 8 16 16" />
  </svg>
)

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

interface Props {
  location: LocationPin
  onClose: () => void
  noNavOffset?: boolean
}

export default function LocationDrawer({ location, onClose, noNavOffset }: Props) {
  const [view, setView] = useState<'slider' | 'grid'>('slider')
  const [activeIndex, setActiveIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const handleSliderScroll = () => {
    const el = sliderRef.current
    if (!el) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    setActiveIndex(index)
  }

  const goTo = (i: number) => {
    const el = sliderRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
    setActiveIndex(i)
  }

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
            <h3 className="drawer-location-name">{location.label}</h3>
            <span className="drawer-photo-count">{location.photos.length} photos</span>
          </div>
          <div className="drawer-controls">
            <button
              className={`view-toggle-btn ${view === 'slider' ? 'active' : ''}`}
              onClick={() => setView('slider')}
              aria-label="Slider view"
            >
              <SliderIcon />
            </button>
            <button
              className={`view-toggle-btn ${view === 'grid' ? 'active' : ''}`}
              onClick={() => setView('grid')}
              aria-label="Grid view"
            >
              <GridIcon />
            </button>
            <button className="drawer-close-btn" onClick={onClose} aria-label="Close">
              <XIcon />
            </button>
          </div>
        </div>

        {/* Slider view */}
        {view === 'slider' && (
          <div className="drawer-slider-wrap">
            <div
              className="drawer-slider"
              ref={sliderRef}
              onScroll={handleSliderScroll}
            >
              {location.photos.map((photo, i) => (
                <div key={i} className="drawer-slide">
                  <img src={photo.url} alt={photo.caption} loading={i < 2 ? 'eager' : 'lazy'} />
                  <div className="drawer-slide-meta">
                    <p className="drawer-slide-caption">{photo.caption}</p>
                    <UserAvatar user={photo.uploader} size={26} />
                  </div>
                </div>
              ))}
            </div>

            {/* Dot indicators */}
            {location.photos.length > 1 && (
              <div className="slider-dots">
                {location.photos.map((_, i) => (
                  <button
                    key={i}
                    className={`slider-dot ${i === activeIndex ? 'active' : ''}`}
                    onClick={() => goTo(i)}
                    aria-label={`Photo ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Grid view */}
        {view === 'grid' && (
          <div className="drawer-grid">
            {location.photos.map((photo, i) => (
              <div key={i} className="drawer-grid-item" onClick={() => { setView('slider'); goTo(i) }}>
                <img src={photo.url} alt={photo.caption} loading={i < 4 ? 'eager' : 'lazy'} />
                <div className="drawer-grid-avatar">
                  <UserAvatar user={photo.uploader} size={22} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
