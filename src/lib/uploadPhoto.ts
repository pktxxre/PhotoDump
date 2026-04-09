import { supabase } from './supabase'
import exifr from 'exifr'

export interface PhotoMeta {
  dateTaken?: Date
  lat?: number
  lng?: number
}

export interface UploadedPhoto {
  id: string
  url: string
  uploaderName: string
  uploaderId: string | null
  dateTaken: Date | null
  lat: number | null
  lng: number | null
  createdAt: Date
}

export async function extractMeta(file: File): Promise<PhotoMeta> {
  try {
    const data = await exifr.parse(file, { gps: true, tiff: true, exif: true })
    if (!data) return {}
    return {
      dateTaken: data.DateTimeOriginal ?? data.CreateDate ?? undefined,
      lat: typeof data.latitude === 'number' ? data.latitude : undefined,
      lng: typeof data.longitude === 'number' ? data.longitude : undefined,
    }
  } catch {
    return {}
  }
}

export async function uploadPhoto(
  file: File,
  albumId: string,
  onProgress: (pct: number) => void,
): Promise<UploadedPhoto | null> {
  onProgress(0)

  // Phase 1: fake fast progress 0 → 85% in ~700ms
  let fakePct = 0
  const fakeTimer = setInterval(() => {
    fakePct = Math.min(85, fakePct + 3.5)
    onProgress(fakePct)
    if (fakePct >= 85) clearInterval(fakeTimer)
  }, 28)

  // Extract metadata in parallel with the fake progress
  const meta = await extractMeta(file)

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${albumId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { data: storageData, error: storageError } = await supabase.storage
    .from('photos')
    .upload(path, file, { contentType: file.type, upsert: false })

  clearInterval(fakeTimer)

  if (storageError || !storageData) {
    clearInterval(fakeTimer)
    onProgress(100)
    console.error('Storage upload failed:', storageError?.message)
    return null
  }

  const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(path)

  const { data: { user } } = await supabase.auth.getUser()

  const { data: row, error: dbError } = await supabase
    .from('album_photos')
    .insert({
      album_id: albumId,
      url: publicUrl,
      uploader_id: user?.id ?? null,
      uploader_name: user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? 'You',
      date_taken: meta.dateTaken?.toISOString() ?? null,
      lat: meta.lat ?? null,
      lng: meta.lng ?? null,
    })
    .select()
    .single()

  if (dbError || !row) {
    onProgress(0)
    console.error('DB error:', dbError?.message)
    return null
  }

  onProgress(100)

  return {
    id: row.id,
    url: row.url,
    uploaderName: row.uploader_name ?? 'You',
    uploaderId: row.uploader_id,
    dateTaken: row.date_taken ? new Date(row.date_taken) : null,
    lat: row.lat,
    lng: row.lng,
    createdAt: new Date(row.created_at),
  }
}
