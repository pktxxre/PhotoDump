import { useNavigate } from 'react-router-dom'
import { CompassIcon, JournalIcon } from './Icons'

const AlbumsIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="16" height="13" rx="2" />
    <path d="M6 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
  </svg>
)

interface Props {
  active: 'explore' | 'albums' | 'journal'
}

export default function BottomNav({ active }: Props) {
  const navigate = useNavigate()

  return (
    <nav className="bottom-nav">
      <button
        className={`nav-item ${active === 'explore' ? 'active' : ''}`}
        onClick={() => navigate('/explore')}
      >
        <div className="nav-icon">
          <CompassIcon size={20} />
        </div>
        <span>EXPLORE</span>
      </button>

      <button
        className={`nav-item ${active === 'albums' ? 'active' : ''}`}
        onClick={() => navigate('/albums')}
      >
        <div className="nav-icon">
          <AlbumsIcon size={20} />
        </div>
        <span>ALBUMS</span>
      </button>

      <button
        className={`nav-item ${active === 'journal' ? 'active' : ''}`}
        onClick={() => navigate('/journal')}
      >
        <div className="nav-icon">
          <JournalIcon size={20} />
        </div>
        <span>JOURNAL</span>
      </button>
    </nav>
  )
}
