import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UPLOAD_PHOTOS, QUEUE_ITEMS, TRIP } from '../data'
import {
  XIcon, MapIcon, CloudOffIcon, CheckIcon, SyncIcon, ImageIcon,
} from '../components/Icons'
import BottomNav from '../components/BottomNav'

export default function UploadQueue() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Set<string>>(
    new Set(['up1', 'up2', 'up4', 'up5'])
  )

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="screen upload-screen">
      {/* Header */}
      <div className="screen-header">
        <button className="icon-btn" onClick={() => navigate('/')}>
          <XIcon size={20} color="var(--primary)" />
        </button>
        <h2>{TRIP.name}</h2>
        <button className="icon-btn">
          <MapIcon size={20} color="var(--primary)" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="upload-scroll">
        {/* Offline notice */}
        <div className="offline-notice">
          <span className="offline-icon">
            <CloudOffIcon size={20} />
          </span>
          <span>Captured offline. We'll sync when you're back on the trail.</span>
        </div>

        {/* Section heading */}
        <div className="section-top">
          <div>
            <h2>Select Photos</h2>
            <p>Choose moments from your journey today.</p>
          </div>
          <div className="count-chip">{selected.size} Selected</div>
        </div>

        {/* Photo grid */}
        <div className="photo-grid">
          {UPLOAD_PHOTOS.map(p => (
            <div
              key={p.id}
              className={`grid-photo${selected.has(p.id) ? ' selected' : ''}`}
              onClick={() => toggle(p.id)}
            >
              <img src={p.thumbnail} alt="" loading="lazy" />
              <div className="grid-select-ring">
                {selected.has(p.id) && (
                  <CheckIcon size={14} color="white" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Upload queue card */}
        <div className="upload-queue-card">
          <div className="queue-header">
            <div className="queue-spin">
              <SyncIcon size={18} color="var(--primary)" />
            </div>
            <div className="queue-info">
              <div className="queue-title">Upload Queue</div>
              <div className="queue-sub">3 photos syncing...</div>
            </div>
            <div className="sync-chip">BACKGROUND SYNC</div>
          </div>

          {QUEUE_ITEMS.map(item => (
            <div key={item.filename} className="queue-item">
              <div className="queue-item-top">
                <div className="queue-item-icon">
                  <ImageIcon size={16} color="var(--on-surface-variant)" />
                </div>
                <span className="queue-item-name">{item.filename}</span>
                {item.status === 'uploading' && item.progress !== undefined ? (
                  <span className="queue-item-pct">{item.progress}%</span>
                ) : (
                  <span className="queue-item-queued">Ready to upload when online</span>
                )}
              </div>
              {item.status === 'uploading' && item.progress !== undefined && (
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="screen-actions">
        <button className="btn-primary" onClick={() => navigate('/')}>
          📷 Add {selected.size} Photos to Trip
        </button>
        <button className="btn-secondary">
          Keep Selecting
        </button>
      </div>

      <BottomNav active="capture" />
    </div>
  )
}
