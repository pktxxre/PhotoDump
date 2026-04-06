import { useNavigate } from 'react-router-dom'
import { CompassIcon, PlusIcon, JournalIcon } from './Icons'

interface Props {
  active: 'explore' | 'capture' | 'journal'
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
        className={`nav-item capture-tab ${active === 'capture' ? 'active' : ''}`}
        onClick={() => navigate('/capture')}
      >
        <div className="nav-icon">
          <PlusIcon size={22} />
        </div>
        <span>CAPTURE</span>
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
