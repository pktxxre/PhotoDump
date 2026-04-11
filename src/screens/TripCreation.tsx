import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createAlbum, updateAlbumCover } from '../lib/albums'
import { uploadPhoto } from '../lib/uploadPhoto'
import { XIcon, CameraAddIcon } from '../components/Icons'

export default function TripCreation() {
  const navigate        = useNavigate()
  const inputRef        = useRef<HTMLInputElement>(null)
  const fileInputRef    = useRef<HTMLInputElement>(null)
  const skipRefocusRef  = useRef(false)

  const [tripName, setTripName]     = useState('')
  const [nameError, setNameError]   = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls]   = useState<string[]>([])

  // Revoke blob URLs on unmount
  useEffect(() => {
    return () => { previewUrls.forEach(u => URL.revokeObjectURL(u)) }
  }, [previewUrls])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    e.target.value = ''
    const urls = files.map(f => URL.createObjectURL(f))
    setPendingFiles(prev => [...prev, ...files])
    setPreviewUrls(prev => [...prev, ...urls])
  }

  async function handleCreate() {
    if (!tripName.trim()) {
      setNameError('Give this trip a name to get started')
      inputRef.current?.focus()
      return
    }
    setNameError('')
    setLoading(true)
    setError('')
    const result = await createAlbum(tripName.trim())
    if ('error' in result) { setLoading(false); setError(result.error); return }

    const albumId = result.id

    // Upload any pending photos sequentially
    let firstUrl: string | null = null
    for (const file of pendingFiles) {
      const uploaded = await uploadPhoto(file, albumId, () => {})
      if (uploaded && !firstUrl) firstUrl = uploaded.url
    }
    if (firstUrl) await updateAlbumCover(albumId, firstUrl)

    navigate(`/album/${albumId}`)
  }

  // Keep keyboard up — re-focus the input on blur unless a safe target was tapped
  function handleBlur() {
    if (skipRefocusRef.current) {
      skipRefocusRef.current = false
      return
    }
    setTimeout(() => inputRef.current?.focus(), 10)
  }

  function allowBlur() {
    skipRefocusRef.current = true
  }

  return (
    <div className="screen creation-screen">
      <div className="screen-header">
        <button className="icon-btn" onPointerDown={allowBlur} onClick={() => navigate('/')}>
          <XIcon size={20} color="var(--primary)" />
        </button>
        <h2>{tripName || 'New Trip'}</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="creation-scroll">
        <h1 className="display-title">Where to next?</h1>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <div
          className="cover-photo-area"
          onPointerDown={allowBlur}
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrls.length > 0 ? (
            <>
              <img src={previewUrls[0]} alt="Preview" className="cover-photo-preview" />
              {previewUrls.length > 1 && (
                <div className="cover-photo-count-badge">+{previewUrls.length - 1}</div>
              )}
            </>
          ) : (
            <>
              <div className="cam-icon">
                <CameraAddIcon size={24} color="var(--on-surface-variant)" />
              </div>
              <span className="cover-photo-label">ADD PHOTOS</span>
            </>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">TRIP NAME</label>
          <input
            ref={inputRef}
            className={`form-input${nameError ? ' form-input-error' : ''}`}
            placeholder="e.g., The Solitude of Big Sur"
            value={tripName}
            onChange={e => { setTripName(e.target.value); if (nameError) setNameError('') }}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            onBlur={handleBlur}
            autoFocus
          />
          {nameError && <p className="form-field-error">{nameError}</p>}
        </div>

        {error && <p className="form-field-error">{error}</p>}

        <button
          className="btn-primary"
          onPointerDown={allowBlur}
          onClick={handleCreate}
          disabled={loading}
        >
          {loading
            ? (pendingFiles.length > 0 ? 'Uploading…' : 'Creating…')
            : 'Begin the Journey →'}
        </button>
      </div>
    </div>
  )
}
