import { useState } from 'react'

const STORAGE_KEY = 'fj_location_modal_seen'

const PinIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

const CrosshairIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
  </svg>
)

interface Props {
  onDismiss: () => void
}

export default function LocationPermissionModal({ onDismiss }: Props) {
  const [preciseLocation, setPreciseLocation] = useState(true)

  function handleGotIt() {
    localStorage.setItem(STORAGE_KEY, '1')
    onDismiss()
  }

  return (
    <div className="loc-modal-backdrop">
      <div className="loc-modal">

        <div className="loc-modal-icon">
          <PinIcon />
        </div>

        <h2 className="loc-modal-title">Enable Location for Photos</h2>

        <ol className="loc-modal-steps">
          <li>
            <span className="loc-step-num">1</span>
            <p>Go to <strong>Settings &gt; Privacy &amp; Security &gt; Location Services</strong> and ensure it is toggled on.</p>
          </li>
          <li>
            <span className="loc-step-num">2</span>
            <p>Select <strong>Camera</strong> from the list and set access to <em>"While Using the App"</em>.</p>
          </li>
          <li>
            <span className="loc-step-num">3</span>
            <p>Turning on the <strong>"Precise Location"</strong> toggle allows for more accurate geotagging in your field notes.</p>
          </li>
        </ol>

        <div className="loc-modal-toggle-row">
          <CrosshairIcon />
          <span className="loc-toggle-label">Precise Location</span>
          <button
            className={`loc-toggle-switch ${preciseLocation ? 'on' : ''}`}
            onClick={() => setPreciseLocation(v => !v)}
            aria-label="Toggle precise location"
          >
            <span className="loc-toggle-thumb" />
          </button>
        </div>

        <button className="loc-modal-cta" onClick={handleGotIt}>
          Got it
        </button>

      </div>
    </div>
  )
}

export function shouldShowLocationModal(): boolean {
  return !localStorage.getItem(STORAGE_KEY)
}
