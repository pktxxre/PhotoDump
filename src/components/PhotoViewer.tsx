import { useState, useRef, useEffect, useCallback } from 'react'

interface Photo {
  url: string
  uploaderName?: string
  uploaderAvatar?: string
}

interface Props {
  photos: Photo[]
  initialIndex: number
  onClose: () => void
}

const SWIPE_THRESHOLD = 50

export default function PhotoViewer({ photos, initialIndex, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex)
  const [offset, setOffset] = useState(0)       // px drag in progress
  const [animating, setAnimating] = useState(false)
  const [showChrome, setShowChrome] = useState(true)

  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const isDragging  = useRef(false)
  const chromeTimer = useRef<ReturnType<typeof setTimeout>>()

  const photo = photos[index]

  // Auto-hide chrome after 3s of inactivity
  function resetChromeTimer() {
    setShowChrome(true)
    clearTimeout(chromeTimer.current)
    chromeTimer.current = setTimeout(() => setShowChrome(false), 3000)
  }

  useEffect(() => {
    resetChromeTimer()
    return () => clearTimeout(chromeTimer.current)
  }, [])

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Keyboard nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft')  navigate(-1)
      if (e.key === 'ArrowRight') navigate(1)
      if (e.key === 'Escape')     onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index])

  const navigate = useCallback((dir: number) => {
    const next = index + dir
    if (next < 0 || next >= photos.length) { setOffset(0); return }
    setAnimating(true)
    setOffset(dir < 0 ? window.innerWidth : -window.innerWidth)
    setTimeout(() => {
      setIndex(next)
      setOffset(0)
      setAnimating(false)
    }, 220)
    resetChromeTimer()
  }, [index, photos.length])

  // Touch handling
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isDragging.current = false
  }

  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current
    if (!isDragging.current && Math.abs(dy) > Math.abs(dx)) return // vertical scroll
    isDragging.current = true
    e.preventDefault()
    setOffset(dx)
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!isDragging.current || touchStartX.current === null) { setOffset(0); return }
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    isDragging.current = false
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      navigate(dx < 0 ? 1 : -1)
    } else {
      setOffset(0)
      resetChromeTimer()
    }
  }

  // Mouse drag (desktop)
  const mouseStartX = useRef<number | null>(null)
  function onMouseDown(e: React.MouseEvent) {
    mouseStartX.current = e.clientX
  }
  function onMouseMove(e: React.MouseEvent) {
    if (mouseStartX.current === null) return
    setOffset(e.clientX - mouseStartX.current)
  }
  function onMouseUp(e: React.MouseEvent) {
    if (mouseStartX.current === null) return
    const dx = e.clientX - mouseStartX.current
    mouseStartX.current = null
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      navigate(dx < 0 ? 1 : -1)
    } else {
      setOffset(0)
      if (Math.abs(dx) < 5) resetChromeTimer() // tap = toggle chrome
    }
  }

  const canPrev = index > 0
  const canNext = index < photos.length - 1

  return (
    <div
      className="pv-backdrop"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={() => { if (mouseStartX.current !== null) { mouseStartX.current = null; setOffset(0) } }}
    >
      {/* Images */}
      {photos.map((p, i) => {
        const base = (i - index) * 100
        const pct  = base + (offset / window.innerWidth) * 100
        const visible = Math.abs(i - index) <= 1
        if (!visible) return null
        return (
          <div
            key={i}
            className="pv-slide"
            style={{
              transform: `translateX(${pct}%)`,
              transition: animating ? 'transform 0.22s ease' : 'none',
            }}
          >
            <img
              src={p.url}
              alt=""
              className="pv-img"
              draggable={false}
            />
          </div>
        )
      })}

      {/* Top chrome */}
      <div className={`pv-chrome pv-top ${showChrome ? 'pv-chrome-visible' : ''}`}>
        <button className="pv-close" onClick={onClose}>✕</button>
        <span className="pv-counter">{index + 1} / {photos.length}</span>
        {photo.uploaderName && (
          <div className="pv-uploader">
            {photo.uploaderAvatar && (
              <img className="pv-uploader-avatar" src={photo.uploaderAvatar} alt="" />
            )}
            <span>{photo.uploaderName}</span>
          </div>
        )}
      </div>

      {/* Side arrows (desktop) */}
      {canPrev && (
        <button
          className={`pv-arrow pv-arrow-left ${showChrome ? 'pv-chrome-visible' : ''}`}
          onClick={e => { e.stopPropagation(); navigate(-1) }}
        >‹</button>
      )}
      {canNext && (
        <button
          className={`pv-arrow pv-arrow-right ${showChrome ? 'pv-chrome-visible' : ''}`}
          onClick={e => { e.stopPropagation(); navigate(1) }}
        >›</button>
      )}

      {/* Dot indicators */}
      {photos.length > 1 && (
        <div className={`pv-dots ${showChrome ? 'pv-chrome-visible' : ''}`}>
          {photos.map((_, i) => (
            <div key={i} className={`pv-dot ${i === index ? 'active' : ''}`} />
          ))}
        </div>
      )}
    </div>
  )
}
