import { useState, useRef } from 'react'

// ── Color math ────────────────────────────────────────────────
function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
  }
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)]
}

function rgbToHex(r: number, g: number, b: number): string {
  return [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()
}

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null
  return [r, g, b]
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const d = max - min
  let h = 0
  if (d !== 0) {
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60; break
      case gn: h = ((bn - rn) / d + 2) * 60; break
      case bn: h = ((rn - gn) / d + 4) * 60; break
    }
  }
  return [h, max === 0 ? 0 : d / max, max]
}

// ── Component ─────────────────────────────────────────────────
interface Props {
  value: string     // 6-char hex, no #
  onChange: (hex: string) => void
}

export default function ColorPicker({ value, onChange }: Props) {
  function initHsv(): [number, number, number] {
    const rgb = hexToRgb(value)
    return rgb ? rgbToHsv(...rgb) : [0, 0, 0]
  }

  const [hsv, setHsv] = useState<[number, number, number]>(initHsv)
  const [hexInput, setHexInput] = useState(value.toUpperCase())

  const sbRef  = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)

  const [h, s, v] = hsv
  const [pr, pg, pb] = hsvToRgb(h, 1, 1)
  const pureHex = rgbToHex(pr, pg, pb)

  function emit(newHsv: [number, number, number]) {
    const [nr, ng, nb] = hsvToRgb(...newHsv)
    const newHex = rgbToHex(nr, ng, nb)
    setHexInput(newHex)
    onChange(newHex)
  }

  // Generic pointer drag helper
  function makeDragger(
    ref: React.RefObject<HTMLDivElement | null>,
    onMove: (x: number, y: number, rect: DOMRect) => void
  ) {
    return (e: React.PointerEvent) => {
      const el = ref.current
      if (!el) return
      el.setPointerCapture(e.pointerId)
      const handle = (ev: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        onMove(ev.clientX, ev.clientY, rect)
      }
      handle(e.nativeEvent)
      el.addEventListener('pointermove', handle)
      el.addEventListener('pointerup', () => el.removeEventListener('pointermove', handle), { once: true })
    }
  }

  const handleSb = makeDragger(sbRef, (cx, cy, rect) => {
    const ns = Math.max(0, Math.min(1, (cx - rect.left) / rect.width))
    const nv = Math.max(0, Math.min(1, 1 - (cy - rect.top) / rect.height))
    const newHsv: [number, number, number] = [h, ns, nv]
    setHsv(newHsv)
    emit(newHsv)
  })

  const handleHue = makeDragger(hueRef, (cx, _, rect) => {
    const nh = Math.max(0, Math.min(360, ((cx - rect.left) / rect.width) * 360))
    const newHsv: [number, number, number] = [nh, s, v]
    setHsv(newHsv)
    emit(newHsv)
  })

  function handleHexChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6)
    setHexInput(raw.toUpperCase())
    if (raw.length === 6) {
      const rgb = hexToRgb(raw)
      if (rgb) {
        const newHsv = rgbToHsv(...rgb)
        setHsv(newHsv)
        onChange(rgbToHex(...rgb).toUpperCase())
      }
    }
  }

  return (
    <div className="cp-root">
      {/* Saturation / Brightness box */}
      <div
        ref={sbRef}
        className="cp-sb-box"
        style={{ '--cp-hue': `#${pureHex}` } as React.CSSProperties}
        onPointerDown={handleSb}
      >
        <div className="cp-sb-white" />
        <div className="cp-sb-black" />
        <div
          className="cp-sb-cursor"
          style={{ left: `${s * 100}%`, top: `${(1 - v) * 100}%` }}
        />
      </div>

      {/* Sliders */}
      <div className="cp-sliders">
        <div ref={hueRef} className="cp-hue-track" onPointerDown={handleHue}>
          <div
            className="cp-slider-thumb"
            style={{ left: `${(h / 360) * 100}%`, background: `#${pureHex}` }}
          />
        </div>
      </div>

      {/* Hex input */}
      <div className="cp-inputs">
        <div className="cp-hex-row">
          <span className="cp-label">#</span>
          <input
            className="cp-hex-input"
            value={hexInput}
            onChange={handleHexChange}
            maxLength={6}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  )
}
