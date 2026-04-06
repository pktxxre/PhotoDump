export interface User {
  id: string
  name: string
  initials: string
  avatar: string
  color: string
}

export interface PhotoLocation {
  lat: number
  lng: number
  name: string
}

export interface Photo {
  id: string
  url: string
  thumbnail: string
  caption: string
  uploaderId: string
  capturedAt: Date
  location: PhotoLocation
}

export interface DayGroup {
  dateLabel: string
  dayTitle: string
  photos: Photo[]
}

export interface UploadPhoto {
  id: string
  thumbnail: string
}

export interface QueueItem {
  filename: string
  status: 'uploading' | 'queued'
  progress?: number
}

export type TripCover =
  | { type: 'photo'; url: string; dateBadge?: string; label?: string }
  | { type: 'illustrated'; gradient: string; label: string; sublabel?: string; icon?: string }

export interface TripEntry {
  id: string
  name: string
  location?: string
  dateLabel: string
  durationLabel?: string
  description?: string
  cover: TripCover
  members: User[]
  otherCount?: number
  isSolo?: boolean
  route: string
}
